/**
 * Page range expressions such as "1-3, 5, 8-", "-4", "páros" or "odd".
 * Page numbers in expressions are 1-based, everything returned is 0-based.
 * Errors are codes; the UI turns them into text in the visitor's language.
 */

/** Inclusive, 0-based, start <= end. */
export type PageRange = readonly [start: number, end: number];

export type RangeError =
  | { code: "unparsable"; token: string }
  | { code: "zero" }
  | { code: "beyond"; page: number; pageCount: number };

export type RangesParseResult = { ok: true; ranges: PageRange[] } | { ok: false; error: RangeError };
export type SelectionParseResult = { ok: true; pages: number[] } | { ok: false; error: RangeError };

// Keywords in every supported language (with and without accents).
const KEYWORDS: Record<string, "all" | "odd" | "even"> = {
  "*": "all",
  ...Object.fromEntries(
    ["mind", "minden", "összes", "osszes", "all", "alle", "tout", "toutes", "tous", "todo", "todas", "todos"].map((word) => [word, "all" as const]),
  ),
  ...Object.fromEntries(
    ["páratlan", "paratlan", "odd", "ungerade", "impair", "impaires", "impairs", "impar", "impares"].map((word) => [word, "odd" as const]),
  ),
  ...Object.fromEntries(["páros", "paros", "even", "gerade", "pair", "paires", "pairs", "par", "pares"].map((word) => [word, "even" as const])),
};

export function parsePageRanges(input: string, pageCount: number): RangesParseResult {
  const tokens = input
    .replace(/\s*[-–—]\s*/g, "-")
    .split(/[\s,;]+/)
    .filter(Boolean);

  const ranges: PageRange[] = [];
  const page = (raw: string) => Number.parseInt(raw, 10) - 1;

  for (const token of tokens) {
    const keyword = KEYWORDS[token.toLowerCase()];
    if (keyword) {
      if (keyword === "all") ranges.push([0, pageCount - 1]);
      else for (let i = keyword === "odd" ? 0 : 1; i < pageCount; i += 2) ranges.push([i, i]);
      continue;
    }

    const match = /^(\d+)?(-)?(\d+)?$/.exec(token);
    if (!match || (!match[1] && !match[3])) return { ok: false, error: { code: "unparsable", token } };

    const [, from, dash, to] = match;
    let start: number;
    let end: number;
    if (!dash) {
      start = end = page(from);
    } else {
      start = from ? page(from) : 0;
      end = to ? page(to) : pageCount - 1;
    }

    for (const value of [start, end]) {
      if (value < 0) return { ok: false, error: { code: "zero" } };
      if (value >= pageCount) return { ok: false, error: { code: "beyond", page: value + 1, pageCount } };
    }
    ranges.push(start <= end ? [start, end] : [end, start]);
  }

  return { ok: true, ranges };
}

export function parsePageSelection(input: string, pageCount: number): SelectionParseResult {
  const result = parsePageRanges(input, pageCount);
  if (!result.ok) return result;
  const pages = new Set<number>();
  for (const [start, end] of result.ranges) for (let i = start; i <= end; i++) pages.add(i);
  return { ok: true, pages: [...pages].sort((a, b) => a - b) };
}

export function formatRange(start: number, end: number) {
  return start === end ? `${start + 1}` : `${start + 1}-${end + 1}`;
}

/** Compresses a set of 0-based pages to "1-3, 5, 8-10". */
export function formatPageSelection(pages: Iterable<number>): string {
  const sorted = [...new Set(pages)].sort((a, b) => a - b);
  const parts: string[] = [];
  for (let i = 0; i < sorted.length; ) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    parts.push(formatRange(sorted[i], sorted[j]));
    i = j + 1;
  }
  return parts.join(", ");
}
