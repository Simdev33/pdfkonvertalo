import { describe, expect, it } from "vitest";
import { cellRects, fitPageSize, fixedPageSize, gridFor, imageMatrix, orientedSize, placeImage, PT_PER_MM, type Rect, type Rotation } from "./layout";

const apply = ([a, b, c, d, e, f]: number[], u: number, v: number) => [a * u + c * v + e, b * u + d * v + f].map((n) => Math.round(n * 1000) / 1000);
const target: Rect = { x: 10, y: 20, width: 100, height: 50 };

describe("orientedSize", () => {
  it("swaps for rotated orientations and quarter turns", () => {
    expect(orientedSize(400, 300, 6)).toEqual({ width: 300, height: 400 });
    expect(orientedSize(400, 300, 1, 90)).toEqual({ width: 300, height: 400 });
    expect(orientedSize(400, 300, 6, 90)).toEqual({ width: 400, height: 300 });
    expect(orientedSize(400, 300, 3, 180)).toEqual({ width: 400, height: 300 });
  });
});

describe("imageMatrix", () => {
  it("is a plain scale + translate for upright images", () => {
    expect(imageMatrix(1, 0, target)).toEqual([100, 0, 0, 50, 10, 20]);
  });

  it("puts the stored top-left corner where it belongs", () => {
    // XObject (0, 1) is the stored image's top-left pixel.
    const topLeft = (orientation: number, rotation: Rotation) => apply(imageMatrix(orientation, rotation, target), 0, 1);
    expect(topLeft(1, 0)).toEqual([10, 70]); // display top-left
    expect(topLeft(6, 0)).toEqual([110, 70]); // rotated 90° cw → top-right
    expect(topLeft(8, 0)).toEqual([10, 20]); // rotated 90° ccw → bottom-left
    expect(topLeft(3, 0)).toEqual([110, 20]); // 180° → bottom-right
    expect(topLeft(2, 0)).toEqual([110, 70]); // mirrored → top-right
    expect(topLeft(1, 90)).toEqual([110, 70]); // user rotation behaves like EXIF 6
  });

  it("composes EXIF orientation with the user rotation", () => {
    expect(imageMatrix(3, 180, target)).toEqual(imageMatrix(1, 0, target));
    expect(imageMatrix(6, 270, target)).toEqual(imageMatrix(1, 0, target));
    expect(imageMatrix(8, 90, target)).toEqual(imageMatrix(1, 0, target));
  });

  it("always covers exactly the target rectangle", () => {
    for (const orientation of [1, 2, 3, 4, 5, 6, 7, 8]) {
      for (const rotation of [0, 90, 180, 270] as Rotation[]) {
        const m = imageMatrix(orientation, rotation, target);
        const corners = [apply(m, 0, 0), apply(m, 1, 0), apply(m, 0, 1), apply(m, 1, 1)];
        expect(corners.map(([x]) => x).sort((a, b) => a - b)).toEqual([10, 10, 110, 110]);
        expect(corners.map(([, y]) => y).sort((a, b) => a - b)).toEqual([20, 20, 70, 70]);
      }
    }
  });
});

describe("page sizes", () => {
  it("picks orientation from the content in auto mode", () => {
    const portrait = fixedPageSize("A4", "auto", { width: 300, height: 400 });
    const landscape = fixedPageSize("A4", "auto", { width: 400, height: 300 });
    expect(portrait.width).toBeCloseTo(210 * PT_PER_MM);
    expect(landscape.width).toBeCloseTo(297 * PT_PER_MM);
    expect(fixedPageSize("A4", "portrait", { width: 400, height: 300 }).width).toBeCloseTo(210 * PT_PER_MM);
  });

  it("uses real scan resolution, otherwise normalises to A4", () => {
    const scan = fitPageSize({ width: 2480, height: 3508 }, { x: 300, y: 300 }, 0);
    expect(scan.width).toBeCloseTo(595.2, 0);
    expect(scan.height).toBeCloseTo(841.9, 0);
    const photo = fitPageSize({ width: 4032, height: 3024 }, { x: 72, y: 72 }, 10);
    expect(photo.width).toBeCloseTo(297 * PT_PER_MM + 20, 1);
  });
});

describe("cells and placement", () => {
  it("lays out cells in reading order", () => {
    const cells = cellRects({ width: 200, height: 300 }, 10, 10, 2, 2);
    expect(cells.map((c) => [c.x, c.y])).toEqual([
      [10, 155],
      [105, 155],
      [10, 10],
      [105, 10],
    ]);
    expect(cells[0].width).toBe(85);
    expect(gridFor(6, false)).toEqual({ rows: 3, cols: 2 });
  });

  it("contains or covers", () => {
    const cell: Rect = { x: 0, y: 0, width: 100, height: 100 };
    expect(placeImage(cell, { width: 200, height: 100 }, "contain")).toEqual({ rect: { x: 0, y: 25, width: 100, height: 50 }, clip: false });
    expect(placeImage(cell, { width: 200, height: 100 }, "cover")).toEqual({ rect: { x: -50, y: 0, width: 200, height: 100 }, clip: true });
  });
});
