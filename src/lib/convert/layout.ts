/**
 * Page layout math for image pages. Pure functions, all sizes in PDF points
 * (1/72 inch) with PDF's bottom-left origin unless noted otherwise.
 */
import type { Dpi } from "./image-info";

export const PT_PER_MM = 72 / 25.4;

export const PAGE_SIZES = {
  A4: { label: "A4", width: 210, height: 297 },
  A3: { label: "A3", width: 297, height: 420 },
  A5: { label: "A5", width: 148, height: 210 },
  Letter: { label: "Letter", width: 215.9, height: 279.4 },
  Legal: { label: "Legal", width: 215.9, height: 355.6 },
} as const;

export type PageSizeId = keyof typeof PAGE_SIZES | "fit";
export type Orientation = "auto" | "portrait" | "landscape";
export type FitMode = "contain" | "cover";
export type Rotation = 0 | 90 | 180 | 270;

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Size {
  x: number;
  y: number;
}

export interface PageLayoutOptions {
  pageSize: PageSizeId;
  orientation: Orientation;
  marginMm: number;
  fit: FitMode;
  perPage: number;
}

/** Size of the image as it will appear (after EXIF orientation and user rotation). */
export function orientedSize(width: number, height: number, orientation = 1, rotation: Rotation = 0): Size {
  const swapped = (orientation >= 5) !== (rotation === 90 || rotation === 270);
  return swapped ? { width: height, height: width } : { width, height };
}

/** Rows × columns for a number of images per page. */
export function gridFor(perPage: number, landscape: boolean) {
  switch (perPage) {
    case 2:
      return landscape ? { rows: 1, cols: 2 } : { rows: 2, cols: 1 };
    case 4:
      return { rows: 2, cols: 2 };
    case 6:
      return landscape ? { rows: 2, cols: 3 } : { rows: 3, cols: 2 };
    case 9:
      return { rows: 3, cols: 3 };
    default:
      return { rows: 1, cols: 1 };
  }
}

/**
 * Page size for a fixed format. With "auto" orientation a single image picks
 * the orientation that matches its aspect ratio; multi-image pages stay portrait.
 */
export function fixedPageSize(id: Exclude<PageSizeId, "fit">, orientation: Orientation, content?: Size): Size {
  const base = PAGE_SIZES[id];
  const portrait = { width: base.width * PT_PER_MM, height: base.height * PT_PER_MM };
  const landscape =
    orientation === "landscape" || (orientation === "auto" && content !== undefined && content.width > content.height * 1.02);
  return landscape ? { width: portrait.height, height: portrait.width } : portrait;
}

const A4_LONG_SIDE = PAGE_SIZES.A4.height * PT_PER_MM;

/**
 * Page size when the page should follow the image. Real scan resolutions are
 * honoured (a 300 DPI A4 scan becomes an A4 page); for photos with a
 * meaningless 72/96 DPI tag the long side is normalised to A4's long side.
 */
export function fitPageSize(pixels: Size, dpi: Dpi | null, marginPt: number): Size {
  let width: number;
  let height: number;
  if (dpi && dpi.x >= 100 && dpi.y >= 100 && dpi.x <= 2400 && dpi.y <= 2400) {
    width = (pixels.width / dpi.x) * 72;
    height = (pixels.height / dpi.y) * 72;
  } else {
    const scale = A4_LONG_SIDE / Math.max(pixels.width, pixels.height);
    width = pixels.width * scale;
    height = pixels.height * scale;
  }
  return { width: width + marginPt * 2, height: height + marginPt * 2 };
}

/** Cell rectangles in reading order (left→right, top→bottom). */
export function cellRects(page: Size, marginPt: number, gapPt: number, rows: number, cols: number): Rect[] {
  const innerWidth = Math.max(1, page.width - marginPt * 2 - gapPt * (cols - 1));
  const innerHeight = Math.max(1, page.height - marginPt * 2 - gapPt * (rows - 1));
  const width = innerWidth / cols;
  const height = innerHeight / rows;
  const cells: Rect[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({
        x: marginPt + col * (width + gapPt),
        y: page.height - marginPt - (row + 1) * height - row * gapPt,
        width,
        height,
      });
    }
  }
  return cells;
}

/** Where the (oriented) image goes inside a cell, and whether it must be clipped. */
export function placeImage(cell: Rect, image: Size, fit: FitMode): { rect: Rect; clip: boolean } {
  const scale = fit === "cover" ? Math.max(cell.width / image.width, cell.height / image.height) : Math.min(cell.width / image.width, cell.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  return {
    rect: { x: cell.x + (cell.width - width) / 2, y: cell.y + (cell.height - height) / 2, width, height },
    clip: fit === "cover" && (width > cell.width + 0.01 || height > cell.height + 0.01),
  };
}

type Point = [number, number];

/** Maps normalised stored-image coordinates (s, t; top-left origin) to displayed ones. */
function orient(orientation: number, [s, t]: Point): Point {
  switch (orientation) {
    case 2:
      return [1 - s, t];
    case 3:
      return [1 - s, 1 - t];
    case 4:
      return [s, 1 - t];
    case 5:
      return [t, s];
    case 6:
      return [1 - t, s];
    case 7:
      return [1 - t, 1 - s];
    case 8:
      return [t, 1 - s];
    default:
      return [s, t];
  }
}

const ROTATION_AS_ORIENTATION: Record<Rotation, number> = { 0: 1, 90: 6, 180: 3, 270: 8 };

/**
 * PDF transformation matrix that draws an image XObject (unit square, stored
 * orientation) into `target` with EXIF orientation and a clockwise user
 * rotation applied.
 */
export function imageMatrix(orientation: number, rotation: Rotation, target: Rect): [number, number, number, number, number, number] {
  const map = (u: number, v: number): Point => {
    // XObject space (v up) → stored image (t down) → displayed image → page.
    const [s, t] = orient(ROTATION_AS_ORIENTATION[rotation], orient(orientation, [u, 1 - v]));
    return [target.x + target.width * s, target.y + target.height * (1 - t)];
  };
  const [e, f] = map(0, 0);
  const [ax, ay] = map(1, 0);
  const [cx, cy] = map(0, 1);
  return [ax - e, ay - f, cx - e, cy - f, e, f];
}
