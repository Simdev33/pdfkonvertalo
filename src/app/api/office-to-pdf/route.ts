import { DEFAULT_LOCALE, INTL_LOCALE, isLocale, type Locale } from "@/i18n/config";
import { SITE } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { extensionOf, isOfficeFormat, matchesOfficeSignature } from "@/lib/convert/formats";
import { accessFor } from "@/lib/server/billing";
import { OfficeError, officeToPdf } from "@/lib/server/office";
import { firstPage } from "@/lib/server/preview";
import { clientIp, limited } from "@/lib/server/rate-limit";
import { getSession } from "@/lib/server/session";

export const maxDuration = 300;

// Vercel Functions accept at most 4.5 MB request bodies (multipart overhead included).
const MAX_MB = process.env.VERCEL ? 4.4 : 50;
const MAX_BYTES = MAX_MB * 1024 * 1024;

const fail = (error: string, status: number) => Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
const tooLarge = (locale: Locale) => fail(fmt(SITE[locale].server.tooLarge, { limit: `${MAX_MB.toLocaleString(INTL_LOCALE[locale])} MB` }), 413);

async function subscribed() {
  const session = await getSession();
  if (!session) return false;
  try {
    return (await accessFor(session.customer)).active;
  } catch (error) {
    console.error("[office-to-pdf] access check failed", error);
    return false;
  }
}

/**
 * Office document in (multipart fields "file" and optional "locale"), PDF out.
 * Without a subscription only the first page comes back, as a preview: then
 * "X-Preview: 1" is set and "X-Page-Count" tells the length of the whole document.
 * Errors come in the visitor's language.
 */
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

  const full = await subscribed();
  if (!full && limited(`office:${clientIp(request)}`, 60, 10 * 60_000)) return fail(texts.rateLimited, 429);

  try {
    const pdf = await officeToPdf(bytes, format);
    if (full) {
      return new Response(pdf as ReadableStream<Uint8Array> | Uint8Array<ArrayBuffer>, {
        headers: { "Content-Type": "application/pdf", "Cache-Control": "no-store" },
      });
    }
    const whole = pdf instanceof Uint8Array ? pdf : new Uint8Array(await new Response(pdf).arrayBuffer());
    const preview = await firstPage(whole);
    return new Response(preview.bytes as Uint8Array<ArrayBuffer>, {
      headers: { "Content-Type": "application/pdf", "Cache-Control": "no-store", "X-Preview": "1", "X-Page-Count": String(preview.pages) },
    });
  } catch (error) {
    if (error instanceof OfficeError) return fail(fmt(texts[error.code], error.vars), error.status);
    console.error("[office-to-pdf]", error);
    return fail(texts.unexpected, 500);
  }
}
