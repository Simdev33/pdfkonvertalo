import type { MetadataRoute } from "next";
import { alternatesFor, LOCALES, pathFor, type PageId } from "@/i18n/config";
import { site } from "@/lib/site";

const PAGES: { page: PageId; priority: number }[] = [
  { page: "converter", priority: 1 },
  { page: "pdfToImage", priority: 0.8 },
  { page: "terms", priority: 0.2 },
  { page: "privacy", priority: 0.2 },
];

const absolute = (path: string) => new URL(path, site.url).toString();

/** Every page in every language, each listing its translations (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ page, priority }) => {
    const languages = Object.fromEntries(Object.entries(alternatesFor(page)).map(([lang, path]) => [lang, absolute(path)]));
    return LOCALES.map((locale) => ({ url: absolute(pathFor(page, locale)), priority, alternates: { languages } }));
  });
}
