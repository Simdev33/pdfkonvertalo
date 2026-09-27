/**
 * A small typesetter that lays out the text block model onto PDF pages with
 * embedded (subsetted) Noto fonts: word wrapping, pagination, headings, lists,
 * code blocks, tables with repeated headers, links, page numbers.
 */
import fontkit from "@cantoo/fontkit";
import { PDFName, PDFString, rgb, type PDFDocument, type PDFFont, type PDFPage, type RGB } from "@cantoo/pdf-lib";
import type { Block, FontStyle, Run } from "./text-model";

export type FontSource = (style: FontStyle) => Promise<Uint8Array>;

export interface TextPageOptions {
  width: number;
  height: number;
  margin: number;
  fontSize: number;
  /** Shown in the footer next to the page numbers. */
  title?: string;
  signal?: AbortSignal;
}

interface Face {
  pdf: PDFFont;
  has: (codePoint: number) => boolean;
  widths: Map<string, number>;
}

interface Piece {
  text: string;
  face: Face;
  width: number;
  color: RGB;
  href?: string;
}

interface Token {
  pieces: Piece[];
  width: number;
  space: boolean;
}

interface Line {
  tokens: Token[];
  width: number;
}

const INK = rgb(0.1, 0.11, 0.14);
const MUTED = rgb(0.4, 0.42, 0.47);
const LINK = rgb(0.15, 0.3, 0.85);
const RULE = rgb(0.84, 0.85, 0.88);
const CODE_BG = rgb(0.955, 0.96, 0.97);
const HEAD_BG = rgb(0.925, 0.93, 0.945);
const ZEBRA = rgb(0.975, 0.977, 0.982);

const FALLBACK: Record<FontStyle, FontStyle[]> = {
  regular: ["regular", "mono"],
  bold: ["bold", "regular", "mono"],
  italic: ["italic", "regular", "mono"],
  mono: ["mono", "regular"],
};

// Characters that are not printable in a PDF text run.
const CONTROL = /[\u0000-\u0008\u000b-\u001f\u007f-\u009f​﻿]/g;

async function loadFaces(doc: PDFDocument, styles: Set<FontStyle>, source: FontSource) {
  doc.registerFontkit(fontkit);
  // Always load the fallbacks of the styles in use.
  const needed = new Set<FontStyle>(["regular"]);
  for (const style of styles) for (const fallback of FALLBACK[style]) needed.add(fallback);
  const faces: Partial<Record<FontStyle, Face>> = {};
  await Promise.all(
    [...needed].map(async (style) => {
      const bytes = await source(style);
      const kit = fontkit.create(bytes as unknown as Buffer) as unknown as { hasGlyphForCodePoint(cp: number): boolean };
      faces[style] = { pdf: await doc.embedFont(bytes, { subset: true }), has: (cp) => kit.hasGlyphForCodePoint(cp), widths: new Map() };
    }),
  );
  return faces as Record<FontStyle, Face>;
}

function collectStyles(blocks: Block[]) {
  const styles = new Set<FontStyle>();
  for (const block of blocks) {
    if (block.type === "code") styles.add("mono");
    else if (block.type === "table") {
      styles.add("regular");
      if (block.header) styles.add("bold");
    } else if (block.type === "heading") styles.add("bold");
    if ("runs" in block) for (const run of block.runs) styles.add(run.style);
  }
  return styles;
}

class Typesetter {
  private readonly pages: PDFPage[] = [];
  private page!: PDFPage;
  private y = 0;
  private readonly left: number;
  private readonly right: number;
  private readonly top: number;
  private readonly bottom: number;
  private readonly links = new Map<PDFPage, { rect: number[]; href: string }[]>();
  private work = 0;

  constructor(
    private readonly doc: PDFDocument,
    private readonly faces: Record<FontStyle, Face>,
    private readonly options: TextPageOptions,
  ) {
    this.left = options.margin;
    this.right = options.width - options.margin;
    this.top = options.height - options.margin;
    this.bottom = options.margin;
    this.newPage();
  }

  private get contentWidth() {
    return this.right - this.left;
  }

  private newPage() {
    this.page = this.doc.addPage([this.options.width, this.options.height]);
    this.pages.push(this.page);
    this.y = this.top;
  }

  private ensure(height: number) {
    if (this.y - height < this.bottom - 0.01 && this.y < this.top) {
      this.newPage();
      return true;
    }
    return false;
  }

