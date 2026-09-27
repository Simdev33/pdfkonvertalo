import { createServer, type IncomingMessage, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { OfficeError, officeToPdf } from "./office";

// A stand-in for Gotenberg behind a Vercel-style binding URL with a path prefix.
const PREFIX = "/_svc/gotenberg";
const PDF = "%PDF-1.7\n% fake pdf body\n%%EOF";

let server: Server;
let lastRequest: { url?: string; body: string } = { body: "" };

const readBody = (request: IncomingMessage) =>
  new Promise<string>((resolve) => {
    const chunks: Buffer[] = [];
    request.on("data", (chunk: Buffer) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("latin1")));
  });

beforeAll(async () => {
  server = createServer(async (request, response) => {
    lastRequest = { url: request.url, body: await readBody(request) };
    if (request.url !== `${PREFIX}/forms/libreoffice/convert`) return response.writeHead(404).end("not found");
    if (lastRequest.body.includes("jelszavas")) return response.writeHead(400).end("LibreOffice failed: a password may be required");
    response.writeHead(200, { "Content-Type": "application/pdf" });
    // Sent in pieces, the way a streamed body arrives.
    response.write(PDF.slice(0, 10));
    setTimeout(() => response.end(PDF.slice(10)), 20);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  process.env.GOTENBERG_URL = `http://127.0.0.1:${(server.address() as AddressInfo).port}${PREFIX}`;
});

afterAll(() => {
  delete process.env.GOTENBERG_URL;
  server.close();
});

const docx = (marker: string) => new TextEncoder().encode(`PK\x03\x04${marker}`);

describe("officeToPdf via Gotenberg", () => {
  it("posts the file under the binding path and streams the PDF back", async () => {
    const result = await officeToPdf(docx("tartalom"), "docx");
    expect(result).toBeInstanceOf(ReadableStream);
    expect(await new Response(result as ReadableStream<Uint8Array>).text()).toBe(PDF);
    expect(lastRequest.url).toBe(`${PREFIX}/forms/libreoffice/convert`);
    expect(lastRequest.body).toMatch(/name="files"; filename="dokumentum\.docx"/);
  });

  it("turns a password error into a clear message", async () => {
    await expect(officeToPdf(docx("jelszavas"), "docx")).rejects.toThrow(OfficeError);
    await expect(officeToPdf(docx("jelszavas"), "docx")).rejects.toThrow(/jelszóval védett/);
  });

  it("rejects an encrypted OOXML package before uploading it", async () => {
    lastRequest = { body: "" };
    const encrypted = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, ...new TextEncoder().encode("x"), ...Buffer.from("EncryptedPackage", "utf16le")]);
    await expect(officeToPdf(encrypted, "xlsx")).rejects.toThrow(/jelszóval védett/);
    expect(lastRequest.url).toBeUndefined();
  });
});
