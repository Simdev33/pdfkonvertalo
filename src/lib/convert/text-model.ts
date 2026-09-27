/**
 * Turns text-like inputs (plain text, source code, JSON, CSV/TSV, Markdown)
 * into a small block model that the PDF text renderer lays out.
 */
import type { TextFormat } from "./formats";

export type FontStyle = "regular" | "bold" | "italic" | "mono";

export interface Run {
  text: string;
  style: FontStyle;
  href?: string;
}

export type Block =
  | { type: "line"; runs: Run[]; mono?: boolean }
  | { type: "paragraph"; runs: Run[] }
  | { type: "heading"; level: number; runs: Run[] }
  | { type: "item"; runs: Run[]; marker: string; depth: number }
  | { type: "quote"; runs: Run[] }
  | { type: "code"; lines: string[] }
  | { type: "rule" }
  | { type: "table"; header: string[] | null; rows: string[][] };

export function expandTabs(line: string, size = 4) {
  if (!line.includes("\t")) return line;
  let out = "";
  for (const char of line) {
    if (char === "\t") out += " ".repeat(size - (out.length % size));
    else out += char;
  }
  return out;
}

const splitLines = (text: string) => text.replace(/^﻿/, "").split(/\r\n|\r|\n/);

export function toBlocks(text: string, format: TextFormat): Block[] {
  switch (format) {
    case "markdown":
      return parseMarkdown(text);
    case "csv":
    case "tsv": {
      const rows = parseDelimited(text, format === "tsv" ? "\t" : undefined);
      if (rows.length === 0) return [];
      return [{ type: "table", header: rows[0], rows: rows.slice(1) }];
    }
    case "json": {
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // Not valid JSON – print it as it is.
      }
      return splitLines(pretty).map((line) => ({ type: "line", mono: true, runs: [{ text: expandTabs(line), style: "mono" }] }));
    }
    case "code":
      return splitLines(text).map((line) => ({ type: "line", mono: true, runs: [{ text: expandTabs(line), style: "mono" }] }));
    default:
      return splitLines(text).map((line) => ({ type: "line", runs: line ? [{ text: expandTabs(line), style: "regular" }] : [] }));
  }
}

/* ---------------------------------- CSV ----------------------------------- */

/** Picks the most consistent delimiter among the usual suspects. */
export function detectDelimiter(text: string) {
  const sample = text.split(/\r\n|\n|\r/).slice(0, 20).filter(Boolean);
  let best = ",";
  let bestScore = -1;
  for (const delimiter of [",", ";", "\t", "|"]) {
    const counts = sample.map((line) => line.split(delimiter).length - 1);
    const first = counts[0] ?? 0;
    if (first === 0) continue;
    const consistent = counts.filter((count) => count === first).length;
    const score = consistent * 100 + first;
    if (score > bestScore) {
      best = delimiter;
      bestScore = score;
    }
  }
  return best;
}

/** RFC 4180 style parser (quoted fields, escaped quotes, newlines inside quotes). */
export function parseDelimited(text: string, delimiter = detectDelimiter(text)): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const input = text.replace(/^﻿/, "");
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"' && field === "") {
      quoted = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
}

/* -------------------------------- Markdown -------------------------------- */

const INLINE = /(`+)([^`]+?)\1|\*\*(.+?)\*\*|__(.+?)__|\*([^*\s](?:[^*]*[^*\s])?)\*|(?<![\w])_([^_\s](?:[^_]*[^_\s])?)_(?![\w])|!\[([^\]]*)\]\([^)]*\)|\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)|<(https?:\/\/[^>\s]+)>/g;

