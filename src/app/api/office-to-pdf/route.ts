import { DEFAULT_LOCALE, INTL_LOCALE, isLocale, type Locale } from "@/i18n/config";
import { SITE } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { extensionOf, isOfficeFormat, matchesOfficeSignature } from "@/lib/convert/formats";
import { OfficeError, officeToPdf } from "@/lib/server/office";

export const maxDuration = 300;

// Vercel Functions accept at most 4.5 MB request bodies (multipart overhead included).
const MAX_MB = process.env.VERCEL ? 4.4 : 50;
const MAX_BYTES = MAX_MB * 1024 * 1024;

const fail = (error: string, status: number) => Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
const tooLarge = (locale: Locale) => fail(fmt(SITE[locale].server.tooLarge, { limit: `${MAX_MB.toLocaleString(INTL_LOCALE[locale])} MB` }), 413);

/** Office document in (multipart fields "file" and optional "locale"), PDF out. Errors come in the visitor's language. */
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BYTES + 64 * 1024) return tooLarge(DEFAULT_LOCALE);

  const form = await request.formData().catch(() => null);
  const requested = form?.get("locale");
  const locale = typeof requested === "string" && isLocale(requested) ? requested : DEFAULT_LOCALE;
  const texts = SITE[locale].server;
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) return fail(texts.noFile, 400);
  if (file.size > MAX_BYTES) return tooLarge(locale);

  const format = extensionOf(file.name);
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!isOfficeFormat(format) || !matchesOfficeSignature(format, bytes.subarray(0, 8))) return fail(texts.notOffice, 415);

  try {
    const pdf = await officeToPdf(bytes, format);
    return new Response(pdf as ReadableStream<Uint8Array> | Uint8Array<ArrayBuffer>, {
      headers: { "Content-Type": "application/pdf", "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof OfficeError) return fail(fmt(texts[error.code], error.vars), error.status);
    console.error("[office-to-pdf]", error);
    return fail(texts.unexpected, 500);
  }
}
