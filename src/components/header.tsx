"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { Logo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { closePdfForImages } from "@/lib/pdf-to-image";
import { TOOLS } from "@/lib/site";
import { clearItems, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * The tools show their workspace instead of the landing page while files are
 * open, so going home also closes them (after a confirmation).
 */
function goHome(event: MouseEvent<HTMLAnchorElement>) {
  const { items, pdfDoc, job } = useApp.getState();
  if (job) return event.preventDefault();
  if (items.length || pdfDoc) {
    if (!window.confirm("Visszatérsz a főoldalra? A megnyitott fájlok bezáródnak.")) return event.preventDefault();
    clearItems();
    if (pdfDoc) closePdfForImages();
  }
  window.scrollTo({ top: 0 });
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-5">
        <Link href="/" onClick={goHome} className="shrink-0 rounded-lg" aria-label="Kezdőlap">
          <Logo />
        </Link>
        <nav aria-label="Eszközök" className="ml-2 flex items-center gap-1 rounded-xl bg-surface-2 p-1 ring-1 ring-border ring-inset sm:ml-4">
          {TOOLS.map((tool) => {
            const active = pathname === tool.href;
            return (
              <Link
                key={tool.href}
                href={tool.href}
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
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
