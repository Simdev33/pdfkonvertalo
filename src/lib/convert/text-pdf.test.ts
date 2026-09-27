import { PDFArray, PDFDict, PDFDocument, PDFName } from "@cantoo/pdf-lib";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderText, type FontSource } from "./text-pdf";
import { toBlocks } from "./text-model";

const FILES = {
  regular: "NotoSans-Regular.ttf",
  bold: "NotoSans-Bold.ttf",
  italic: "NotoSans-Italic.ttf",
  mono: "NotoSansMono-Regular.ttf",
} as const;

const fonts: FontSource = async (style) => new Uint8Array(await readFile(join(process.cwd(), "public", "fonts", FILES[style])));
const A4 = { width: 595.28, height: 841.89, margin: 51, fontSize: 11 };

async function render(text: string, format: Parameters<typeof toBlocks>[1], title = "teszt.txt") {
  const doc = await PDFDocument.create();
  const pages = await renderText(doc, toBlocks(text, format), { ...A4, title }, fonts);
  const bytes = await doc.save();
  return { doc, pages, bytes };
}

/** Extracts the text of every page with pdf.js. */
async function pageTexts(bytes: Uint8Array) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdf = await pdfjs.getDocument({ data: bytes.slice() }).promise;
  const texts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const content = await (await pdf.getPage(i)).getTextContent();
    texts.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
  }
  await pdf.loadingTask.destroy();
  return texts;
}

describe("renderText", () => {
  it("embeds Hungarian text that can be extracted again", async () => {
    const { pages, bytes } = await render("Árvíztűrő tükörfúrógép – ŐŰ őű", "text", "ékezetek.txt");
    expect(pages).toBe(1);
    const [text] = await pageTexts(bytes);
    expect(text).toContain("Árvíztűrő tükörfúrógép – ŐŰ őű");
    expect(text).toContain("1 / 1");
    expect(text).toContain("ékezetek.txt");
  });

  it("wraps long lines and paginates long documents", async () => {
    const long = Array.from({ length: 400 }, (_, i) => `${i + 1}. sor – ${"lorem ipsum dolor ".repeat(i % 3 ? 1 : 12)}`).join("\n");
    const { pages, bytes } = await render(long, "text");
    expect(pages).toBeGreaterThan(5);
    const texts = await pageTexts(bytes);
    expect(texts.at(-1)).toContain(`${pages} / ${pages}`);
    expect(texts.join(" ")).toContain("400. sor");
  });

  it("falls back to another font for missing glyphs and replaces unknown ones", async () => {
    const { bytes } = await render("nyíl → jobbra, kínai: 漢", "text");
    const [text] = await pageTexts(bytes);
    expect(text).toContain("→");
    expect(text).toContain("?");
  });

  it("repeats the table header on every page", async () => {
    const csv = ["Termék;Mennyiség;Ár", ...Array.from({ length: 120 }, (_, i) => `Tétel ${i + 1};${i + 1};${(i + 1) * 990} Ft`)].join("\n");
    const { pages, bytes } = await render(csv, "csv", "arlista.csv");
    expect(pages).toBeGreaterThan(1);
    const texts = await pageTexts(bytes);
    for (const text of texts) expect(text).toContain("Mennyiség");
    expect(texts.at(-1)).toContain("Tétel 120");
  });

  it("renders Markdown links as clickable annotations", async () => {
    const { doc } = await render("# Cím\n\nLátogass el a [példa oldalra](https://pelda.hu)!\n\n- pont\n\n```\nkód\n```", "markdown", "leiras.md");
    const annots = doc.getPage(0).node.lookup(PDFName.of("Annots"), PDFArray);
    const link = annots.lookup(0, PDFDict);
    const action = link.lookup(PDFName.of("A"), PDFDict);
    expect(action.get(PDFName.of("URI"))?.toString()).toContain("pelda.hu");
  });
});
