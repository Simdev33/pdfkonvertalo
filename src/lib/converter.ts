/**
 * "Files → PDF" tool: importing inputs (with previews) and running the conversion.
 */
import type { ConvertItem } from "@/lib/convert/engine";
import { detectFormat } from "@/lib/convert/formats";
import { baseNameOf } from "@/lib/files";
import { closeDocument, canvasToBlob, openDocument, PasswordError, releaseCanvas, renderPage } from "@/lib/pdf/pdfjs";
import {
  appendItems,
  endJob,
  removeItem,
  requestPassword,
  setResult,
  startJob,
  toast,
  updateItem,
  updateJob,
  useApp,
  type Item,
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
      const bytes =
        item.format.kind === "office"
          ? await (await import("@/lib/convert/office")).officeToPdf(item.file)
          : new Uint8Array(await item.file.arrayBuffer());
      let password: string | undefined;
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
        updateItem(item.id, { status: "ready", password, preview: { url, width: viewport.width, height: viewport.height, count: pdf.numPages } });
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

  const fileName = state.options.fileName.trim() || defaultOutputName(ready);
  const controller = new AbortController();
  startJob(t().convert.jobTitle, () => controller.abort());
  const started = performance.now();

  try {
    const { convertToPdf } = await import("@/lib/convert/engine");
    const items: ConvertItem[] = ready.map(({ id, file, name, format, rotation, password }) => ({ id, file, name, format, rotation, password }));
    const files = await convertToPdf(items, { ...state.options, fileName }, { signal: controller.signal, progress: updateJob });
    const skipped = state.items.length - ready.length;
    const { convert, files: filesText } = t();
    const locale = runtimeLocale();
    const notes: string[] = [];
    if (state.options.output === "merge") {
      notes.push(plural(locale, convert.mergedNote, files[0]?.pages ?? 0, { files: plural(locale, filesText.count, ready.length) }));
    }
    if (skipped) notes.push(plural(locale, convert.skippedNote, skipped));
    setResult({
      title: files.length === 1 ? convert.resultOne : plural(locale, convert.resultMany, files.length),
      files,
      archiveName: `${fileName}.zip`,
      elapsed: performance.now() - started,
      notes,
    });
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
