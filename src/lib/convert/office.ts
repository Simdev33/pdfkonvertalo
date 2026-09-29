/**
 * Office documents (Word, Excel, PowerPoint) are the one input the browser
 * cannot lay out itself: they are sent to /api/office-to-pdf and come back as a PDF.
 * The result is kept per file, so the card preview and the final conversion
 * share a single upload.
 */
import { fmt } from "@/i18n/format";
import { runtimeLocale, t } from "@/i18n/runtime";

const cache = new WeakMap<File, Promise<Blob>>();

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
  return response.blob();
}

/** The PDF version of an office document (a fresh copy on every call). */
export async function officeToPdf(file: File): Promise<Uint8Array> {
  let pending = cache.get(file);
  if (!pending) {
    pending = upload(file);
    cache.set(file, pending);
    pending.catch(() => cache.delete(file));
  }
  return new Uint8Array(await (await pending).arrayBuffer());
}
