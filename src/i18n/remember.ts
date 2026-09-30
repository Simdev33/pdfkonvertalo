import { LOCALE_COOKIE, type Locale } from "./config";

/** Remembers a language picked by the visitor, so src/proxy.ts stops redirecting "/". */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
