"use client";

import Link from "next/link";
import { LOCALE_NAMES, LOCALES, pathFor, type Locale } from "@/i18n/config";
import { rememberLocale } from "@/i18n/remember";

/** The footer's language list; picking one is remembered like in the header switcher. */
export function LanguageLinks({ locale, label }: { locale: Locale; label: string }) {
  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:justify-start">
      {LOCALES.map((option) => (
        <Link
          key={option}
          href={pathFor("converter", option)}
          hrefLang={option}
          lang={option}
          aria-current={option === locale ? "true" : undefined}
          onClick={() => rememberLocale(option)}
          className={option === locale ? "font-semibold text-fg-muted" : "transition-colors hover:text-fg"}
        >
          {LOCALE_NAMES[option]}
        </Link>
      ))}
    </nav>
  );
}
