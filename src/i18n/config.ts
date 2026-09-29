/**
 * Languages and localized URLs. Hungarian lives at the site root (the
 * original URLs keep working), every other language under its own prefix
 * with translated slugs, e.g. /pdf-bol-kep → /en/pdf-to-image.
 */
export const LOCALES = ["hu", "en", "de", "fr", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "hu";
export const PREFIXED_LOCALES = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

export const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

export const LOCALE_NAMES: Record<Locale, string> = {
  hu: "Magyar",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
};

/** BCP 47 tags for Intl formatting. */
export const INTL_LOCALE: Record<Locale, string> = { hu: "hu-HU", en: "en-US", de: "de-DE", fr: "fr-FR", es: "es-ES" };
export const OG_LOCALE: Record<Locale, string> = { hu: "hu_HU", en: "en_US", de: "de_DE", fr: "fr_FR", es: "es_ES" };

export type PageId = "converter" | "pdfToImage" | "terms" | "privacy";

/** Last URL segment of every page; the converter is the language root. */
export const SLUGS: Record<Exclude<PageId, "converter">, Record<Locale, string>> = {
  pdfToImage: { hu: "pdf-bol-kep", en: "pdf-to-image", de: "pdf-in-bild", fr: "pdf-en-image", es: "pdf-a-imagen" },
  terms: { hu: "aszf", en: "terms", de: "agb", fr: "conditions", es: "terminos" },
  privacy: { hu: "adatvedelem", en: "privacy", de: "datenschutz", fr: "confidentialite", es: "privacidad" },
};

export function pathFor(page: PageId, locale: Locale): string {
  const root = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  if (page === "converter") return root || "/";
  return `${root}/${SLUGS[page][locale]}`;
}

/** Page behind a localized slug, e.g. ("de", "agb") → "terms". */
export function pageForSlug(locale: Locale, slug: string): Exclude<PageId, "converter"> | null {
  for (const [page, slugs] of Object.entries(SLUGS)) {
    if (slugs[locale] === slug) return page as Exclude<PageId, "converter">;
  }
  return null;
}

/** Reverses pathFor(); unknown paths yield null. */
export function parsePath(pathname: string): { locale: Locale; page: PageId } | null {
  const segments = pathname.split("/").filter(Boolean);
  let locale: Locale = DEFAULT_LOCALE;
  if (segments[0] && segments[0] !== DEFAULT_LOCALE && isLocale(segments[0])) locale = segments.shift() as Locale;
  if (segments.length === 0) return { locale, page: "converter" };
  if (segments.length > 1) return null;
  const page = pageForSlug(locale, segments[0]);
  return page ? { locale, page } : null;
}

/** hreflang map for metadata and the sitemap. */
export function alternatesFor(page: PageId) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) languages[locale] = pathFor(page, locale);
  languages["x-default"] = pathFor(page, DEFAULT_LOCALE);
  return languages;
}
