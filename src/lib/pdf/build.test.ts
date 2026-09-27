import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFRef,
  PDFString,
  StandardFonts,
  degrees,
  type PDFPage,
} from "@cantoo/pdf-lib";
import { inflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { addRasterPage, copyPages, createOutput, drawImage, embedPixels, loadSource, pruneDeadLinks, rotatePage, saveOutput } from "./build";

const Annots = PDFName.of("Annots");
const meta = { title: "Teszt", producer: "PDF Cutter" };

async function makeSource(pageCount = 5) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([300, 400]);
    page.drawText(`PAGE ${i}`, { x: 40, y: 200, size: 24, font });
  }
  return doc;
}

function addLink(doc: PDFDocument, page: PDFPage, target: Record<string, unknown>) {
  const link = doc.context.register(
    doc.context.obj({ Type: "Annot", Subtype: "Link", Rect: [0, 0, 50, 50], Border: [0, 0, 0], ...target }),
  );
  const existing = page.node.lookup(Annots);
  if (existing instanceof PDFArray) existing.push(link);
  else page.node.set(Annots, doc.context.obj([link]));
}

function links(page: PDFPage) {
  const annots = page.node.lookup(Annots);
  if (!(annots instanceof PDFArray)) return [];
  return annots.asArray().map((ref) => page.doc.context.lookup(ref) as PDFDict);
}

function countPageObjects(doc: PDFDocument) {
  let count = 0;
  for (const [, object] of doc.context.enumerateIndirectObjects()) {
    if (object instanceof PDFDict && object.get(PDFName.of("Type")) === PDFName.of("Page")) count++;
  }
  return count;
}

async function reload(bytes: Uint8Array) {
  return PDFDocument.load(bytes);
}

describe("copyPages", () => {
  async function linkedSource() {
    const src = await makeSource(5);
    const pages = src.getPages();
    addLink(src, pages[0], { Dest: [pages[3].ref, "Fit"] }); // p1 → p4
    addLink(src, pages[1], { Dest: PDFString.of("chapter-3") }); // p2 → named p3
    addLink(src, pages[2], { Dest: [pages[3].ref, "Fit"] }); // p3 → p4
    addLink(src, pages[2], { A: { S: "URI", URI: PDFString.of("https://example.com") } });
    src.catalog.set(
      PDFName.of("Names"),
      src.context.obj({ Dests: src.context.obj({ Names: [PDFString.of("chapter-3"), [pages[2].ref, "Fit"]] }) }),
    );
    // Round-trip so the source behaves exactly like a parsed file.
    return loadSource(await src.save());
  }

  it("keeps links between copied pages pointing at the copies", async () => {
    const src = await linkedSource();
    const out = await createOutput(src, meta);
    copyPages(src, out, [1, 2, 3]).forEach((page) => out.addPage(page));
    pruneDeadLinks(out);
    const doc = await reload(await saveOutput(out));
    const [p2, p3, p4] = doc.getPages();

    // p2's named destination was resolved to an explicit one targeting p3.
    const namedLink = links(p2)[0];
    expect((namedLink.lookup(PDFName.of("Dest")) as PDFArray).get(0)).toBe(p3.ref);
    // p3 → p4 survives and targets the page in the page tree.
    const [toP4, uri] = links(p3);
    expect((toP4.lookup(PDFName.of("Dest")) as PDFArray).get(0)).toBe(p4.ref);
    expect(uri.lookup(PDFName.of("A"))).toBeInstanceOf(PDFDict);
    expect(countPageObjects(doc)).toBe(3);
  });

  it("drops links to pages that were not copied and does not drag them along", async () => {
    const src = await linkedSource();
    const out = await createOutput(src, meta);
    copyPages(src, out, [0, 1]).forEach((page) => out.addPage(page));
    pruneDeadLinks(out);
    const doc = await reload(await saveOutput(out));
    expect(doc.getPageCount()).toBe(2);
    expect(links(doc.getPage(0))).toHaveLength(0);
    expect(links(doc.getPage(1))).toHaveLength(0);
    expect(countPageObjects(doc)).toBe(2);

    // Sanity check: the stock implementation would have copied page 4 as an orphan.
    const naive = await PDFDocument.create();
    (await naive.copyPages(src, [0])).forEach((page) => naive.addPage(page));
    expect(countPageObjects(naive)).toBeGreaterThan(1);
  });
});

