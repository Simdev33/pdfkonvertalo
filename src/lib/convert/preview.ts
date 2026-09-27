/**
 * Geometry for the WYSIWYG file cards: the same layout math as the PDF
 * engine, expressed in CSS percentages.
 */
import type { ConvertOptions } from "./engine";
import {
  cellRects,
  fitPageSize,
  fixedPageSize,
  gridFor,
  orientedSize,
  placeImage,
  PT_PER_MM,
  type Rect,
  type Size,
} from "./layout";
import type { Item } from "@/lib/store";

export interface CssBox {
  left: string;
  top: string;
  width: string;
  height: string;
}

export interface CardGeometry {
  /** Aspect ratio (width / height) of what the card shows: a page, or one cell of a multi-image page. */
  ratio: number;
  /** Clipping box (the cell) inside the page. */
  cell: CssBox;
  /** Where the image goes, relative to the cell. */
  image?: CssBox;
  /** Text inputs: content area inside the page margins. */
  content?: CssBox;
}

const pct = (value: number) => `${(value * 100).toFixed(3)}%`;

function toCss(rect: Rect, frame: Rect): CssBox {
  return {
    left: pct((rect.x - frame.x) / frame.width),
    top: pct((frame.y + frame.height - rect.y - rect.height) / frame.height),
    width: pct(rect.width / frame.width),
    height: pct(rect.height / frame.height),
  };
}

const FULL: CssBox = { left: "0%", top: "0%", width: "100%", height: "100%" };

export function cardGeometry(item: Item, options: ConvertOptions): CardGeometry | null {
  const preview = item.preview;
  if (!preview) return null;
  const margin = options.marginMm * PT_PER_MM;

  if (item.format.kind === "image") {
    // Previews are already EXIF-oriented, only the user rotation is left.
    const display = orientedSize(preview.width, preview.height, 1, item.rotation);
    let page: Size;
    let cell: Rect;
    if (options.perPage <= 1) {
      page =
        options.pageSize === "fit"
          ? fitPageSize(display, preview.dpi ?? null, margin)
          : fixedPageSize(options.pageSize, options.orientation, display);
      cell = cellRects(page, margin, 0, 1, 1)[0];
    } else {
      const sheet = fixedPageSize(options.pageSize === "fit" ? "A4" : options.pageSize, options.orientation === "landscape" ? "landscape" : "portrait");
      const { rows, cols } = gridFor(options.perPage, sheet.width > sheet.height);
      const first = cellRects(sheet, margin, 5 * PT_PER_MM, rows, cols)[0];
      page = { width: first.width, height: first.height };
      cell = { x: 0, y: 0, ...page };
    }
    const frame = { x: 0, y: 0, ...page };
    const placement = placeImage(cell, display, options.fit);
    return { ratio: page.width / page.height, cell: toCss(cell, frame), image: toCss(placement.rect, cell) };
  }

  if (item.format.kind === "pdf" || item.format.kind === "office") {
    const swapped = item.rotation === 90 || item.rotation === 270;
    return { ratio: swapped ? preview.height / preview.width : preview.width / preview.height, cell: FULL };
  }

  const page = fixedPageSize(options.pageSize === "fit" ? "A4" : options.pageSize, "portrait");
  const textMargin = Math.max(options.marginMm, 15) * PT_PER_MM;
  const frame = { x: 0, y: 0, ...page };
  return {
    ratio: page.width / page.height,
    cell: FULL,
    content: toCss({ x: textMargin, y: textMargin, width: page.width - textMargin * 2, height: page.height - textMargin * 2 }, frame),
  };
}
