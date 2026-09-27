import { describe, expect, it } from "vitest";
import { detectFormat, matchesOfficeSignature, sniffFormat } from "./formats";

const bytes = (...parts: (string | number[])[]) =>
  Uint8Array.from(parts.flatMap((part) => (typeof part === "string" ? [...part].map((c) => c.charCodeAt(0)) : part)));
const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

describe("sniffFormat", () => {
  it("recognises common signatures", () => {
    expect(sniffFormat(bytes([0xff, 0xd8, 0xff, 0xe0]))?.format).toBe("jpeg");
    expect(sniffFormat(bytes([0x89], "PNG\r\n\x1a\n"))?.format).toBe("png");
    expect(sniffFormat(bytes("GIF89a"))?.format).toBe("gif");
    expect(sniffFormat(bytes("RIFF", [0, 0, 0, 0], "WEBPVP8 "))?.format).toBe("webp");
    expect(sniffFormat(bytes("II*\0", [8, 0, 0, 0]))?.format).toBe("tiff");
    expect(sniffFormat(bytes("%PDF-1.7\n"))?.kind).toBe("pdf");
    expect(sniffFormat(bytes('<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg">'))?.format).toBe("svg");
  });

  it("tells HEIC and AVIF apart by their brands", () => {
    expect(sniffFormat(bytes([0, 0, 0, 24], "ftypheic", [0, 0, 0, 0], "mif1heic"))?.format).toBe("heic");
    expect(sniffFormat(bytes([0, 0, 0, 24], "ftypavif", [0, 0, 0, 0], "mif1miaf"))?.format).toBe("avif");
    expect(sniffFormat(bytes([0, 0, 0, 28], "ftypmif1", [0, 0, 0, 0], "mif1avifmiaf"))?.format).toBe("avif");
  });
});

describe("detectFormat", () => {
  it("prefers the content over a misleading extension", () => {
    expect(detectFormat("photo.jpg", "image/jpeg", bytes([0x89], "PNG\r\n\x1a\n"))?.format).toBe("png");
  });

  it("falls back to the extension for text formats", () => {
    expect(detectFormat("notes.md", "", bytes("# Hi"))).toMatchObject({ kind: "text", format: "markdown" });
    expect(detectFormat("data.CSV", "text/csv", bytes("a,b"))).toMatchObject({ kind: "text", format: "csv" });
    expect(detectFormat("main.py", "", bytes("print(1)"))).toMatchObject({ kind: "text", format: "code" });
    expect(detectFormat("readme", "text/plain", bytes("hello"))).toMatchObject({ kind: "text", format: "text" });
  });

  it("recognises Word documents by extension or MIME type", () => {
    expect(detectFormat("Szerződés.DOCX", "", bytes("PK\x03\x04"))).toMatchObject({ kind: "office", format: "docx", label: "DOCX" });
    expect(detectFormat("old.doc", "", bytes(OLE))).toMatchObject({ kind: "office", format: "doc" });
    expect(detectFormat("letter.rtf", "text/rtf", bytes("{\\rtf1"))).toMatchObject({ kind: "office", format: "rtf" });
    expect(detectFormat("letter", "text/rtf", bytes("{\\rtf1"))).toMatchObject({ kind: "office", format: "rtf" });
  });

  it("recognises Excel and PowerPoint files", () => {
    expect(detectFormat("Árlista.xlsx", "", bytes("PK\x03\x04"))).toMatchObject({ kind: "office", format: "xlsx", label: "XLSX" });
    expect(detectFormat("régi.xls", "", bytes(OLE))).toMatchObject({ kind: "office", format: "xls" });
    expect(detectFormat("bemutató.pptx", "", bytes("PK\x03\x04"))).toMatchObject({ kind: "office", format: "pptx" });
    expect(detectFormat("vetítés.ppsx", "", bytes("PK\x03\x04"))).toMatchObject({ kind: "office", format: "ppsx" });
    expect(detectFormat("deck", "application/vnd.oasis.opendocument.presentation", bytes("PK\x03\x04"))).toMatchObject({ format: "odp" });
  });

  it("keeps CSV a text table even when Windows calls it an Excel file", () => {
    expect(detectFormat("adatok.csv", "application/vnd.ms-excel", bytes("a;b"))).toMatchObject({ kind: "text", format: "csv" });
  });

  it("rejects unknown binaries", () => {
    expect(detectFormat("archive.zip", "application/zip", bytes("PK\x03\x04"))).toBeNull();
  });
});

describe("matchesOfficeSignature", () => {
  it("accepts real office containers", () => {
    expect(matchesOfficeSignature("docx", bytes("PK\x03\x04"))).toBe(true);
    expect(matchesOfficeSignature("docx", bytes(OLE))).toBe(true); // password protected
    expect(matchesOfficeSignature("odt", bytes("PK\x03\x04"))).toBe(true);
    expect(matchesOfficeSignature("doc", bytes(OLE))).toBe(true);
    expect(matchesOfficeSignature("rtf", bytes("{\\rtf1\\ansi"))).toBe(true);
    expect(matchesOfficeSignature("xlsx", bytes("PK\x03\x04"))).toBe(true);
    expect(matchesOfficeSignature("ppt", bytes(OLE))).toBe(true);
  });

  it("rejects files that only have the extension", () => {
    expect(matchesOfficeSignature("docx", bytes("this is not a docx"))).toBe(false);
    expect(matchesOfficeSignature("doc", bytes("PK\x03\x04"))).toBe(false);
    expect(matchesOfficeSignature("rtf", bytes("{\\rt"))).toBe(false);
    expect(matchesOfficeSignature("ods", bytes(OLE))).toBe(false);
  });
});
