import { unzipSync } from "fflate";
import { crc32 } from "node:zlib";
import { describe, expect, it } from "vitest";
import { baseNameOf, createZip, dedupeNames, sanitizeFileName, withJpegDpi, withPngDpi } from "./files";

// 1×1 white PNG as produced by canvas.toBlob().
const PNG = Uint8Array.from(
  atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4//8/AAX+Av4N70a4AAAAAElFTkSuQmCC"),
  (c) => c.charCodeAt(0),
);

describe("file names", () => {
  it("strips extension and unsafe characters", () => {
    expect(baseNameOf("Szerződés: 2026/03.PDF")).toBe("Szerződés_ 2026_03");
    expect(sanitizeFileName("  a  b.  ")).toBe("a b");
    expect(baseNameOf(".pdf")).toBe("dokumentum");
    expect(baseNameOf("IMG_0042.HEIC")).toBe("IMG_0042");
    expect(baseNameOf("jegyzet.v2.md")).toBe("jegyzet.v2");
    expect(baseNameOf("readme")).toBe("readme");
  });

  it("dedupes case-insensitively", () => {
    const names = dedupeNames([{ name: "a.pdf" }, { name: "A.pdf" }, { name: "b" }, { name: "b" }]).map((f) => f.name);
    expect(names).toEqual(["a.pdf", "A (2).pdf", "b", "b (2)"]);
  });
});

describe("withPngDpi", () => {
  it("inserts a valid pHYs chunk right after IHDR", () => {
    const out = withPngDpi(PNG, 300);
    expect(out.length).toBe(PNG.length + 21);
    const view = new DataView(out.buffer);
    expect(String.fromCharCode(...out.subarray(37, 41))).toBe("pHYs");
    expect(view.getUint32(41)).toBe(11811); // 300 dpi in pixels per metre
    expect(view.getUint32(50)).toBe(crc32(out.subarray(37, 50)));
    // Idempotent.
    expect(withPngDpi(out, 600)).toBe(out);
  });
});

describe("createZip", () => {
  it("stores files with unique names", async () => {
    const zip = await createZip([
      { name: "rész.pdf", blob: new Blob(["one"]) },
      { name: "rész.pdf", blob: new Blob(["two"]) },
    ]);
    const entries = unzipSync(new Uint8Array(await zip.arrayBuffer()));
    expect(Object.keys(entries)).toEqual(["rész.pdf", "rész (2).pdf"]);
    expect(new TextDecoder().decode(entries["rész (2).pdf"])).toBe("two");
  });
});

describe("withJpegDpi", () => {
  it("patches the JFIF density", () => {
    const jfif = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0xff, 0xd9]);
    const out = withJpegDpi(jfif, 300);
    expect([out[13], (out[14] << 8) | out[15], (out[16] << 8) | out[17]]).toEqual([1, 300, 300]);
    expect(jfif[13]).toBe(0); // input untouched
    expect(withJpegDpi(Uint8Array.from([1, 2, 3]), 300)).toEqual(Uint8Array.from([1, 2, 3]));
  });
});
