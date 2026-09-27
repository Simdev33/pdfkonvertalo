/**
 * Header parsers for JPEG and PNG. They let us embed these formats into the
 * PDF byte-for-byte (no quality loss) while still honouring EXIF orientation
 * and the physical resolution of scans.
 */

export interface Dpi {
  x: number;
  y: number;
}

export interface JpegInfo {
  width: number;
  height: number;
  components: number;
  /** EXIF orientation, 1–8 (1 = as stored). */
  orientation: number;
  dpi: Dpi | null;
}

export interface PngInfo {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
  hasAlpha: boolean;
  dpi: Dpi | null;
}

const SOF_MARKERS = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

export function readJpegInfo(bytes: Uint8Array): JpegInfo | null {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let orientation = 1;
  let jfifDpi: Dpi | null = null;
  let exifDpi: Dpi | null = null;

  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1];
    if (marker === 0xff) {
      offset++; // fill byte
      continue;
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const length = view.getUint16(offset + 2);
    const data = offset + 4;
    const end = offset + 2 + length;
    if (length < 2 || end > bytes.length) return null;

    if (marker === 0xe0 && length >= 16 && ascii(bytes, data, 5) === "JFIF\0") {
      const units = bytes[data + 7];
      const x = view.getUint16(data + 8);
      const y = view.getUint16(data + 10);
      if (units === 1 || units === 2) {
        const factor = units === 2 ? 2.54 : 1;
        if (x > 1 && y > 1) jfifDpi = { x: x * factor, y: y * factor };
      }
    } else if (marker === 0xe1 && length >= 16 && ascii(bytes, data, 6) === "Exif\0\0") {
      const exif = readExif(view, data + 6, end);
      if (exif) {
        orientation = exif.orientation;
        exifDpi = exif.dpi;
      }
    } else if (SOF_MARKERS.has(marker) && length >= 8) {
      return {
        height: view.getUint16(data + 1),
        width: view.getUint16(data + 3),
        components: bytes[data + 5],
        orientation,
        dpi: jfifDpi ?? exifDpi,
      };
    } else if (marker === 0xda) {
      return null; // start of scan without a frame header
    }
    offset = end;
  }
  return null;
}

function readExif(view: DataView, tiff: number, end: number) {
  if (tiff + 8 > end) return null;
  const little = view.getUint16(tiff) === 0x4949;
  if (!little && view.getUint16(tiff) !== 0x4d4d) return null;
  const u16 = (at: number) => view.getUint16(at, little);
  const u32 = (at: number) => view.getUint32(at, little);
  if (u16(tiff + 2) !== 42) return null;

  const ifd = tiff + u32(tiff + 4);
  if (ifd + 2 > end) return null;
  const count = u16(ifd);
  let orientation = 1;
  let xRes = 0;
  let yRes = 0;
  let unit = 2;
  const rational = (entry: number) => {
    const at = tiff + u32(entry + 8);
    if (at + 8 > end) return 0;
    const denominator = u32(at + 4);
    return denominator ? u32(at) / denominator : 0;
  };
  for (let i = 0; i < count; i++) {
    const entry = ifd + 2 + i * 12;
    if (entry + 12 > end) break;
    const tag = u16(entry);
    if (tag === 0x0112) orientation = u16(entry + 8);
    else if (tag === 0x011a) xRes = rational(entry);
    else if (tag === 0x011b) yRes = rational(entry);
    else if (tag === 0x0128) unit = u16(entry + 8);
  }
  const factor = unit === 3 ? 2.54 : unit === 2 ? 1 : 0;
  return {
    orientation: orientation >= 1 && orientation <= 8 ? orientation : 1,
    dpi: factor && xRes > 1 && yRes > 1 ? { x: xRes * factor, y: yRes * factor } : null,
  };
}

export function readPngInfo(bytes: Uint8Array): PngInfo | null {
  if (bytes.length < 33 || bytes[0] !== 0x89 || ascii(bytes, 1, 3) !== "PNG" || ascii(bytes, 12, 4) !== "IHDR") return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const colorType = bytes[25];
  const info: PngInfo = {
    width: view.getUint32(16),
    height: view.getUint32(20),
    bitDepth: bytes[24],
    colorType,
    hasAlpha: colorType === 4 || colorType === 6,
    dpi: null,
  };
  for (let offset = 8; offset + 8 <= bytes.length; ) {
    const length = view.getUint32(offset);
    const type = ascii(bytes, offset + 4, 4);
    if (type === "pHYs" && length >= 9 && bytes[offset + 16] === 1) {
      const x = view.getUint32(offset + 8) * 0.0254;
      const y = view.getUint32(offset + 12) * 0.0254;
      if (x > 1 && y > 1) info.dpi = { x, y };
    } else if (type === "tRNS") {
      info.hasAlpha = true;
    } else if (type === "IDAT" || type === "IEND") {
      break;
    }
    offset += 12 + length;
  }
  return info;
}

function ascii(bytes: Uint8Array, start: number, length: number) {
  return String.fromCharCode(...bytes.subarray(start, start + length));
}
