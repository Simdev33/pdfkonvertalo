/**
 * The active language for code outside React (toasts, error messages of the
 * conversion pipeline). The I18nProvider fills it in the browser only, so
 * server rendering never depends on it; components use useI18n() instead.
 */
import type { Locale } from "./config";
import type { UiDict } from "./ui/hu";

let state: { locale: Locale; ui: UiDict } | null = null;

export function setRuntimeLocale(locale: Locale, ui: UiDict) {
  state = { locale, ui };
}

export function t(): UiDict {
  if (!state) throw new Error("i18n runtime is not initialised");
  return state.ui;
}

export function runtimeLocale(): Locale {
  return state?.locale ?? "hu";
}
