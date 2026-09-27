import { describe, expect, it } from "vitest";
import { formatPageSelection, parsePageRanges, parsePageSelection } from "./ranges";

describe("parsePageSelection", () => {
  it("parses singles, ranges and open ranges", () => {
    expect(parsePageSelection("1-3, 5, 8-", 10)).toEqual({ ok: true, pages: [0, 1, 2, 4, 7, 8, 9] });
    expect(parsePageSelection("-2", 10)).toEqual({ ok: true, pages: [0, 1] });
  });

  it("accepts loose separators, dashes and reversed ranges", () => {
    expect(parsePageSelection(" 4 – 2 ; 7  9 ", 10)).toEqual({ ok: true, pages: [1, 2, 3, 6, 8] });
  });

  it("supports keywords", () => {
    expect(parsePageSelection("páratlan", 5)).toEqual({ ok: true, pages: [0, 2, 4] });
    expect(parsePageSelection("Páros", 5)).toEqual({ ok: true, pages: [1, 3] });
    expect(parsePageSelection("all", 3)).toEqual({ ok: true, pages: [0, 1, 2] });
  });

  it("treats empty input as empty selection", () => {
    expect(parsePageSelection("  ", 3)).toEqual({ ok: true, pages: [] });
  });

  it("reports invalid tokens and out of range pages", () => {
    const invalid = parsePageSelection("1, x", 3);
    expect(invalid.ok).toBe(false);
    const tooBig = parsePageSelection("2-4", 3);
    expect(tooBig).toEqual({ ok: false, error: "Nincs 4. oldal – a dokumentum 3 oldalas." });
    expect(parsePageSelection("0", 3).ok).toBe(false);
    expect(parsePageSelection("-", 3).ok).toBe(false);
  });
});

describe("parsePageRanges", () => {
  it("keeps input order", () => {
    expect(parsePageRanges("5-6, 1", 6)).toEqual({ ok: true, ranges: [[4, 5], [0, 0]] });
  });
});

describe("formatPageSelection", () => {
  it("compresses runs", () => {
    expect(formatPageSelection([0, 1, 2, 4, 7, 8, 9])).toBe("1-3, 5, 8-10");
    expect(formatPageSelection([3, 3, 1])).toBe("2, 4");
    expect(formatPageSelection([])).toBe("");
  });

  it("round-trips", () => {
    const pages = [0, 2, 3, 4, 10, 12, 13];
    const parsed = parsePageSelection(formatPageSelection(pages), 20);
    expect(parsed).toEqual({ ok: true, pages });
  });
});
