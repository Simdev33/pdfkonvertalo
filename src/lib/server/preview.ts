import { PDFDocument } from "@cantoo/pdf-lib";

/** The first page of a PDF on its own, and how many pages the whole document has. */
export async function firstPage(pdf: Uint8Array): Promise<{ bytes: Uint8Array; pages: number }> {
  const source = await PDFDocument.load(pdf, { updateMetadata: false });
  const preview = await PDFDocument.create({ updateMetadata: false });
  const [page] = await preview.copyPages(source, [0]);
  preview.addPage(page);
  return { bytes: await preview.save(), pages: source.getPageCount() };
}
