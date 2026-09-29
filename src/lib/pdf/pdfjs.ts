/**
 * pdf.js integration (browser only). The library is loaded lazily so it never
 * ends up in the server bundle or the landing page's critical path.
 */
import type { PDFDocumentProxy } from "pdfjs-dist/legacy/build/pdf.mjs";
import { t } from "@/i18n/runtime";

type Pdfjs = typeof import("pdfjs-dist/legacy/build/pdf.mjs");
export type { PDFDocumentProxy };

export interface PageInfo {
  /** Displayed size in points (after /Rotate and /UserUnit). */
  width: number;
  height: number;
}

let pdfjsPromise: Promise<Pdfjs> | null = null;

const assetBase = (version: string) => `/pdfjs/${version}/`;

export function loadPdfjs(): Promise<Pdfjs> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist/legacy/build/pdf.mjs")
      .then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc = `${assetBase(pdfjs.version)}pdf.worker.min.mjs`;
        return pdfjs;
      })
      .catch((error) => {
        pdfjsPromise = null;
        throw error;
      });
  }
  return pdfjsPromise;
}

export class PasswordError extends Error {
  constructor(readonly reason: "need" | "incorrect") {
    super(reason === "need" ? "Password required" : "Incorrect password"); // handled by the password dialog, never shown
    this.name = "PasswordError";
  }
}

export async function openDocument(bytes: Uint8Array, password?: string): Promise<PDFDocumentProxy> {
  const pdfjs = await loadPdfjs();
  const base = assetBase(pdfjs.version);
  const task = pdfjs.getDocument({
    data: bytes.slice(), // pdf.js transfers (detaches) the buffer it receives
    password,
    cMapUrl: `${base}cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `${base}standard_fonts/`,
    wasmUrl: `${base}wasm/`,
    iccUrl: `${base}iccs/`,
    enableXfa: false,
  });
  try {
    return await task.promise;
  } catch (error) {
    void task.destroy();
    const name = error instanceof Error ? error.name : "";
    if (name === "PasswordException") {
      const code = (error as Error & { code?: number }).code;
      throw new PasswordError(code === pdfjs.PasswordResponses.INCORRECT_PASSWORD ? "incorrect" : "need");
    }
    if (name === "InvalidPDFException") throw new Error(t().convert.invalidPdf);
    throw error;
  }
}

export function closeDocument(pdf: PDFDocumentProxy) {
  return pdf.loadingTask.destroy();
}

export async function readPageInfo(pdf: PDFDocumentProxy, onProgress?: (done: number, total: number) => void): Promise<PageInfo[]> {
  const total = pdf.numPages;
  const pages = new Array<PageInfo>(total);
  const batchSize = 24;
  for (let start = 0; start < total; start += batchSize) {
    const end = Math.min(total, start + batchSize);
    await Promise.all(
      Array.from({ length: end - start }, async (_, offset) => {
        const page = await pdf.getPage(start + offset + 1);
        const { width, height } = page.getViewport({ scale: 1 });
        pages[start + offset] = { width, height };
      }),
    );
    onProgress?.(end, total);
  }
  return pages;
}

/** Upper bound for a single canvas; keeps mobile Safari & friends alive. */
const MAX_CANVAS_PIXELS = 40_000_000;

export function releaseCanvas(canvas: HTMLCanvasElement) {
  canvas.width = 0;
  canvas.height = 0;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error(t().convert.encodeFailed))), type, quality);
  });
}

/** Renders a page at `scale` (1 = 72 DPI). Very large renders are scaled down to stay within canvas limits. */
export async function renderPage(pdf: PDFDocumentProxy, pageIndex: number, scale: number) {
  const pdfjs = await loadPdfjs();
  const page = await pdf.getPage(pageIndex + 1);
  let viewport = page.getViewport({ scale });
  const pixels = viewport.width * viewport.height;
  if (pixels > MAX_CANVAS_PIXELS) viewport = page.getViewport({ scale: scale * Math.sqrt(MAX_CANVAS_PIXELS / pixels) });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(viewport.width));
  canvas.height = Math.max(1, Math.round(viewport.height));
  // The "print" intent renders without requestAnimationFrame, so exports keep
  // running when the tab is in the background.
  await page.render({ canvas, viewport, intent: "print", annotationMode: pdfjs.AnnotationMode.ENABLE }).promise;
  return canvas;
}

export async function renderThumbnail(pdf: PDFDocumentProxy, pageIndex: number, info: PageInfo, widthPx: number) {
  const canvas = await renderPage(pdf, pageIndex, widthPx / info.width);
  try {
    return await canvasToBlob(canvas, "image/jpeg", 0.85);
  } finally {
    releaseCanvas(canvas);
    (await pdf.getPage(pageIndex + 1)).cleanup();
  }
}