describe("loadSource", () => {
  it("decrypts owner-password protected files", async () => {
    const src = await makeSource(2);
    src.encrypt({ ownerPassword: "owner", userPassword: "", permissions: { modifying: false } });
    const loaded = await loadSource(await src.save());
    const out = await createOutput(loaded, meta);
    copyPages(loaded, out, [1]).forEach((page) => out.addPage(page));
    const bytes = await saveOutput(out);
    expect(Buffer.from(bytes).toString("latin1")).not.toContain("/Encrypt");
    expect((await reload(bytes)).getPageCount()).toBe(1);
  });

  it("asks for the password of user-password protected files", async () => {
    const src = await makeSource(1);
    src.encrypt({ ownerPassword: "owner", userPassword: "titok" });
    const bytes = await src.save();
    await expect(loadSource(bytes)).rejects.toThrow();
    await expect(loadSource(bytes, { password: "rossz" })).rejects.toThrow();
    expect((await loadSource(bytes, { password: "titok" })).getPageCount()).toBe(1);
  });
});

describe("rotatePage", () => {
  it("adds to the existing rotation", async () => {
    const doc = await makeSource(1);
    const page = doc.getPage(0);
    page.setRotation(degrees(270));
    rotatePage(page, 180);
    expect(page.getRotation().angle).toBe(90);
    rotatePage(page, -90);
    expect(page.getRotation().angle).toBe(0);
  });
});

describe("drawImage", () => {
  it("draws with the given matrix and an optional clip", async () => {
    const out = await createOutput(null, meta);
    const page = out.addPage([100, 100]);
    const image = embedPixels(out, { data: new Uint8ClampedArray([0, 0, 0, 255]), width: 1, height: 1 });
    drawImage(page, image, [0, -50, 80, 0, 10, 60], { x: 10, y: 10, width: 80, height: 50 });
    const bytes = await saveOutput(out);
    const doc = await reload(bytes);
    const contents = doc.getPage(0).node.Contents()!;
    const stream = (contents instanceof PDFArray ? doc.context.lookup(contents.get(0)) : contents) as unknown as { getContents(): Uint8Array };
    const ops = new TextDecoder().decode(inflateSync(stream.getContents()));
    expect(ops).toMatch(/10 10 80 50 re\s+W\s+n/);
    expect(ops).toMatch(/0 -50 80 0 10 60 cm/);
  });
});

describe("addRasterPage", () => {
  function image(width: number, height: number, colour: boolean) {
    const data = new Uint8ClampedArray(width * height * 4).fill(255);
    data.set(colour ? [255, 0, 0, 255] : [0, 0, 0, 255], 0);
    return { data, width, height };
  }

  it("stores greyscale content as DeviceGray and colour as DeviceRGB", async () => {
    const out = await createOutput(null, meta);
    addRasterPage(out, image(4, 3, false), 40, 30);
    addRasterPage(out, image(4, 3, true), 40, 30);
    const doc = await reload(await saveOutput(out));
    const spaces = doc.getPages().map((page) => {
      const xobjects = (page.node.Resources()!.lookup(PDFName.of("XObject")) as PDFDict).values();
      const img = doc.context.lookup(xobjects[0] as PDFRef) as unknown as { dict: PDFDict };
      return img.dict.get(PDFName.of("ColorSpace"));
    });
    expect(spaces).toEqual([PDFName.of("DeviceGray"), PDFName.of("DeviceRGB")]);
    expect(doc.getPage(0).getSize()).toEqual({ width: 40, height: 30 });
  });
});
