/** Small helpers shared by the JSON API routes. */
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config";
import { SITE } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import type { SiteDict } from "@/i18n/site/hu";

export type ServerMessage = keyof SiteDict["server"];

export const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

/** An error in the visitor's language: { error, code }. */
export const fail = (locale: Locale, code: ServerMessage, status: number, vars: Record<string, string | number> = {}) =>
  json({ error: fmt(SITE[locale].server[code], vars), code }, status);

export async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export const localeOf = (value: unknown): Locale => (typeof value === "string" && isLocale(value) ? value : DEFAULT_LOCALE);

export const text = (value: unknown, max = 500) => (typeof value === "string" ? value.slice(0, max) : "");

/** A same-site path to come back to (never another host). */
export function returnUrl(request: Request, path: unknown) {
  const safe = typeof path === "string" && path.startsWith("/") && !path.startsWith("//") ? path : "/";
  return new URL(safe, new URL(request.url).origin);
}
