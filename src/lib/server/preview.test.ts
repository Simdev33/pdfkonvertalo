import { PDFDocument } from "@cantoo/pdf-lib";
import { describe, expect, it } from "vitest";
import { firstPage } from "./preview";

describe("firstPage", () => {
  it("keeps only the first page and reports the full length", async () => {
    const doc = await PDFDocument.create();
    doc.addPage([300, 400]);
    doc.addPage([500, 500]);
    doc.addPage([500, 500]);
    const { bytes, pages } = await firstPage(await doc.save());

    expect(pages).toBe(3);
    const preview = await PDFDocument.load(bytes);
    expect(preview.getPageCount()).toBe(1);
    expect(preview.getPage(0).getSize()).toEqual({ width: 300, height: 400 });
  });
});