  /** Lets the browser breathe on big documents and honours cancellation. */
  private async tick(amount = 1) {
    this.work += amount;
    if (this.work < 300) return;
    this.work = 0;
    if (this.options.signal?.aborted) throw Object.assign(new Error("A műveletet megszakítottad."), { name: "AbortError" });
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  /* ------------------------------ measuring ------------------------------ */

  private faceFor(style: FontStyle, codePoint: number) {
    for (const candidate of FALLBACK[style]) {
      const face = this.faces[candidate];
      if (face?.has(codePoint)) return face;
    }
    return null;
  }

  private charWidth(face: Face, char: string) {
    let width = face.widths.get(char);
    if (width === undefined) {
      width = face.pdf.widthOfTextAtSize(char, 1000) / 1000;
      face.widths.set(char, width);
    }
    return width;
  }

  /** Splits text into pieces that each use one font (with fallback for missing glyphs). */
  private pieces(text: string, style: FontStyle, size: number, color: RGB, href?: string): Piece[] {
    const pieces: Piece[] = [];
    for (const raw of text.replace(CONTROL, "")) {
      let face = this.faceFor(style, raw.codePointAt(0)!);
      let char = raw;
      if (!face) {
        face = this.faces[FALLBACK[style][0]] ?? this.faces.regular;
        char = "?";
      }
      const width = this.charWidth(face, char) * size;
      const last = pieces.at(-1);
      if (last && last.face === face) {
        last.text += char;
        last.width += width;
      } else {
        pieces.push({ text: char, face, width, color, href });
      }
    }
    return pieces;
  }

  private tokens(runs: Run[], size: number, color: RGB): Token[] {
    const tokens: Token[] = [];
    for (const run of runs) {
      const runColor = run.href ? LINK : color;
      for (const part of run.text.split(/(\s+)/)) {
        if (!part) continue;
        const space = /^\s+$/.test(part);
        const pieces = this.pieces(space ? part.replace(/\s/g, " ") : part, run.style, size, runColor, run.href);
        tokens.push({ pieces, width: pieces.reduce((sum, piece) => sum + piece.width, 0), space });
      }
    }
    return tokens;
  }

  /** Greedy line breaking; words wider than a line are broken between characters. */
  private wrap(tokens: Token[], width: number, size: number, keepLeadingSpace = false): Line[] {
    const lines: Line[] = [];
    let line: Line = { tokens: [], width: 0 };
    const flush = () => {
      while (line.tokens.length && line.tokens.at(-1)!.space) line.width -= line.tokens.pop()!.width;
      lines.push(line);
      line = { tokens: [], width: 0 };
    };
    for (const token of tokens) {
      if (token.space && line.tokens.length === 0 && (lines.length > 0 || !keepLeadingSpace)) continue;
      if (line.width + token.width <= width || (token.space && line.tokens.length > 0)) {
        line.tokens.push(token);
        line.width += token.width;
        continue;
      }
      if (line.tokens.length) flush();
      if (token.width <= width) {
        line.tokens.push(token);
        line.width += token.width;
        continue;
      }
      // Break an overlong word character by character.
      for (const piece of token.pieces) {
        for (const char of piece.text) {
          const charWidth = this.charWidth(piece.face, char) * size;
          if (line.width + charWidth > width && line.tokens.length) flush();
          const last = line.tokens.at(-1);
          const lastPiece = last?.pieces.at(-1);
          if (last && !last.space && lastPiece && lastPiece.face === piece.face && lastPiece.color === piece.color) {
            lastPiece.text += char;
            lastPiece.width += charWidth;
            last.width += charWidth;
          } else {
            line.tokens.push({ pieces: [{ ...piece, text: char, width: charWidth }], width: charWidth, space: false });
          }
          line.width += charWidth;
        }
      }
    }
    if (line.tokens.length || lines.length === 0) flush();
    return lines;
  }

  /* ------------------------------- drawing ------------------------------- */

  private drawLine(line: Line, x: number, baseline: number, size: number) {
    // Merge consecutive pieces with identical styling into a single text run.
    const merged: Piece[] = [];
    for (const token of line.tokens) {
      for (const piece of token.pieces) {
        const last = merged.at(-1);
        if (last && last.face === piece.face && last.color === piece.color && last.href === piece.href) {
          merged[merged.length - 1] = { ...last, text: last.text + piece.text, width: last.width + piece.width };
        } else {
          merged.push(piece);
        }
      }
    }
    let cursor = x;
    for (const piece of merged) {
      if (piece.text.trim()) {
        this.page.drawText(piece.text, { x: cursor, y: baseline, size, font: piece.face.pdf, color: piece.color });
        if (piece.href) {
          const list = this.links.get(this.page) ?? [];
          list.push({ rect: [cursor, baseline - size * 0.25, cursor + piece.width, baseline + size * 0.85], href: piece.href });
          this.links.set(this.page, list);
        }
      }
      cursor += piece.width;
    }
  }

  private async flow(runs: Run[], options: { size: number; indent?: number; color?: RGB; lineHeight?: number; hanging?: number; keepLeadingSpace?: boolean }) {
    const { size, indent = 0, color = INK, hanging = 0 } = options;
    const lineHeight = size * (options.lineHeight ?? 1.45);
    const lines = this.wrap(this.tokens(runs, size, color), this.contentWidth - indent, size, options.keepLeadingSpace);
    const placed: { page: PDFPage; top: number; bottom: number }[] = [];
    for (const [index, line] of lines.entries()) {
      this.ensure(lineHeight);
      const baseline = this.y - (lineHeight + size * 0.7) / 2;
      this.drawLine(line, this.left + indent + (index > 0 ? hanging : 0), baseline, size);
      placed.push({ page: this.page, top: this.y, bottom: this.y - lineHeight });
      this.y -= lineHeight;
      await this.tick();
    }
    return placed;
  }

  private space(amount: number) {
    if (this.y < this.top) this.y = Math.max(this.bottom, this.y - amount);
  }

  async block(block: Block) {
    const base = this.options.fontSize;
    switch (block.type) {
      case "line": {
        const size = block.mono ? base * 0.86 : base;
        const lineHeight = block.mono ? 1.38 : 1.45;
        if (block.runs.length === 0 || block.runs.every((run) => !run.text)) {
          this.ensure(size * lineHeight);
          this.y -= size * lineHeight;
          await this.tick();
          return;
        }
        await this.flow(block.runs, { size, lineHeight, hanging: block.mono ? size * 2 : 0, keepLeadingSpace: true });
        return;
      }

      case "paragraph":
        await this.flow(block.runs, { size: base });
        this.space(base * 0.55);
        return;

      case "heading": {
        const scale = [1.9, 1.5, 1.25, 1.1, 1, 0.95][block.level - 1] ?? 1;
        const size = base * scale;
        // Keep the heading together with at least two lines of what follows.
        if (this.y < this.top) {
          this.space(size * 0.8);
          if (this.y - size * 1.3 - base * 3 < this.bottom) this.newPage();
        }
        const placed = await this.flow(block.runs, { size, lineHeight: 1.3 });
        if (block.level <= 2 && placed.length) {
          this.y -= size * 0.2;
          this.page.drawLine({ start: { x: this.left, y: this.y }, end: { x: this.right, y: this.y }, thickness: 0.6, color: RULE });
        }
        this.space(size * 0.45);
        return;
      }

      case "item": {
        const indent = block.depth * base * 1.4;
        const marker = block.marker;
        const markerWidth = this.tokens([{ text: marker, style: "regular" }], base, INK)[0]?.width ?? 0;
        const gap = Math.max(markerWidth + base * 0.5, base * 1.1);
        this.ensure(base * 1.45);
        const baseline = this.y - (base * 1.45 + base * 0.7) / 2;
        const markerLine = this.wrap(this.tokens([{ text: marker, style: "regular" }], base, MUTED), 1000, base)[0];
        this.drawLine(markerLine, this.left + indent + (marker === "•" ? base * 0.2 : 0), baseline, base);
        await this.flow(block.runs, { size: base, indent: indent + gap });
        this.space(base * 0.2);
        return;
      }

      case "quote": {
        const placed = await this.flow(block.runs, { size: base, indent: base * 1.1, color: MUTED });
        for (const { page, top, bottom } of placed) {
          page.drawRectangle({ x: this.left, y: bottom, width: 2.5, height: top - bottom, color: RULE });
        }
        this.space(base * 0.55);
        return;
      }

      case "code": {
        const size = base * 0.84;
        const lineHeight = size * 1.42;
        const pad = size * 0.8;
        const lines = block.lines.flatMap((text) =>
          this.wrap(this.tokens([{ text, style: "mono" }], size, INK), this.contentWidth - pad * 2, size, true),
        );
        let index = 0;
        this.space(base * 0.2);
        while (index < lines.length || (lines.length === 0 && index === 0)) {
          this.ensure(lineHeight + pad * 2);
          const available = Math.max(1, Math.floor((this.y - this.bottom - pad * 2) / lineHeight));
          const chunk = lines.slice(index, index + available);
          const height = Math.max(1, chunk.length) * lineHeight + pad * 2;
          this.page.drawRectangle({ x: this.left, y: this.y - height, width: this.contentWidth, height, color: CODE_BG });
          let y = this.y - pad;
          for (const line of chunk) {
            this.drawLine(line, this.left + pad, y - (lineHeight + size * 0.7) / 2, size);
            y -= lineHeight;
            await this.tick();
          }
          this.y -= height;
          index += Math.max(1, chunk.length);
          if (index < lines.length) this.newPage();
        }
        this.space(base * 0.7);
        return;
      }

      case "rule":
        this.space(base * 0.6);
        this.ensure(2);
        this.page.drawLine({ start: { x: this.left, y: this.y }, end: { x: this.right, y: this.y }, thickness: 0.8, color: RULE });
        this.space(base * 0.9);
        return;

      case "table":
        await this.table(block.header, block.rows);
        this.space(base * 0.8);
        return;
    }
  }

  /* -------------------------------- tables ------------------------------- */

  private async table(header: string[] | null, body: string[][]) {
    const cols = Math.max(header?.length ?? 0, ...body.map((row) => row.length), 1);
    const base = this.options.fontSize;
    const size = base * (cols > 9 ? 0.7 : cols > 6 ? 0.78 : 0.86);
    const padX = size * 0.5;
    const padY = size * 0.38;
    const lineHeight = size * 1.3;
    const normalize = (row: string[]) => Array.from({ length: cols }, (_, i) => (row[i] ?? "").slice(0, 2000));
    const head = header ? normalize(header) : null;
    const rows = body.map(normalize);

    // Natural column widths (capped), then shrink proportionally if needed.
    const cap = this.contentWidth * 0.5;
    const measure = (text: string, style: FontStyle) => Math.min(cap, this.tokens([{ text, style }], size, INK).reduce((sum, token) => sum + token.width, 0));
    const natural = Array.from({ length: cols }, (_, c) => {
      let width = head ? measure(head[c], "bold") : 0;
      for (let r = 0; r < Math.min(rows.length, 500); r++) width = Math.max(width, measure(rows[r][c], "regular"));
      return width + padX * 2;
    });
    let widths = natural;
    const total = natural.reduce((sum, width) => sum + width, 0);
    if (total > this.contentWidth) {
      const minimum = natural.map((width) => Math.min(width, Math.max(size * 4.5, padX * 2 + size * 2)));
      const minTotal = minimum.reduce((sum, width) => sum + width, 0);
      const extra = natural.map((width, c) => width - minimum[c]);
      const extraTotal = extra.reduce((sum, width) => sum + width, 0) || 1;
      const room = Math.max(0, this.contentWidth - minTotal);
      widths = minimum.map((width, c) => width + (extra[c] / extraTotal) * room);
    }
    const numeric = Array.from({ length: cols }, (_, c) => {
      const values = rows.map((row) => row[c].trim()).filter(Boolean);
      return values.length > 0 && values.every((value) => /^[-+]?[\d\s .,]+(%|\s?(Ft|HUF|€|EUR|\$|USD))?$/i.test(value));
    });
    const tableWidth = widths.reduce((sum, width) => sum + width, 0);

    let pageTop = this.y;
    const closeFrame = () => {
      if (pageTop - this.y < 0.5) return;
      let x = this.left;
      for (let c = 0; c <= cols; c++) {
        this.page.drawLine({ start: { x, y: pageTop }, end: { x, y: this.y }, thickness: 0.5, color: RULE });
        x += widths[c] ?? 0;
      }
    };

    const drawRow = async (cells: string[], isHeader: boolean, zebra: boolean) => {
      const style: FontStyle = isHeader ? "bold" : "regular";
      const wrapped = cells.map((cell, c) => this.wrap(this.tokens([{ text: cell, style }], size, INK), widths[c] - padX * 2, size));
      const maxLines = Math.max(1, Math.floor((this.top - this.bottom - padY * 2) / lineHeight));
      const lineCount = Math.min(maxLines, Math.max(1, ...wrapped.map((lines) => lines.length)));
      const height = lineCount * lineHeight + padY * 2;

      if (this.y - height < this.bottom && this.y < this.top) {
        closeFrame();
        this.newPage();
        pageTop = this.y;
        this.page.drawLine({ start: { x: this.left, y: this.y }, end: { x: this.left + tableWidth, y: this.y }, thickness: 0.5, color: RULE });
        if (head && !isHeader) await drawRow(head, true, false);
      }

      if (isHeader || zebra) {
        this.page.drawRectangle({ x: this.left, y: this.y - height, width: tableWidth, height, color: isHeader ? HEAD_BG : ZEBRA });
      }
      let x = this.left;
      for (let c = 0; c < cols; c++) {
        let y = this.y - padY;
        for (const line of wrapped[c].slice(0, lineCount)) {
          const offset = numeric[c] && !isHeader ? widths[c] - padX * 2 - line.width : 0;
          this.drawLine(line, x + padX + Math.max(0, offset), y - (lineHeight + size * 0.7) / 2, size);
          y -= lineHeight;
        }
        x += widths[c];
      }
      this.y -= height;
      this.page.drawLine({ start: { x: this.left, y: this.y }, end: { x: this.left + tableWidth, y: this.y }, thickness: 0.5, color: RULE });
      await this.tick(cols);
    };

    this.ensure(lineHeight * 2 + padY * 4);
    pageTop = this.y;
    this.page.drawLine({ start: { x: this.left, y: this.y }, end: { x: this.left + tableWidth, y: this.y }, thickness: 0.5, color: RULE });
    if (head) await drawRow(head, true, false);
    for (const [index, row] of rows.entries()) await drawRow(row, false, index % 2 === 1);
    closeFrame();
  }

  /* ------------------------------- finishing ----------------------------- */

  finish() {
    const total = this.pages.length;
    const size = 7.5;
    const footerY = Math.max(12, this.bottom / 2 - size / 2);
    const regular = this.faces.regular;
    for (const [index, page] of this.pages.entries()) {
      const label = `${index + 1} / ${total}`;
      const labelWidth = regular.pdf.widthOfTextAtSize(label, size);
      page.drawText(label, { x: this.right - labelWidth, y: footerY, size, font: regular.pdf, color: MUTED });
      if (this.options.title) {
        const title = this.pieces(this.options.title, "regular", size, MUTED);
        let width = 0;
        let text = "";
        const face = title[0]?.face ?? regular;
        for (const piece of title) {
          if (piece.face !== face) break;
          if (width + piece.width > this.contentWidth - labelWidth - 24) break;
          text += piece.text;
          width += piece.width;
        }
        if (text) page.drawText(text, { x: this.left, y: footerY, size, font: face.pdf, color: MUTED });
      }
      const links = this.links.get(page);
      if (links?.length) {
        const annots = links.map(({ rect, href }) =>
          this.doc.context.register(
            this.doc.context.obj({
              Type: "Annot",
              Subtype: "Link",
              Rect: rect,
              Border: [0, 0, 0],
              A: { Type: "Action", S: "URI", URI: PDFString.of(href) },
            }),
          ),
        );
        page.node.set(PDFName.of("Annots"), this.doc.context.obj(annots));
      }
    }
    return total;
  }
}

/** Lays out `blocks` on new pages appended to `doc`. Returns the page count. */
export async function renderText(doc: PDFDocument, blocks: Block[], options: TextPageOptions, fonts: FontSource) {
  const faces = await loadFaces(doc, collectStyles(blocks), fonts);
  const setter = new Typesetter(doc, faces, options);
  for (const block of blocks) await setter.block(block);
  return setter.finish();
}

/** Rough natural width of a table, used to pick landscape pages for wide CSVs. */
export function estimateTableWidth(blocks: Block[], fontSize: number) {
  let widest = 0;
  for (const block of blocks) {
    if (block.type !== "table") continue;
    const cols = Math.max(block.header?.length ?? 0, ...block.rows.slice(0, 200).map((row) => row.length));
    const size = fontSize * (cols > 9 ? 0.7 : cols > 6 ? 0.78 : 0.86);
    let total = 0;
    for (let c = 0; c < cols; c++) {
      let chars = block.header?.[c]?.length ?? 0;
      for (const row of block.rows.slice(0, 200)) chars = Math.max(chars, Math.min(60, row[c]?.length ?? 0));
      total += chars * size * 0.55 + size;
    }
    widest = Math.max(widest, total);
  }
  return widest;
}
