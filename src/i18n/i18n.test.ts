import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LOCALES, parsePath, pathFor, SLUGS, type PageId } from "./config";
import { LEGAL, SITE, UI } from "./dictionaries";
import { plural } from "./format";

const PAGES: PageId[] = ["converter", "pdfToImage", "terms", "privacy"];

describe("localized paths", () => {
  it("round-trip for every page and language", () => {
    for (const locale of LOCALES) {
      for (const page of PAGES) expect(parsePath(pathFor(page, locale))).toEqual({ locale, page });
    }
  });

  it("keeps the original Hungarian URLs at the root", () => {
    expect(pathFor("converter", "hu")).toBe("/");
    expect(pathFor("pdfToImage", "hu")).toBe("/pdf-bol-kep");
    expect(pathFor("terms", "de")).toBe("/de/agb");
    expect(parsePath("/xx/yy")).toBeNull();
  });

  it("has unique slugs per language and a folder for every Hungarian page", () => {
    for (const locale of LOCALES) {
      const slugs = Object.values(SLUGS).map((bySlug) => bySlug[locale]);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
    for (const slug of Object.values(SLUGS).map((bySlug) => bySlug.hu)) {
      expect(existsSync(join(process.cwd(), "src", "app", "(hu)", slug, "page.tsx"))).toBe(true);
    }
  });
});

/** Every string leaf with its path, so dictionaries can be compared shape by shape. */
function leaves(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, index) => leaves(item, `${path}[${index}]`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([key, item]) => leaves(item, path ? `${path}.${key}` : key));
  return [];
}

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
const links = (text: string) => [...text.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]);

describe("translations", () => {
  for (const [name, dictionaries] of [
    ["ui", UI],
    ["site", SITE],
    ["legal", LEGAL],
  ] as const) {
    const source = new Map(leaves(dictionaries.hu));
    for (const locale of LOCALES.filter((other) => other !== "hu")) {
      it(`${name}/${locale} matches the Hungarian keys, placeholders and links`, () => {
        const target = new Map(leaves(dictionaries[locale]));
        expect([...target.keys()]).toEqual([...source.keys()]);
        for (const [path, text] of source) {
          const translated = target.get(path)!;
          expect(translated.trim(), path).not.toBe("");
          expect(placeholders(translated), path).toEqual(placeholders(text));
          expect(links(translated), path).toEqual(links(text));
        }
      });
    }
  }

  it("uses the language's plural rules", () => {
    expect(plural("en", UI.en.files.count, 1)).toBe("1 file");
    expect(plural("en", UI.en.files.count, 3)).toBe("3 files");
    expect(plural("hu", UI.hu.files.count, 3)).toBe("3 fájl");
  });
});
