/**
 * Conversion pipeline (browser): images, text files, PDFs and office documents
 * (turned into PDF by the server, see ./office) in, one merged PDF or one PDF
 * per input out. Reports progress and honours cancellation.
 */
import type { PDFDocument, PDFPage, PDFRef } from "@cantoo/pdf-lib";
import { baseNameOf, pdfBlob, sanitizeFileName, type OutputFile } from "@/lib/files";
import { site } from "@/lib/site";
import { throwIfAborted, yieldToBrowser } from "@/lib/utils";
import type { DetectedFormat } from "./formats";
import type { ImageQuality, PdfImage } from "./images";
import {
  cellRects,
  fitPageSize,
  fixedPageSize,
  gridFor,
  imageMatrix,
  orientedSize,
  placeImage,
  PT_PER_MM,
  type FitMode,
  type Orientation,
  type PageSizeId,
  type Rect,
  type Rotation,
} from "./layout";

export interface ConvertOptions {
  pageSize: PageSizeId;
  orientation: Orientation;
  marginMm: number;
  fit: FitMode;
  perPage: number;
  quality: ImageQuality;
  grayscale: boolean;
  fontSize: number;
  output: "merge" | "separate";
  fileName: string;
}

export interface ConvertItem {
  id: string;
  file: File;
  name: string;
  format: DetectedFormat;
  rotation: Rotation;
  password?: string;
}

export interface JobContext {
  signal: AbortSignal;
  progress(done: number, total: number, label?: string): void;
}

type Build = typeof import("@/lib/pdf/build");

/** Gap between images when several share a page. */
const CELL_GAP_MM = 5;
/** Text documents always get at least this much margin. */
const MIN_TEXT_MARGIN_MM = 15;

/** Places images onto pages, one or several per page. */
class ImagePager {
  private page: PDFPage | null = null;
  private cells: Rect[] = [];
  private next = 0;

  constructor(
    private readonly doc: PDFDocument,
    private readonly options: ConvertOptions,
    private readonly build: Build,
  ) {}

  /** The next image starts on a fresh page (after a text or PDF input). */
  breakPage() {
    this.page = null;
  }

  private async embed(image: PdfImage): Promise<PDFRef> {
    if (image.kind === "pixels") return this.build.embedPixels(this.doc, image.pixels);
    if (image.kind === "jpeg") return (await this.doc.embedJpg(image.bytes)).ref;
    return (await this.doc.embedPng(image.bytes)).ref;
  }

  async add(image: PdfImage, rotation: Rotation) {
    const { doc, options } = this;
    const ref = await this.embed(image);
    const display = orientedSize(image.width, image.height, image.orientation, rotation);
    const margin = options.marginMm * PT_PER_MM;
    let cell: Rect;

    if (options.perPage <= 1) {
      const size =
        options.pageSize === "fit"
          ? fitPageSize(display, image.dpi, margin)
          : fixedPageSize(options.pageSize, options.orientation, display);
      this.page = doc.addPage([size.width, size.height]);
      cell = cellRects(size, margin, 0, 1, 1)[0];
    } else {
      if (!this.page || this.next >= this.cells.length) {
        const size = fixedPageSize(options.pageSize === "fit" ? "A4" : options.pageSize, options.orientation === "landscape" ? "landscape" : "portrait");
        const { rows, cols } = gridFor(options.perPage, size.width > size.height);
        this.page = doc.addPage([size.width, size.height]);
        this.cells = cellRects(size, margin, CELL_GAP_MM * PT_PER_MM, rows, cols);
        this.next = 0;
      }
      cell = this.cells[this.next++];
    }

    const placement = placeImage(cell, display, options.fit);
    this.build.drawImage(this.page, ref, imageMatrix(image.orientation, rotation, placement.rect), placement.clip ? cell : undefined);
  }
}

async function appendItem(doc: PDFDocument, pager: ImagePager, item: ConvertItem, options: ConvertOptions, build: Build, signal: AbortSignal) {
  const { format } = item;

  if (format.kind === "image") {
    const { prepareImage } = await import("./images");
    const images = await prepareImage(item.file, format.format, { quality: options.quality, grayscale: options.grayscale });
    for (const image of images) {
      throwIfAborted(signal);
      await pager.add(image, item.rotation);
      await yieldToBrowser();
    }
    return;
  }

  pager.breakPage();

  if (format.kind === "pdf" || format.kind === "office") {
    const bytes =
      format.kind === "office" ? await (await import("./office")).officeToPdf(item.file) : new Uint8Array(await item.file.arrayBuffer());
    const src = await build.loadSource(bytes, { password: item.password });
    for (const page of build.copyPages(src, doc, src.getPageIndices())) {
      build.rotatePage(page, item.rotation);
      doc.addPage(page);
    }
    return;
  }

  const [{ decodeText, toBlocks }, { renderText, estimateTableWidth }, { browserFonts }] = await Promise.all([
    import("./text-model"),
    import("./text-pdf"),
    import("./fonts"),
  ]);
  const blocks = toBlocks(decodeText(new Uint8Array(await item.file.arrayBuffer())), format.format);
  const sizeId = options.pageSize === "fit" ? "A4" : options.pageSize;
  const margin = Math.max(options.marginMm, MIN_TEXT_MARGIN_MM) * PT_PER_MM;
  let landscape = options.orientation === "landscape";
  if (options.orientation === "auto" && (format.format === "csv" || format.format === "tsv")) {
    const portrait = fixedPageSize(sizeId, "portrait");
    landscape = estimateTableWidth(blocks, options.fontSize) > (portrait.width - margin * 2) * 1.05;
  }
  const size = fixedPageSize(sizeId, landscape ? "landscape" : "portrait");
  await renderText(doc, blocks, { width: size.width, height: size.height, margin, fontSize: options.fontSize, title: item.name, signal }, browserFonts);
}

export async function convertToPdf(items: readonly ConvertItem[], options: ConvertOptions, ctx: JobContext): Promise<OutputFile[]> {
  const build = await import("@/lib/pdf/build");
  const files: OutputFile[] = [];
  const total = items.length;
  const meta = (title: string) => ({ title, producer: site.name });
  const mergedName = sanitizeFileName(options.fileName) || "konvertalt";

  let merged: PDFDocument | null = null;
  let pager: ImagePager | null = null;
  if (options.output === "merge") {
    merged = await build.createOutput(null, meta(mergedName));
    pager = new ImagePager(merged, options, build);
  }

  for (const [index, item] of items.entries()) {
    throwIfAborted(ctx.signal);
    ctx.progress(index, total, item.name);
    try {
      if (merged && pager) {
        await appendItem(merged, pager, item, options, build, ctx.signal);
      } else {
        const name = baseNameOf(item.name);
        const doc = await build.createOutput(null, meta(name));
        await appendItem(doc, new ImagePager(doc, options, build), item, options, build, ctx.signal);
        build.pruneDeadLinks(doc);
        files.push({ name: `${name}.pdf`, blob: pdfBlob(await build.saveOutput(doc)), pages: doc.getPageCount(), detail: item.name });
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") throw error;
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`„${item.name}” nem konvertálható: ${reason}`);
    }
    await yieldToBrowser();
  }

  if (merged) {
    ctx.progress(total, total, "PDF mentése…");
    await yieldToBrowser();
    build.pruneDeadLinks(merged);
    files.push({ name: `${mergedName}.pdf`, blob: pdfBlob(await build.saveOutput(merged)), pages: merged.getPageCount() });
  }
  ctx.progress(total, total);
  return files;
}
