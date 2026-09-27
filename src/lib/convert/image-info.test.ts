import { describe, expect, it } from "vitest";
import { readJpegInfo, readPngInfo } from "./image-info";

const u16 = (n: number) => [(n >> 8) & 0xff, n & 0xff];
const u32 = (n: number) => [(n >>> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
const str = (s: string) => [...s].map((c) => c.charCodeAt(0));
const segment = (marker: number, data: number[]) => [0xff, marker, ...u16(data.length + 2), ...data];

/** Minimal big-endian EXIF block with orientation, resolution and unit. */
function exif(orientation: number, dpi: number) {
  const entries = 4;
  const ifdSize = 2 + entries * 12 + 4;
  const rationalAt = 8 + ifdSize;
  const entry = (tag: number, type: number, count: number, value: number[]) => [...u16(tag), ...u16(type), ...u32(count), ...value];
  return [
    ...str("Exif\0\0"),
    ...str("MM"),
    ...u16(42),
    ...u32(8),
    ...u16(entries),
    ...entry(0x0112, 3, 1, [...u16(orientation), 0, 0]),
    ...entry(0x011a, 5, 1, u32(rationalAt)),
    ...entry(0x011b, 5, 1, u32(rationalAt + 8)),
    ...entry(0x0128, 3, 1, [...u16(2), 0, 0]),
    ...u32(0),
    ...u32(dpi),
    ...u32(1),
    ...u32(dpi),
    ...u32(1),
  ];
}

function jpeg(parts: number[][]) {
  return Uint8Array.from([0xff, 0xd8, ...parts.flat(), 0xff, 0xd9]);
}

const sof = (width: number, height: number) => segment(0xc0, [8, ...u16(height), ...u16(width), 3, 1, 0x22, 0, 2, 0x11, 1, 3, 0x11, 1]);

describe("readJpegInfo", () => {
  it("reads dimensions, EXIF orientation and resolution", () => {
    const info = readJpegInfo(jpeg([segment(0xe1, exif(6, 300)), sof(200, 100), segment(0xda, [1, 1, 0, 0, 0x3f, 0])]));
    expect(info).toEqual({ width: 200, height: 100, components: 3, orientation: 6, dpi: { x: 300, y: 300 } });
  });

  it("prefers the JFIF density and defaults to upright", () => {
    const jfif = segment(0xe0, [...str("JFIF\0"), 1, 2, 1, ...u16(150), ...u16(150), 0, 0]);
    const info = readJpegInfo(jpeg([jfif, sof(10, 20)]));
    expect(info).toMatchObject({ width: 10, height: 20, orientation: 1, dpi: { x: 150, y: 150 } });
  });

  it("ignores aspect-only JFIF densities and rejects non-JPEG data", () => {
    const jfif = segment(0xe0, [...str("JFIF\0"), 1, 2, 0, ...u16(1), ...u16(1), 0, 0]);
    expect(readJpegInfo(jpeg([jfif, sof(10, 20)]))?.dpi).toBeNull();
    expect(readJpegInfo(Uint8Array.from([1, 2, 3, 4]))).toBeNull();
  });
});

describe("readPngInfo", () => {
  function png(colorType: number, chunks: number[][]) {
    const chunk = (type: string, data: number[]) => [...u32(data.length), ...str(type), ...data, 0, 0, 0, 0];
    return Uint8Array.from([
      0x89,
      ...str("PNG\r\n\x1a\n"),
      ...chunk("IHDR", [...u32(640), ...u32(480), 8, colorType, 0, 0, 0]),
      ...chunks.flat(),
      ...chunk("IDAT", [0]),
    ]);
  }

  it("reads size, alpha and pHYs resolution", () => {
    const phys = [...u32(9), ...str("pHYs"), ...u32(11811), ...u32(11811), 1, 0, 0, 0, 0];
    const info = readPngInfo(png(2, [phys]));
    expect(info).toMatchObject({ width: 640, height: 480, hasAlpha: false });
    expect(info!.dpi!.x).toBeCloseTo(300, 0);
  });

  it("detects alpha from the colour type or a tRNS chunk", () => {
    expect(readPngInfo(png(6, []))?.hasAlpha).toBe(true);
    const trns = [...u32(1), ...str("tRNS"), 0, 0, 0, 0, 0];
    expect(readPngInfo(png(3, [trns]))?.hasAlpha).toBe(true);
  });
});
