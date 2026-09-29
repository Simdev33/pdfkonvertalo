"use client";

import { createContext, use, useMemo, type ReactNode } from "react";
import type { Locale } from "./config";
import { setRuntimeLocale } from "./runtime";
import type { UiDict } from "./ui/hu";

const I18nContext = createContext<{ locale: Locale; ui: UiDict } | null>(null);

export function I18nProvider({ locale, ui, children }: { locale: Locale; ui: UiDict; children: ReactNode }) {
  if (typeof window !== "undefined") setRuntimeLocale(locale, ui);
  const value = useMemo(() => ({ locale, ui }), [locale, ui]);
  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n() {
  const value = use(I18nContext);
  if (!value) throw new Error("useI18n() needs an <I18nProvider>");
  return value;
}
