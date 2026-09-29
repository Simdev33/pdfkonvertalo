/**
 * Browser-side image decoding and preparation for PDF embedding.
 *
 * JPEG and PNG files are embedded byte-for-byte when possible (no generation
 * loss); everything else is decoded to pixels and re-encoded losslessly
 * (sources that were lossless) or as high quality JPEG (sources that were
 * lossy anyway, like WebP, AVIF or HEIC).
 */
import type { RasterImage } from "@/lib/pdf/build";
import { t } from "@/i18n/runtime";
import { canvasToBlob, releaseCanvas } from "@/lib/pdf/pdfjs";
import type { ImageFormat } from "./formats";
import { readJpegInfo, readPngInfo, type Dpi } from "./image-info";

export type ImageQuality = "original" | "high" | "medium" | "low";

export const QUALITY_PRESETS: Record<Exclude<ImageQuality, "original">, { maxSide: number; jpeg: number }> = {
  high: { maxSide: 3200, jpeg: 0.85 },
  medium: { maxSide: 2000, jpeg: 0.75 },
  low: { maxSide: 1400, jpeg: 0.6 },
};

const LOSSLESS: ImageFormat[] = ["png", "gif", "bmp", "tiff", "svg", "ico"];
const MAX_PIXELS = 40_000_000;

/** Ready-to-embed image. `width`/`height` are the stored pixel dimensions. */
export type PdfImage =
  | { kind: "jpeg" | "png"; bytes: Uint8Array; width: number; height: number; orientation: number; dpi: Dpi | null }
  | { kind: "pixels"; pixels: RasterImage; width: number; height: number; orientation: 1; dpi: Dpi | null };

interface Frame {
  canvas: HTMLCanvasElement;
  dpi: Dpi | null;
  /** Pixel size before any downscaling. */
  original?: { width: number; height: number };
}

/* -------------------------------------------------------------------------- */
/*                                  Decoding                                  */
/* -------------------------------------------------------------------------- */

const heicCache = new WeakMap<Blob, Promise<Blob>>();

/** HEIC → JPEG once per file (the decoder is slow and large, so it is loaded on demand). */
export function heicAsJpeg(file: Blob) {
  let converted = heicCache.get(file);
  if (!converted) {
    converted = (async () => {
      // Safari can decode HEIC natively.
      try {
        const bitmap = await createImageBitmap(file);
        const canvas = bitmapToCanvas(bitmap);
        const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
        releaseCanvas(canvas);
        return blob;
      } catch {
        const { heicTo } = await import("heic-to/next");
        return heicTo({ blob: file, type: "image/jpeg", quality: 0.92 });
      }
    })();
    converted.catch(() => heicCache.delete(file));
    heicCache.set(file, converted);
  }
  return converted;
}

function bitmapToCanvas(source: ImageBitmap | HTMLImageElement, width = source.width, height = source.height) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  if ("close" in source) source.close();
  return canvas;
}

