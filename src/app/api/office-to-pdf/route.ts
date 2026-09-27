import { extensionOf, isOfficeFormat, matchesOfficeSignature } from "@/lib/convert/formats";
import { OfficeError, officeToPdf } from "@/lib/server/office";

export const maxDuration = 300;

// Vercel Functions accept at most 4.5 MB request bodies (multipart overhead included).
const [MAX_BYTES, MAX_LABEL] = process.env.VERCEL ? [4.4 * 1024 * 1024, "4,4 MB"] : [50 * 1024 * 1024, "50 MB"];
const TOO_LARGE = `A fájl legfeljebb ${MAX_LABEL} lehet.`;

const fail = (error: string, status: number) => Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

/** Office document in (multipart field "file"), PDF out. */
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BYTES + 64 * 1024) return fail(TOO_LARGE, 413);

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) return fail("Nem érkezett fájl.", 400);
  if (file.size > MAX_BYTES) return fail(TOO_LARGE, 413);

  const format = extensionOf(file.name);
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!isOfficeFormat(format) || !matchesOfficeSignature(format, bytes.subarray(0, 8))) {
    return fail("Ez nem Word-, Excel- vagy PowerPoint-fájl.", 415);
  }

  try {
    const pdf = await officeToPdf(bytes, format);
    return new Response(pdf as ReadableStream<Uint8Array> | Uint8Array<ArrayBuffer>, {
      headers: { "Content-Type": "application/pdf", "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof OfficeError) return fail(error.message, error.status);
    console.error("[office-to-pdf]", error);
    return fail("Váratlan hiba történt az átalakítás közben.", 500);
  }
}
