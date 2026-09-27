import { closeDocument, type PageInfo, type PDFDocumentProxy } from "./pdfjs";
import { ThumbnailService } from "./thumbnails";

/**
 * The PDF opened in the "PDF → image" tool. Heavy, non-serialisable objects
 * live here instead of in the React store.
 */
export interface PdfSession {
  id: string;
  pdf: PDFDocumentProxy;
  pages: PageInfo[];
  thumbnails: ThumbnailService;
}

let current: PdfSession | null = null;

export function getSession() {
  return current;
}

export function requireSession() {
  if (!current) throw new Error("Nincs megnyitott dokumentum.");
  return current;
}

export function createSession(init: Omit<PdfSession, "thumbnails">): PdfSession {
  return { ...init, thumbnails: new ThumbnailService(init.pdf, init.pages) };
}

export function setSession(next: PdfSession | null) {
  const previous = current;
  current = next;
  if (previous && previous !== next) {
    previous.thumbnails.dispose();
    void closeDocument(previous.pdf);
  }
}
