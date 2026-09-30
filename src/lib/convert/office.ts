/**
 * Office documents (Word, Excel, PowerPoint) are the one input the browser
 * cannot lay out itself: they are sent to /api/office-to-pdf and come back as a PDF.
 * Without a subscription the server returns only the first page as a preview
 * (with the real page count); the full document is fetched again once paid.
 * The result is kept per file, so the card preview and the final conversion
 * share a single upload.
 */
import { fmt } from "@/i18n/format";
import { runtimeLocale, t } from "@/i18n/runtime";

export interface OfficePdf {
  bytes: Uint8Array;
  /** Pages of the whole document (the preview has only the first). */
  pages: number | null;
  preview: boolean;
}

const cache = new WeakMap<File, Promise<{ blob: Blob; pages: number | null; preview: boolean }>>();

async function upload(file: File) {
  const body = new FormData();
  body.append("file", file, file.name);
  body.append("locale", runtimeLocale());
  let response: Response;
  try {
    response = await fetch("/api/office-to-pdf", { method: "POST", body });
  } catch {
    throw new Error(t().convert.network);
  }
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    // A 413 without our JSON comes from the hosting platform's own body limit.
    if (!data?.error && response.status === 413) throw new Error(t().convert.tooLarge);
    throw new Error(data?.error ?? fmt(t().convert.serverStatus, { status: response.status }));
  }
  const pages = Number(response.headers.get("x-page-count"));
  return { blob: await response.blob(), pages: pages > 0 ? pages : null, preview: response.headers.get("x-preview") === "1" };
}

/**
 * The PDF version of an office document (fresh bytes on every call). With
 * `full`, a cached preview is replaced by a new upload – the server decides
 * whether that is the whole document.
 */
export async function officeToPdf(file: File, { full = false } = {}): Promise<OfficePdf> {
  let pending = cache.get(file);
  if (pending && full && (await pending.catch(() => null))?.preview) pending = undefined;
  if (!pending) {
    pending = upload(file);
    cache.set(file, pending);
    pending.catch(() => cache.delete(file));
  }
  const { blob, pages, preview } = await pending;
  return { bytes: new Uint8Array(await blob.arrayBuffer()), pages, preview };
}

/** Whether any of these files is only available as a first-page preview so far. */
export async function hasPreviews(files: readonly File[]) {
  const results = await Promise.all(files.map((file) => cache.get(file)?.catch(() => null)));
  return results.some((result) => result?.preview);
}
