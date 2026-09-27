/**
 * Input format detection. Magic bytes win over the file extension, so a PNG
 * saved as "photo.jpg" is still handled correctly.
 */

export type ImageFormat = "jpeg" | "png" | "webp" | "gif" | "bmp" | "avif" | "svg" | "tiff" | "heic" | "ico";
export type TextFormat = "text" | "markdown" | "csv" | "tsv" | "json" | "code";
/** Office documents – converted to PDF on the server (see /api/office-to-pdf). */
export type OfficeFormat = "docx" | "doc" | "odt" | "rtf" | "xlsx" | "xls" | "ods" | "pptx" | "ppsx" | "ppt" | "pps" | "odp";
export type OfficeApp = "word" | "excel" | "powerpoint";

/** The program that opens each office format, and the container its bytes start with. */
export const OFFICE_FORMATS: Record<OfficeFormat, { app: OfficeApp; container: "ooxml" | "odf" | "ole" | "rtf" }> = {
  docx: { app: "word", container: "ooxml" },
  doc: { app: "word", container: "ole" },
  odt: { app: "word", container: "odf" },
  rtf: { app: "word", container: "rtf" },
  xlsx: { app: "excel", container: "ooxml" },
  xls: { app: "excel", container: "ole" },
  ods: { app: "excel", container: "odf" },
  pptx: { app: "powerpoint", container: "ooxml" },
  ppsx: { app: "powerpoint", container: "ooxml" },
  ppt: { app: "powerpoint", container: "ole" },
  pps: { app: "powerpoint", container: "ole" },
  odp: { app: "powerpoint", container: "odf" },
};

export const isOfficeFormat = (value: string): value is OfficeFormat => Object.hasOwn(OFFICE_FORMATS, value);

export type DetectedFormat =
  | { kind: "image"; format: ImageFormat; label: string }
  | { kind: "text"; format: TextFormat; label: string }
  | { kind: "office"; format: OfficeFormat; label: string }
  | { kind: "pdf"; format: "pdf"; label: string };

const image = (format: ImageFormat, label: string): DetectedFormat => ({ kind: "image", format, label });
const text = (format: TextFormat, label: string): DetectedFormat => ({ kind: "text", format, label });
const office = (format: OfficeFormat): DetectedFormat => ({ kind: "office", format, label: format.toUpperCase() });
const PDF: DetectedFormat = { kind: "pdf", format: "pdf", label: "PDF" };

const CODE_EXTENSIONS = [
  "js", "mjs", "cjs", "ts", "tsx", "jsx", "py", "java", "kt", "c", "h", "cpp", "hpp", "cc", "cs", "go", "rs", "rb", "php",
  "swift", "sql", "sh", "bash", "zsh", "bat", "ps1", "css", "scss", "less", "html", "htm", "vue", "svelte", "xml", "yml",
  "yaml", "toml", "ini", "cfg", "conf", "env", "gradle", "dart", "lua", "r", "pl", "tex",
];

const EXTENSIONS: Record<string, DetectedFormat> = {
  jpg: image("jpeg", "JPG"),
  jpeg: image("jpeg", "JPG"),
  jpe: image("jpeg", "JPG"),
  jfif: image("jpeg", "JPG"),
  png: image("png", "PNG"),
  apng: image("png", "PNG"),
  webp: image("webp", "WebP"),
  gif: image("gif", "GIF"),
  bmp: image("bmp", "BMP"),
  dib: image("bmp", "BMP"),
  avif: image("avif", "AVIF"),
  svg: image("svg", "SVG"),
  tif: image("tiff", "TIFF"),
  tiff: image("tiff", "TIFF"),
  heic: image("heic", "HEIC"),
  heif: image("heic", "HEIF"),
  hif: image("heic", "HEIF"),
  ico: image("ico", "ICO"),
  pdf: PDF,
  txt: text("text", "TXT"),
  text: text("text", "TXT"),
  log: text("code", "LOG"),
  md: text("markdown", "MD"),
  markdown: text("markdown", "MD"),
  csv: text("csv", "CSV"),
  tsv: text("tsv", "TSV"),
  json: text("json", "JSON"),
  ...Object.fromEntries(Object.keys(OFFICE_FORMATS).map((ext) => [ext, office(ext as OfficeFormat)])),
  ...Object.fromEntries(CODE_EXTENSIONS.map((ext) => [ext, text("code", ext.toUpperCase())])),
};

