/**
 * "Files → PDF" tool: importing inputs (with previews) and running the conversion.
 */
import { useAccount } from "@/lib/account";
import type { ConvertItem, JobContext } from "@/lib/convert/engine";
import { detectFormat } from "@/lib/convert/formats";
import { deliver } from "@/lib/deliver";
import { baseNameOf } from "@/lib/files";
import { closeDocument, canvasToBlob, openDocument, PasswordError, releaseCanvas, renderPage } from "@/lib/pdf/pdfjs";
import {
  appendItems,
  endJob,
  removeItem,
  requestPassword,
  setOptions,
  startJob,
  toast,
  updateItem,
  updateJob,
  useApp,
  type ConversionSource,
  type Item,
  type ResultState,
} from "@/lib/store";
import { INTL_LOCALE } from "@/i18n/config";
import { fmt, plural } from "@/i18n/format";
import { runtimeLocale, t } from "@/i18n/runtime";
import { isAbortError } from "@/lib/utils";

let counter = 0;
const newId = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

export function describeError(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return t().common.unexpected;
}

const exists = (id: string) => useApp.getState().items.some((item) => item.id === id);

/** Runs `task` for every entry with bounded concurrency. */
async function runLimited<T>(entries: readonly T[], limit: number, task: (entry: T) => Promise<void>) {
  let next = 0;
  const worker = async () => {
    while (next < entries.length) await task(entries[next++]);
  };
  await Promise.all(Array.from({ length: Math.min(limit, entries.length) }, worker));
}

export async function addFiles(input: Iterable<File>) {
  const files = Array.from(input);
  const accepted: Item[] = [];
  const rejected: string[] = [];

  for (const file of files) {
    const head = new Uint8Array(await file.slice(0, 4096).arrayBuffer());
    const format = file.size > 0 ? detectFormat(file.name, file.type, head) : null;
    if (!format) {
      rejected.push(file.name);
      continue;
    }
    accepted.push({ id: newId(), file, name: file.name, size: file.size, format, status: "processing", rotation: 0 });
  }

  if (rejected.length) {
    const list = rejected.length > 3 ? plural(runtimeLocale(), t().files.count, rejected.length) : rejected.slice(0, 3).join(", ");
    toast(fmt(t().convert.rejected, { list }), "error");
  }
  if (!accepted.length) return;

  appendItems(accepted);
  await runLimited(accepted, 3, processItem);
}

async function processItem(item: Item) {
  try {
    if (item.format.kind === "image") {
      const { createImagePreview } = await import("@/lib/convert/images");
      const preview = await createImagePreview(item.file, item.format.format);
      if (!exists(item.id)) return URL.revokeObjectURL(preview.url);
      updateItem(item.id, {
        status: "ready",
        preview: { url: preview.url, width: preview.width, height: preview.height, count: preview.frames, dpi: preview.dpi },
      });
      return;
    }

    if (item.format.kind === "pdf" || item.format.kind === "office") {
      // Office documents may come back as a first-page preview: the card still shows their real length.
      const office = item.format.kind === "office" ? await (await import("@/lib/convert/office")).officeToPdf(item.file) : null;
      const bytes = office ? office.bytes : new Uint8Array(await item.file.arrayBuffer());
      let password = item.password;
      let pdf;
      for (;;) {
        try {
          pdf = await openDocument(bytes, password);
          break;
        } catch (error) {
          if (!(error instanceof PasswordError)) throw error;
          const entered = await requestPassword(item.name, error.reason);
          if (entered === null) {
            removeItem(item.id);
            toast(fmt(t().convert.passwordSkipped, { name: item.name }));
            return;
          }
          password = entered;
        }
      }
      try {
        const viewport = (await pdf.getPage(1)).getViewport({ scale: 1 });
        const canvas = await renderPage(pdf, 0, 480 / viewport.width);
        const url = URL.createObjectURL(await canvasToBlob(canvas, "image/jpeg", 0.85));
        releaseCanvas(canvas);
        if (!exists(item.id)) return URL.revokeObjectURL(url);
        updateItem(item.id, {
          status: "ready",
          password,
          preview: { url, width: viewport.width, height: viewport.height, count: office?.pages ?? pdf.numPages },
        });
      } finally {
        void closeDocument(pdf);
      }
      return;
    }

    // Text: show the first lines. Cut at a newline so a multi-byte character is never split.
    const { decodeText } = await import("@/lib/convert/text-model");
    let bytes = new Uint8Array(await item.file.slice(0, 65536).arrayBuffer());
    if (item.file.size > bytes.length) bytes = bytes.subarray(0, Math.max(1, bytes.lastIndexOf(0x0a)));
    const lines = decodeText(bytes)
      .split(/\r\n|\r|\n/)
      .slice(0, 40)
      .map((line) => line.replace(/\t/g, "  ").slice(0, 160));
    updateItem(item.id, { status: "ready", preview: { width: 595, height: 842, lines } });
  } catch (error) {
    console.error(error);
    if (exists(item.id)) updateItem(item.id, { status: "error", error: describeError(error) });
  }
}

