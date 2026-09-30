/**
 * "PDF → image" tool: opening the PDF and exporting its pages as JPG/PNG.
 */
import { describeError } from "@/lib/converter";
import { baseNameOf, padNumber, withJpegDpi, withPngDpi, type OutputFile } from "@/lib/files";
import { canvasToBlob, openDocument, PasswordError, readPageInfo, releaseCanvas, renderPage, type PDFDocumentProxy } from "@/lib/pdf/pdfjs";
import { createSession, getSession, setSession } from "@/lib/pdf/session";
import { deliver } from "@/lib/deliver";
import { endJob, requestPassword, setLoading, setPdfDoc, startJob, toast, updateJob, useApp } from "@/lib/store";
import { fmt, plural } from "@/i18n/format";
import { runtimeLocale, t } from "@/i18n/runtime";
import { isAbortError, throwIfAborted, yieldToBrowser } from "@/lib/utils";

export async function openPdfForImages(file: File) {
  if (useApp.getState().loading) return;
  if (!(file.type === "application/pdf" || /\.pdf$/i.test(file.name))) {
    toast(fmt(t().pdfTool.notPdf, { name: file.name }), "error");
    return;
  }
  setLoading({ fileName: file.name, phase: t().pdfTool.reading, done: 0, total: 0 });
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let password: string | undefined;
    let pdf: PDFDocumentProxy;
    for (;;) {
      try {
        setLoading({ fileName: file.name, phase: t().pdfTool.opening, done: 0, total: 0 });
        pdf = await openDocument(bytes, password);
        break;
      } catch (error) {
        if (!(error instanceof PasswordError)) throw error;
        const entered = await requestPassword(file.name, error.reason);
        if (entered === null) return;
        password = entered;
      }
    }
    const pages = await readPageInfo(pdf, (done, total) => setLoading({ fileName: file.name, phase: t().pdfTool.readingPages, done, total }));
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    setSession(createSession({ id, pdf, pages }));
    setPdfDoc({ id, fileName: file.name, baseName: baseNameOf(file.name), size: file.size, pages, protected: password !== undefined });
  } catch (error) {
    toast(describeError(error), "error");
  } finally {
    setLoading(null);
  }
}

export function closePdfForImages() {
  setSession(null);
  setPdfDoc(null);
}

/** Pages that will be exported with the current options. */
export function exportPages() {
  const { pdfDoc, selection, imageOptions } = useApp.getState();
  if (!pdfDoc) return [];
  if (imageOptions.scope === "selected") return [...selection].sort((a, b) => a - b);
  return pdfDoc.pages.map((_, index) => index);
}

export async function runPdfToImages() {
  const state = useApp.getState();
  const session = getSession();
  if (state.job || !state.pdfDoc) return;
  if (!session) {
    setPdfDoc(null);
    toast(t().pdfTool.closed, "error");
    return;
  }
  const pages = exportPages();
  if (!pages.length) {
    toast(t().pdfTool.selectOne, "error");
    return;
  }

  const { format, dpi, quality } = state.imageOptions;
  const { baseName } = state.pdfDoc;
  const extension = format === "jpeg" ? "jpg" : "png";
  const text = t().pdfTool;
  const controller = new AbortController();
  startJob(text.jobTitle, () => controller.abort());
  const started = performance.now();

  try {
    const files: OutputFile[] = [];
    for (const [done, index] of pages.entries()) {
      throwIfAborted(controller.signal);
      updateJob(done, pages.length, fmt(text.page, { page: index + 1 }));
      const canvas = await renderPage(session.pdf, index, dpi / 72);
      const blob = await canvasToBlob(canvas, format === "jpeg" ? "image/jpeg" : "image/png", format === "jpeg" ? quality / 100 : undefined);
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const withDpi = format === "jpeg" ? withJpegDpi(bytes, dpi) : withPngDpi(bytes, dpi);
      files.push({
        name: `${baseName}_${padNumber(index + 1, state.pdfDoc.pages.length)}.${extension}`,
        blob: new Blob([withDpi as Uint8Array<ArrayBuffer>], { type: blob.type }),
        detail: fmt(text.detail, { page: index + 1, width: canvas.width, height: canvas.height }),
      });
      releaseCanvas(canvas);
      await yieldToBrowser();
    }
    await deliver({
      title: files.length === 1 ? text.resultOne : plural(runtimeLocale(), text.resultMany, files.length),
      files,
      archiveName: `${baseName}_${text.archiveSuffix}.zip`,
      elapsed: performance.now() - started,
      notes: [fmt(text.note, { format: format === "jpeg" ? "JPG" : "PNG", dpi })],
    });
  } catch (error) {
    if (isAbortError(error)) toast(text.cancelled);
    else {
      console.error(error);
      toast(describeError(error), "error");
    }
  } finally {
    endJob();
  }
}
