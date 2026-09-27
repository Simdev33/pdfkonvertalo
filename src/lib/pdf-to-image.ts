/**
 * "PDF → image" tool: opening the PDF and exporting its pages as JPG/PNG.
 */
import { describeError } from "@/lib/converter";
import { baseNameOf, padNumber, withJpegDpi, withPngDpi, type OutputFile } from "@/lib/files";
import { canvasToBlob, openDocument, PasswordError, readPageInfo, releaseCanvas, renderPage, type PDFDocumentProxy } from "@/lib/pdf/pdfjs";
import { createSession, getSession, setSession } from "@/lib/pdf/session";
import { endJob, requestPassword, setLoading, setPdfDoc, setResult, startJob, toast, updateJob, useApp } from "@/lib/store";
import { isAbortError, throwIfAborted, yieldToBrowser } from "@/lib/utils";

export async function openPdfForImages(file: File) {
  if (useApp.getState().loading) return;
  if (!(file.type === "application/pdf" || /\.pdf$/i.test(file.name))) {
    toast(`„${file.name}” nem PDF-fájl.`, "error");
    return;
  }
  setLoading({ fileName: file.name, phase: "Fájl beolvasása…", done: 0, total: 0 });
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let password: string | undefined;
    let pdf: PDFDocumentProxy;
    for (;;) {
      try {
        setLoading({ fileName: file.name, phase: "Dokumentum megnyitása…", done: 0, total: 0 });
        pdf = await openDocument(bytes, password);
        break;
      } catch (error) {
        if (!(error instanceof PasswordError)) throw error;
        const entered = await requestPassword(file.name, error.reason);
        if (entered === null) return;
        password = entered;
      }
    }
    const pages = await readPageInfo(pdf, (done, total) => setLoading({ fileName: file.name, phase: "Oldalak beolvasása…", done, total }));
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
    toast("A PDF már nincs megnyitva – nyisd meg újra.", "error");
    return;
  }
  const pages = exportPages();
  if (!pages.length) {
    toast("Jelölj ki legalább egy oldalt.", "error");
    return;
  }

  const { format, dpi, quality } = state.imageOptions;
  const { baseName } = state.pdfDoc;
  const extension = format === "jpeg" ? "jpg" : "png";
  const controller = new AbortController();
  startJob("Képek készítése", () => controller.abort());
  const started = performance.now();

  try {
    const files: OutputFile[] = [];
    for (const [done, index] of pages.entries()) {
      throwIfAborted(controller.signal);
      updateJob(done, pages.length, `${index + 1}. oldal`);
      const canvas = await renderPage(session.pdf, index, dpi / 72);
      const blob = await canvasToBlob(canvas, format === "jpeg" ? "image/jpeg" : "image/png", format === "jpeg" ? quality / 100 : undefined);
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const withDpi = format === "jpeg" ? withJpegDpi(bytes, dpi) : withPngDpi(bytes, dpi);
      files.push({
        name: `${baseName}_${padNumber(index + 1, state.pdfDoc.pages.length)}.${extension}`,
        blob: new Blob([withDpi as Uint8Array<ArrayBuffer>], { type: blob.type }),
        detail: `${index + 1}. oldal · ${canvas.width} × ${canvas.height} px`,
      });
      releaseCanvas(canvas);
      await yieldToBrowser();
    }
    setResult({
      title: files.length === 1 ? "Elkészült a kép" : `${files.length} kép elkészült`,
      files,
      archiveName: `${baseName}_kepek.zip`,
      elapsed: performance.now() - started,
      notes: [`${format === "jpeg" ? "JPG" : "PNG"}, ${dpi} DPI felbontással.`],
    });
  } catch (error) {
    if (isAbortError(error)) toast("A műveletet megszakítottad.");
    else {
      console.error(error);
      toast(describeError(error), "error");
    }
  } finally {
    endJob();
  }
}