export async function addSampleFiles() {
  const { createSampleFiles } = await import("@/lib/convert/sample-files");
  await addFiles(await createSampleFiles());
}

/** Images pasted with Ctrl+V (screenshots, copied images). */
export function filesFromClipboard(data: DataTransfer | null) {
  if (!data) return [];
  const stamp = new Date().toLocaleTimeString(INTL_LOCALE[runtimeLocale()], { hour12: false }).replace(/[:.\s]/g, "-");
  return Array.from(data.files).map((file, index) => {
    const generic = !file.name || /^image\.\w+$/i.test(file.name);
    if (!generic) return file;
    const extension = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "png";
    return new File([file], `${t().dropzone.pastedName}-${stamp}${index ? `-${index + 1}` : ""}.${extension}`, { type: file.type });
  });
}

export function defaultOutputName(items: readonly Item[], fallback = t().convert.defaultName) {
  return items.length === 1 ? baseNameOf(items[0].name) : fallback;
}

export async function runConversion() {
  const state = useApp.getState();
  if (state.job) return;
  if (state.items.some((item) => item.status === "processing")) {
    toast(t().convert.stillLoading);
    return;
  }
  const ready = state.items.filter((item) => item.status === "ready");
  if (!ready.length) {
    toast(t().convert.nothing, "error");
    return;
  }

  const source: ConversionSource = {
    items: ready.map(({ id, file, name, format, rotation, password }): ConvertItem => ({ id, file, name, format, rotation, password })),
    options: { ...state.options, fileName: state.options.fileName.trim() || defaultOutputName(ready) },
    skipped: state.items.length - ready.length,
  };
  const controller = new AbortController();
  startJob(t().convert.jobTitle, () => controller.abort());

  try {
    // Subscribers get office documents in full, even if their card was loaded before signing in.
    const result = await buildResult(source, { signal: controller.signal, fullOffice: useAccount.getState().access?.active === true });
    const office = source.items.filter((item) => item.format.kind === "office").map((item) => item.file);
    const partial = office.length > 0 && (await (await import("@/lib/convert/office")).hasPreviews(office));
    await deliver(result, partial ? source : undefined);
  } catch (error) {
    if (isAbortError(error)) toast(t().convert.cancelled);
    else {
      console.error(error);
      toast(describeError(error), "error");
    }
  } finally {
    endJob();
  }
}

async function buildResult(source: ConversionSource, ctx: Omit<JobContext, "progress">): Promise<ResultState> {
  const started = performance.now();
  const { convertToPdf } = await import("@/lib/convert/engine");
  const files = await convertToPdf(source.items, source.options, { ...ctx, progress: updateJob });
  const { convert, files: filesText } = t();
  const locale = runtimeLocale();
  const notes: string[] = [];
  if (source.options.output === "merge") {
    notes.push(plural(locale, convert.mergedNote, files[0]?.pages ?? 0, { files: plural(locale, filesText.count, source.items.length) }));
  }
  if (source.skipped) notes.push(plural(locale, convert.skippedNote, source.skipped));
  return {
    title: files.length === 1 ? convert.resultOne : plural(locale, convert.resultMany, files.length),
    files,
    archiveName: `${source.options.fileName}.zip`,
    elapsed: performance.now() - started,
    notes,
  };
}

/** After payment: the same conversion again, now with the office documents in full. */
export async function convertInFull(source: ConversionSource) {
  const controller = new AbortController();
  startJob(t().convert.jobTitle, () => controller.abort());
  try {
    return await buildResult(source, { signal: controller.signal, fullOffice: true });
  } finally {
    endJob();
  }
}

/** Puts the inputs of a conversion back into an empty workspace (keeping order, rotation and passwords). */
export function restoreWorkspace(source: ConversionSource) {
  if (useApp.getState().items.length) return;
  const items: Item[] = source.items.map((item) => ({ ...item, id: newId(), size: item.file.size, status: "processing" }));
  appendItems(items);
  setOptions(source.options);
  void runLimited(items, 3, processItem);
}
