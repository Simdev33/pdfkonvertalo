import { describe, expect, it } from "vitest";
import { decodeText, detectDelimiter, expandTabs, parseDelimited, parseInline, parseMarkdown, toBlocks } from "./text-model";

describe("CSV", () => {
  it("detects the delimiter", () => {
    expect(detectDelimiter("a;b;c\n1;2;3")).toBe(";");
    expect(detectDelimiter("a,b\n1,2")).toBe(",");
    expect(detectDelimiter("a\tb\n1\t2")).toBe("\t");
  });

  it("handles quotes, escaped quotes and embedded newlines", () => {
    expect(parseDelimited('név,megjegyzés\n"Kiss, Anna","azt mondta: ""szia""\nés ment"\n', ",")).toEqual([
      ["név", "megjegyzés"],
      ["Kiss, Anna", 'azt mondta: "szia"\nés ment'],
    ]);
  });

  it("skips empty lines and a BOM", () => {
    expect(parseDelimited("﻿a;b\r\n\r\n1;2\r\n", ";")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("becomes a table block with a header", () => {
    expect(toBlocks("x,y\n1,2", "csv")).toEqual([{ type: "table", header: ["x", "y"], rows: [["1", "2"]] }]);
  });
});

describe("plain text and code", () => {
  it("keeps every line, including empty ones", () => {
    const blocks = toBlocks("egy\n\nhárom", "text");
    expect(blocks).toHaveLength(3);
    expect(blocks[1]).toEqual({ type: "line", runs: [] });
  });

  it("pretty prints JSON in monospace", () => {
    const blocks = toBlocks('{"a":[1,2]}', "json");
    expect(blocks.map((b) => (b.type === "line" ? b.runs[0].text : ""))).toEqual(["{", '  "a": [', "    1,", "    2", "  ]", "}"]);
    expect(blocks[0]).toMatchObject({ mono: true });
  });

  it("expands tabs to tab stops", () => {
    expect(expandTabs("a\tb\t\tc")).toBe("a   b       c");
  });
});

describe("Markdown", () => {
  it("parses inline styles and links", () => {
    expect(parseInline("Ez **félkövér**, ez *dőlt*, ez `kód`, ez [link](https://pelda.hu).")).toEqual([
      { text: "Ez ", style: "regular" },
      { text: "félkövér", style: "bold" },
      { text: ", ez ", style: "regular" },
      { text: "dőlt", style: "italic" },
      { text: ", ez ", style: "regular" },
      { text: "kód", style: "mono" },
      { text: ", ez ", style: "regular" },
      { text: "link", style: "regular", href: "https://pelda.hu" },
      { text: ".", style: "regular" },
    ]);
  });

  it("does not treat snake_case as emphasis", () => {
    expect(parseInline("a_b_c")).toEqual([{ text: "a_b_c", style: "regular" }]);
  });

  it("parses the common block types", () => {
    const blocks = parseMarkdown(
      [
        "# Cím",
        "",
        "Első sor",
        "folytatás.",
        "",
        "- egy",
        "  - kettő",
        "1. első",
        "",
        "> idézet",
        "",
        "```js",
        "const a = 1;",
        "```",
        "",
        "---",
        "",
        "| A | B |",
        "|---|--:|",
        "| 1 | 2 |",
      ].join("\n"),
    );
    expect(blocks.map((b) => b.type)).toEqual(["heading", "paragraph", "item", "item", "item", "quote", "code", "rule", "table"]);
    expect(blocks[1]).toEqual({ type: "paragraph", runs: [{ text: "Első sor folytatás.", style: "regular" }] });
    expect(blocks[3]).toMatchObject({ marker: "•", depth: 1 });
    expect(blocks[4]).toMatchObject({ marker: "1." });
    expect(blocks[6]).toEqual({ type: "code", lines: ["const a = 1;"] });
    expect(blocks[8]).toEqual({ type: "table", header: ["A", "B"], rows: [["1", "2"]] });
  });
});

describe("decodeText", () => {
  it("reads UTF-8, BOMs and falls back to Windows-1250", () => {
    const utf8 = new TextEncoder().encode("Árvíztűrő");
    expect(decodeText(utf8)).toBe("Árvíztűrő");
    expect(decodeText(Uint8Array.from([0xef, 0xbb, 0xbf, ...utf8]))).toBe("Árvíztűrő");
    expect(decodeText(Uint8Array.from([0xff, 0xfe, 0x51, 0x01]))).toBe("ő");
    // "tűrő" in Windows-1250: t=0x74 ű=0xFB r=0x72 ő=0xF5
    expect(decodeText(Uint8Array.from([0x74, 0xfb, 0x72, 0xf5]))).toBe("tűrő");
  });
});