function fitWithin(width: number, height: number, maxSide?: number) {
  let scale = maxSide ? Math.min(1, maxSide / Math.max(width, height)) : 1;
  if (width * height * scale * scale > MAX_PIXELS) scale = Math.sqrt(MAX_PIXELS / (width * height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

async function loadImageElement(url: string) {
  const image = new Image();
  image.decoding = "async";
  image.src = url;
  await image.decode();
  return image;
}

/** Browser-native decode (EXIF orientation applied), optionally resized. */
async function decodeNative(blob: Blob, maxSide?: number): Promise<HTMLCanvasElement> {
  try {
    const probe = await createImageBitmap(blob, { imageOrientation: "from-image" });
    const size = fitWithin(probe.width, probe.height, maxSide);
    if (size.width === probe.width && size.height === probe.height) return bitmapToCanvas(probe);
    probe.close();
    const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image", resizeWidth: size.width, resizeHeight: size.height, resizeQuality: "high" });
    return bitmapToCanvas(bitmap);
  } catch {
    const url = URL.createObjectURL(blob);
    try {
      const image = await loadImageElement(url);
      const size = fitWithin(image.naturalWidth, image.naturalHeight, maxSide);
      return bitmapToCanvas(image, size.width, size.height);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

const SVG_UNITS: Record<string, number> = { px: 1, pt: 96 / 72, pc: 16, mm: 96 / 25.4, cm: 96 / 2.54, in: 96 };

function svgLength(value: string | null) {
  const match = value && /^\s*([\d.]+)\s*(px|pt|pc|mm|cm|in)?\s*$/i.exec(value);
  return match ? Number.parseFloat(match[1]) * SVG_UNITS[(match[2] ?? "px").toLowerCase()] : 0;
}

async function decodeSvg(file: Blob, maxSide?: number): Promise<Frame> {
  const text = await file.text();
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  const svg = doc.documentElement;
  if (svg.nodeName.toLowerCase() !== "svg") throw new Error(t().convert.invalidSvg);
  const viewBox = (svg.getAttribute("viewBox") ?? "").split(/[\s,]+/).map(Number);
  let width = svgLength(svg.getAttribute("width"));
  let height = svgLength(svg.getAttribute("height"));
  const ratio = viewBox.length === 4 && viewBox[2] > 0 && viewBox[3] > 0 ? viewBox[2] / viewBox[3] : 0;
  if (!width && !height) [width, height] = ratio ? [viewBox[2], viewBox[3]] : [300, 150];
  else if (!width) width = ratio ? height * ratio : height;
  else if (!height) height = ratio ? width / ratio : width;

  // Vector art: render crisp, at least ~2400 px on the long side.
  const target = maxSide ?? Math.max(2400, Math.max(width, height));
  const scale = Math.min(target / Math.max(width, height), Math.sqrt(MAX_PIXELS / (width * height)));
  svg.setAttribute("width", String(width * scale));
  svg.setAttribute("height", String(height * scale));
  if (!svg.hasAttribute("viewBox")) svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");

  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }));
  try {
    const image = await loadImageElement(url);
    const canvas = bitmapToCanvas(image, width * scale, height * scale);
    return { canvas, dpi: { x: 96 * scale, y: 96 * scale } };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function decodeTiff(file: Blob, maxSide?: number): Promise<Frame[]> {
  const UTIF = (await import("utif2")).default;
  const buffer = await file.arrayBuffer();
  const pages = UTIF.decode(buffer).filter((ifd) => ifd.t256 && ifd.t257);
  if (pages.length === 0) throw new Error(t().convert.emptyTiff);
  const frames: Frame[] = [];
  for (const ifd of pages) {
    UTIF.decodeImage(buffer, ifd);
    const rgba = UTIF.toRGBA8(ifd);
    const width = ifd.width as number;
    const height = ifd.height as number;
    const source = document.createElement("canvas");
    source.width = width;
    source.height = height;
    source.getContext("2d")!.putImageData(new ImageData(new Uint8ClampedArray(rgba.buffer as ArrayBuffer, rgba.byteOffset, width * height * 4), width, height), 0, 0);
    const size = fitWithin(width, height, maxSide);
    let canvas = source;
    if (size.width !== width || size.height !== height) {
      canvas = document.createElement("canvas");
      canvas.width = size.width;
      canvas.height = size.height;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(source, 0, 0, size.width, size.height);
      releaseCanvas(source);
    }
    const unit = (ifd.t296 as number[] | undefined)?.[0] ?? 2;
    const factor = unit === 3 ? 2.54 : unit === 2 ? 1 : 0;
    const xRes = (ifd.t282 as number[] | undefined)?.[0] ?? 0;
    const yRes = (ifd.t283 as number[] | undefined)?.[0] ?? xRes;
    const scale = size.width / width;
    frames.push({ canvas, dpi: factor && xRes > 1 ? { x: xRes * factor * scale, y: yRes * factor * scale } : null, original: { width, height } });
  }
  return frames;
}

/** Decodes any supported image into canvases (one per frame / TIFF page). */
export async function decodeFrames(file: Blob, format: ImageFormat, maxSide?: number): Promise<Frame[]> {
  switch (format) {
    case "tiff":
      return decodeTiff(file, maxSide);
    case "svg":
      return [await decodeSvg(file, maxSide)];
    case "heic":
      return [{ canvas: await decodeNative(await heicAsJpeg(file), maxSide), dpi: null }];
    default:
      return [{ canvas: await decodeNative(file, maxSide), dpi: await readDpi(file, format) }];
  }
}

async function readDpi(file: Blob, format: ImageFormat) {
  if (format !== "jpeg" && format !== "png") return null;
  const head = new Uint8Array(await file.slice(0, 256 * 1024).arrayBuffer());
  return (format === "jpeg" ? readJpegInfo(head) : readPngInfo(head))?.dpi ?? null;
}

/* -------------------------------------------------------------------------- */
/*                               PDF preparation                              */
/* -------------------------------------------------------------------------- */

function hasTransparency(data: Uint8ClampedArray) {
  for (let i = 3; i < data.length; i += 4) if (data[i] < 255) return true;
  return false;
}

function toGrayscale(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const y = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    data[i] = data[i + 1] = data[i + 2] = y;
  }
}

async function encodeFrame(frame: Frame, options: { lossless: boolean; jpegQuality: number; grayscale: boolean }): Promise<PdfImage> {
  const { canvas, dpi } = frame;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  if (options.grayscale) {
    toGrayscale(image.data);
    ctx.putImageData(image, 0, 0);
  }
  const { width, height } = canvas;
  try {
    if (hasTransparency(image.data)) {
      const bytes = new Uint8Array(await (await canvasToBlob(canvas, "image/png")).arrayBuffer());
      return { kind: "png", bytes, width, height, orientation: 1, dpi };
    }
    if (options.lossless) return { kind: "pixels", pixels: image, width, height, orientation: 1, dpi };
    const bytes = new Uint8Array(await (await canvasToBlob(canvas, "image/jpeg", options.jpegQuality)).arrayBuffer());
    return { kind: "jpeg", bytes, width, height, orientation: 1, dpi };
  } finally {
    releaseCanvas(canvas);
  }
}

export interface PrepareOptions {
  quality: ImageQuality;
  grayscale: boolean;
}

/** Turns an input image into one or more embeddable images (TIFFs can have many pages). */
export async function prepareImage(file: Blob, format: ImageFormat, options: PrepareOptions): Promise<PdfImage[]> {
  const original = options.quality === "original";

  if (original && !options.grayscale && (format === "jpeg" || format === "png")) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const info = format === "jpeg" ? readJpegInfo(bytes) : readPngInfo(bytes);
    // CMYK/YCCK JPEGs and exotic PNGs are safer to re-encode through the browser.
    if (info && (format === "png" || (info as ReturnType<typeof readJpegInfo>)!.components !== 4)) {
      const orientation = format === "jpeg" ? (info as NonNullable<ReturnType<typeof readJpegInfo>>).orientation : 1;
      return [{ kind: format, bytes, width: info.width, height: info.height, orientation, dpi: info.dpi }];
    }
  }

  if (original && !options.grayscale && format === "heic") {
    const jpeg = await heicAsJpeg(file);
    const bytes = new Uint8Array(await jpeg.arrayBuffer());
    const info = readJpegInfo(bytes);
    if (info) return [{ kind: "jpeg", bytes, width: info.width, height: info.height, orientation: info.orientation, dpi: null }];
  }

  const preset = original ? null : QUALITY_PRESETS[options.quality as Exclude<ImageQuality, "original">];
  const frames = await decodeFrames(file, format, preset?.maxSide);
  const lossless = original && LOSSLESS.includes(format);
  const results: PdfImage[] = [];
  for (const frame of frames) {
    results.push(await encodeFrame(frame, { lossless, jpegQuality: preset?.jpeg ?? 0.92, grayscale: options.grayscale }));
  }
  return results;
}

/* -------------------------------------------------------------------------- */
/*                                 Thumbnails                                 */
/* -------------------------------------------------------------------------- */

export interface ImagePreview {
  url: string;
  /** Displayed pixel size of the original (first frame). */
  width: number;
  height: number;
  frames: number;
  dpi: Dpi | null;
}

export async function createImagePreview(file: Blob, format: ImageFormat, maxSide = 480): Promise<ImagePreview> {
  // Real dimensions first (cheap for JPEG/PNG), then a small render.
  let width = 0;
  let height = 0;
  let frames = 1;
  let dpi: Dpi | null = null;
  let thumb: HTMLCanvasElement;

  if (format === "tiff") {
    const all = await decodeTiff(file, maxSide);
    frames = all.length;
    thumb = all[0].canvas;
    for (const frame of all.slice(1)) releaseCanvas(frame.canvas);
    width = all[0].original?.width ?? thumb.width;
    height = all[0].original?.height ?? thumb.height;
    const scale = width / thumb.width;
    dpi = all[0].dpi && { x: all[0].dpi.x * scale, y: all[0].dpi.y * scale };
  } else if (format === "svg") {
    const frame = await decodeSvg(file, maxSide);
    thumb = frame.canvas;
    width = thumb.width;
    height = thumb.height;
  } else {
    const source = format === "heic" ? await heicAsJpeg(file) : file;
    const bitmap = await createImageBitmap(source, { imageOrientation: "from-image" }).catch(() => null);
    if (bitmap) {
      width = bitmap.width;
      height = bitmap.height;
      const size = fitWithin(width, height, maxSide);
      thumb = bitmapToCanvas(bitmap, size.width, size.height);
    } else {
      thumb = await decodeNative(source, maxSide);
      width = thumb.width;
      height = thumb.height;
    }
    dpi = await readDpi(file, format);
  }

  // WebP keeps transparency and is small; browsers without WebP encoding fall back to PNG.
  const blob = await canvasToBlob(thumb, "image/webp", 0.85);
  releaseCanvas(thumb);
  return { url: URL.createObjectURL(blob), width, height, frames, dpi };
}
