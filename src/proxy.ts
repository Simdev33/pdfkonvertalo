/**
 * First visit of "/" (English, the main language): send the visitor to the
 * language their browser asks for, if we have it. Runs only when no language
 * was chosen yet (see LOCALE_COOKIE), so a choice in the switcher always wins,
 * and never for crawlers without Accept-Language, which keep the English root.
 *
 * English has no prefix, so a typed "/en/…" goes to "/…" and counts as a choice.
 */
import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, pathFor, type Locale } from "@/i18n/config";

/** The best supported language of an Accept-Language header, e.g. "hu-HU,hu;q=0.9,en;q=0.8" → "hu". */
export function preferredLocale(header: string | null): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = Number(params.find((param) => param.trim().startsWith("q="))?.trim().slice(2) ?? 1);
      return { language: tag.trim().toLowerCase().split("-")[0], q: Number.isFinite(q) ? q : 0, index };
    })
    .filter((entry) => entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  return ranked.map((entry) => entry.language).find(isLocale) ?? null;
}

const PREFIX = `/${DEFAULT_LOCALE}`;

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.pathname === PREFIX || url.pathname.startsWith(`${PREFIX}/`)) {
    url.pathname = url.pathname.slice(PREFIX.length) || "/";
    const response = NextResponse.redirect(url, 308);
    response.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, { path: "/", maxAge: 31536000, sameSite: "lax" });
    return response;
  }

  const locale = preferredLocale(request.headers.get("accept-language"));
  if (!locale || locale === DEFAULT_LOCALE) return NextResponse.next();
  url.pathname = pathFor("converter", locale);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [{ source: "/", missing: [{ type: "cookie", key: "pk_lang" }] }, "/en", "/en/:path*"],
};
