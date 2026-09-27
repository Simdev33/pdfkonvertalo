import { Zip, ZipPassThrough } from "fflate";

export interface OutputFile {
  name: string;
  blob: Blob;
  /** Page count for PDFs. */
  pages?: number;
  /** Short human readable description, e.g. "3–5. oldal". */
  detail?: string;
}

/** File name without its extension, safe to reuse for output files. */
export function baseNameOf(fileName: string) {
  return sanitizeFileName(fileName.replace(/\.[a-z0-9]{1,5}$/i, "")) || "dokumentum";
}

export function sanitizeFileName(name: string) {
  return name
    .replace(/[\\/:*?"<>|\u0000-\u001f]+/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/, "")
    .slice(0, 120);
}

export function padNumber(value: number, max: number) {
  return String(value).padStart(String(max).length, "0");
}

/** Makes names unique inside one archive ("a.pdf", "a (2).pdf"…). */
export function dedupeNames<T extends { name: string }>(files: T[]): T[] {
  const seen = new Map<string, number>();
  return files.map((file) => {
    const key = file.name.toLowerCase();
    const count = seen.get(key) ?? 0;
    seen.set(key, count + 1);
    if (count === 0) return file;
    const dot = file.name.lastIndexOf(".");
    const [stem, ext] = dot > 0 ? [file.name.slice(0, dot), file.name.slice(dot)] : [file.name, ""];
    return { ...file, name: `${stem} (${count + 1})${ext}` };
  });
}

export function pdfBlob(bytes: Uint8Array) {
  return new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}

/**
 * Streams files into a ZIP without recompressing them – PDFs and PNGs are
 * already compressed, so "store" is both faster and just as small.
 */
export async function createZip(files: readonly OutputFile[]): Promise<Blob> {
  const chunks: Uint8Array[] = [];
  let failure: unknown = null;
  const zip = new Zip((error, chunk) => {
    if (error) failure = error;
    else chunks.push(chunk);
  });
  for (const file of dedupeNames([...files])) {
    const entry = new ZipPassThrough(file.name);
    entry.mtime = new Date();
    zip.add(entry);
    entry.push(new Uint8Array(await file.blob.arrayBuffer()), true);
    if (failure) throw failure;
  }
  zip.end();
  if (failure) throw failure;
  return new Blob(chunks as Uint8Array<ArrayBuffer>[], { type: "application/zip" });
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function openBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 5 * 60_000);
}

/* -------------------------------------------------------------------------- */
/*                         PNG physical size (pHYs)                           */
/* -------------------------------------------------------------------------- */

let crcTable: Uint32Array | null = null;

function crc32(bytes: Uint8Array) {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Canvas PNGs carry no resolution, so printers assume 72/96 DPI. Adding a
 * pHYs chunk makes a 300 DPI QR code print at its real size.
 */
export function withPngDpi(png: Uint8Array, dpi: number): Uint8Array {
  const IHDR_END = 8 + 25; // signature + IHDR chunk
  if (png.length < IHDR_END || png[12] !== 0x49 || png[13] !== 0x48) return png;
  const reader = new DataView(png.buffer, png.byteOffset, png.byteLength);
  for (let offset = 8; offset + 8 <= png.length; ) {
    const type = String.fromCharCode(...png.subarray(offset + 4, offset + 8));
    if (type === "pHYs") return png; // already has a resolution
    if (type === "IDAT" || type === "IEND") break;
    offset += 12 + reader.getUint32(offset);
  }
  const ppm = Math.round(dpi / 0.0254);
  const chunk = new Uint8Array(21);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, 9);
  chunk.set([0x70, 0x48, 0x59, 0x73], 4); // "pHYs"
  view.setUint32(8, ppm);
  view.setUint32(12, ppm);
  chunk[16] = 1; // unit: metre
  view.setUint32(17, crc32(chunk.subarray(4, 17)));
  const out = new Uint8Array(png.length + chunk.length);
  out.set(png.subarray(0, IHDR_END), 0);
  out.set(chunk, IHDR_END);
  out.set(png.subarray(IHDR_END), IHDR_END + chunk.length);
  return out;
}

/** Sets the JFIF pixel density of a canvas-made JPEG, so it prints at the intended size. */
export function withJpegDpi(jpeg: Uint8Array, dpi: number): Uint8Array {
  // SOI, then an APP0 "JFIF\0" segment: units at +13, densities at +14 / +16.
  if (jpeg.length < 20 || jpeg[0] !== 0xff || jpeg[1] !== 0xd8 || jpeg[2] !== 0xff || jpeg[3] !== 0xe0) return jpeg;
  if (String.fromCharCode(...jpeg.subarray(6, 11)) !== "JFIF\0") return jpeg;
  const out = jpeg.slice();
  const density = Math.max(1, Math.min(65535, Math.round(dpi)));
  out[13] = 1; // dots per inch
  out[14] = density >> 8;
  out[15] = density & 0xff;
  out[16] = density >> 8;
  out[17] = density & 0xff;
  return out;
}