export function parseInline(text: string, base: FontStyle = "regular"): Run[] {
  const runs: Run[] = [];
  const push = (value: string, style: FontStyle, href?: string) => {
    if (!value) return;
    const clean = style === "mono" ? value : value.replace(/\\([\\`*_{}[\]()#+\-.!>])/g, "$1");
    const last = runs.at(-1);
    if (last && last.style === style && last.href === href) last.text += clean;
    else runs.push(href ? { text: clean, style, href } : { text: clean, style });
  };
  let index = 0;
  for (const match of text.matchAll(INLINE)) {
    push(text.slice(index, match.index), base);
    const [, , code, bold1, bold2, italic1, italic2, image, linkText, linkHref, autolink] = match;
    if (code !== undefined) push(code, "mono");
    else if (bold1 ?? bold2) push((bold1 ?? bold2)!, "bold");
    else if (italic1 ?? italic2) push((italic1 ?? italic2)!, base === "bold" ? "bold" : "italic");
    else if (image !== undefined) push(image ? `[${image}]` : "[kép]", "italic");
    else if (linkText !== undefined) push(linkText, base, linkHref);
    else if (autolink) push(autolink, base, autolink);
    index = match.index + match[0].length;
  }
  push(text.slice(index), base);
  return runs;
}

const FENCE = /^\s{0,3}(`{3,}|~{3,})/;
const HEADING = /^\s{0,3}(#{1,6})(?:\s+(.*?))?\s*#*\s*$/;
const RULE = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;
const ITEM = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/;
const TABLE_SEPARATOR = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$/;

const tableCells = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim().replace(/\\\|/g, "|"));

export function parseMarkdown(text: string): Block[] {
  const lines = splitLines(text).map((line) => expandTabs(line));
  const blocks: Block[] = [];
  const startsBlock = (line: string, next?: string) =>
    FENCE.test(line) || HEADING.test(line) || RULE.test(line) || /^\s*>/.test(line) || ITEM.test(line) || (line.includes("|") && next !== undefined && TABLE_SEPARATOR.test(next) && next.includes("-"));

  for (let i = 0; i < lines.length; ) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    const fence = FENCE.exec(line);
    if (fence) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith(fence[1])) code.push(lines[i++]);
      i++; // closing fence
      blocks.push({ type: "code", lines: code });
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, runs: parseInline(heading[2] ?? "", "bold") });
      i++;
      continue;
    }

    if (RULE.test(line)) {
      blocks.push({ type: "rule" });
      i++;
      continue;
    }

    if (line.includes("|") && i + 1 < lines.length && TABLE_SEPARATOR.test(lines[i + 1]) && lines[i + 1].includes("-")) {
      const header = tableCells(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) rows.push(tableCells(lines[i++]));
      blocks.push({ type: "table", header, rows });
      continue;
    }

    if (/^\s*>/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) quote.push(lines[i++].replace(/^\s*>\s?/, ""));
      blocks.push({ type: "quote", runs: parseInline(quote.join(" ").trim()) });
      continue;
    }

    const item = ITEM.exec(line);
    if (item) {
      const depth = Math.min(4, Math.floor(item[1].length / 2));
      const ordered = /\d/.test(item[2]);
      const parts = [item[3].replace(/^\[( |x|X)\]\s+/, (_, done: string) => (done === " " ? "[ ] " : "[x] "))];
      i++;
      while (i < lines.length && lines[i].trim() && !startsBlock(lines[i], lines[i + 1]) && /^\s+/.test(lines[i])) parts.push(lines[i++].trim());
      blocks.push({ type: "item", runs: parseInline(parts.join(" ")), marker: ordered ? item[2].replace(")", ".") : "•", depth });
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() && (paragraph.length === 0 || !startsBlock(lines[i], lines[i + 1]))) paragraph.push(lines[i++].trim());
    blocks.push({ type: "paragraph", runs: parseInline(paragraph.join(" ")) });
  }
  return blocks;
}

/* -------------------------------- Encoding -------------------------------- */

/**
 * Decodes text files: BOMs are honoured, UTF-8 is tried first and anything
 * that is not valid UTF-8 is read as Windows-1250 – the classic encoding of
 * Hungarian (Central European) TXT and Excel CSV exports.
 */
export function decodeText(bytes: Uint8Array) {
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) return new TextDecoder("utf-8").decode(bytes.subarray(3));
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder("utf-16le").decode(bytes.subarray(2));
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder("utf-16be").decode(bytes.subarray(2));
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder("windows-1250").decode(bytes);
  }
}
