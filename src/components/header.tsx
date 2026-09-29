"use client";

import { Check, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type MouseEvent } from "react";
import { Logo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { LOCALE_NAMES, LOCALES, parsePath, pathFor, type PageId } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { closePdfForImages } from "@/lib/pdf-to-image";
import { clearItems, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The tools show their workspace instead of the landing page while files are
 * open, so leaving (home, or another language) closes them after a confirmation.
 */
function leaveWorkspace(event: MouseEvent<HTMLAnchorElement>, question: string) {
  const { items, pdfDoc, job } = useApp.getState();
  if (job) return event.preventDefault();
  if (items.length || pdfDoc) {
    if (!window.confirm(question)) return event.preventDefault();
    clearItems();
    if (pdfDoc) closePdfForImages();
  }
  window.scrollTo({ top: 0 });
}

export function Header() {
  const pathname = usePathname();
  const { locale, ui } = useI18n();
  const current = parsePath(pathname)?.page ?? "converter";
  const tools: { page: PageId; label: string; short: string }[] = [
    { page: "converter", label: ui.nav.converter, short: ui.nav.converterShort },
    { page: "pdfToImage", label: ui.nav.pdfToImage, short: ui.nav.pdfToImageShort },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70">
      <div className="flex h-14 items-center gap-2 px-4 sm:gap-3 sm:px-5">
        <Link
          href={pathFor("converter", locale)}
          onClick={(event) => leaveWorkspace(event, ui.nav.confirmHome)}
          className="shrink-0 rounded-lg"
          aria-label={ui.nav.home}
        >
          <Logo compact />
        </Link>
        <nav aria-label={ui.nav.tools} className="ml-1 flex items-center gap-1 rounded-xl bg-surface-2 p-1 ring-1 ring-border ring-inset sm:ml-4">
          {tools.map((tool) => {
            const active = current === tool.page;
            return (
              <Link
                key={tool.page}
                href={pathFor(tool.page, locale)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[13px] font-medium whitespace-nowrap transition-colors",
                  active ? "bg-surface text-fg shadow-sm ring-1 ring-border dark:bg-surface-3 dark:ring-border-strong" : "text-fg-muted hover:text-fg",
                )}
              >
                <span className="hidden sm:inline">{tool.label}</span>
                <span className="sm:hidden">{tool.short}</span>
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <LanguageMenu page={current} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function LanguageMenu({ page }: { page: PageId }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const { locale, ui } = useI18n();

  // Close when clicking anywhere else.
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (ref.current?.open && !ref.current.contains(event.target as Node)) ref.current.open = false;
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  return (
    <details ref={ref} className="relative [&_summary::-webkit-details-marker]:hidden">
      <summary
        aria-label={`${ui.nav.language}: ${LOCALE_NAMES[locale]}`}
        title={ui.nav.language}
        className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-[13px] font-semibold text-fg-muted uppercase transition-colors hover:bg-surface-2 hover:text-fg [&_svg]:size-4"
      >
        <Globe />
        {locale}
      </summary>
      <ul className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-border bg-surface p-1 shadow-xl animate-pop-in">
        {LOCALES.map((option) => (
          <li key={option}>
            <Link
              href={pathFor(page, option)}
              hrefLang={option}
              lang={option}
              aria-current={option === locale ? "true" : undefined}
              onClick={(event) => {
                if (option !== locale) leaveWorkspace(event, ui.nav.confirmLanguage);
                if (ref.current) ref.current.open = false;
              }}
              className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[13px] hover:bg-surface-2"
            >
              {LOCALE_NAMES[option]}
              {option === locale && <Check className="size-4 text-primary" />}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