const OFFICE_MIME: Record<string, OfficeFormat> = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/msword": "doc",
  "application/vnd.oasis.opendocument.text": "odt",
  "application/rtf": "rtf",
  "text/rtf": "rtf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.oasis.opendocument.spreadsheet": "ods",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.oasis.opendocument.presentation": "odp",
};

export const ACCEPT = [
  "application/pdf",
  "image/*",
  ...Object.keys(OFFICE_MIME),
  ".heic",
  ".heif",
  "text/*",
  ...Object.keys(EXTENSIONS).map((ext) => `.${ext}`),
].join(",");

export function extensionOf(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
}

const ascii = (bytes: Uint8Array, start: number, length: number) =>
  String.fromCharCode(...bytes.subarray(start, Math.min(bytes.length, start + length)));

/** Identifies binary formats by their signature. */
export function sniffFormat(head: Uint8Array): DetectedFormat | null {
  const b = head;
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return image("jpeg", "JPG");
  if (b.length >= 8 && b[0] === 0x89 && ascii(b, 1, 3) === "PNG") return image("png", "PNG");
  if (ascii(b, 0, 4) === "GIF8") return image("gif", "GIF");
  if (ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 4) === "WEBP") return image("webp", "WebP");
  if (ascii(b, 0, 2) === "BM" && b.length >= 14) return image("bmp", "BMP");
  if ((ascii(b, 0, 4) === "II*\0" || ascii(b, 0, 4) === "MM\0*") && b.length >= 8) return image("tiff", "TIFF");
  if (b.length >= 4 && b[0] === 0 && b[1] === 0 && b[2] === 1 && b[3] === 0) return image("ico", "ICO");

  if (ascii(b, 4, 4) === "ftyp") {
    const size = ((b[0] << 24) | (b[1] << 16) | (b[2] << 8) | b[3]) >>> 0;
    const brands = [ascii(b, 8, 4)];
    for (let offset = 16; offset + 4 <= Math.min(size, b.length); offset += 4) brands.push(ascii(b, offset, 4));
    if (brands.some((brand) => brand === "avif" || brand === "avis")) return image("avif", "AVIF");
    if (brands.some((brand) => ["heic", "heix", "hevc", "hevx", "heim", "heis", "mif1", "msf1"].includes(brand))) {
      return image("heic", "HEIC");
    }
  }

  const start = new TextDecoder("latin1").decode(b.subarray(0, 1024));
  if (start.includes("%PDF-")) return PDF;
  if (/^\s*(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/i.test(start)) return image("svg", "SVG");
  return null;
}

export function detectFormat(name: string, mime: string, head: Uint8Array): DetectedFormat | null {
  const sniffed = sniffFormat(head);
  if (sniffed) return sniffed;
  const byExtension = EXTENSIONS[extensionOf(name)];
  if (byExtension) return byExtension;
  if (mime === "application/pdf") return PDF;
  if (OFFICE_MIME[mime]) return office(OFFICE_MIME[mime]);
  if (mime.startsWith("text/") || mime === "application/json") return text(mime === "application/json" ? "json" : "text", "TXT");
  return null;
}

const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

/**
 * Checks that the first bytes of an office document match its extension:
 * DOCX/XLSX/PPTX and the OpenDocument formats are ZIP packages, the old
 * DOC/XLS/PPT formats are OLE compound files, RTF starts with "{\rtf". A
 * password protected DOCX/XLSX/PPTX is an OLE file as well.
 */
export function matchesOfficeSignature(format: OfficeFormat, head: Uint8Array) {
  const zip = ascii(head, 0, 4) === "PK\x03\x04";
  const ole = OLE.every((byte, index) => head[index] === byte);
  switch (OFFICE_FORMATS[format].container) {
    case "ooxml":
      return zip || ole;
    case "odf":
      return zip;
    case "ole":
      return ole;
    case "rtf":
      return ascii(head, 0, 5) === "{\\rtf";
  }
}
