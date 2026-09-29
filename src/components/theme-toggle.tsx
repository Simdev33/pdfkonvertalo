"use client";

import { Moon, Sun } from "lucide-react";
import { useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";

/**
 * Switching between languages re-renders the root <html>, which drops the
 * "dark" class set by the inline theme script; this puts it back before paint.
 */
export function ThemeSync() {
  const { locale } = useI18n();
  useLayoutEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("theme");
    } catch {
      // Storage blocked – fall back to the system setting.
    }
    const dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  }, [locale]);
  return null;
}

export function ThemeToggle() {
  const { ui } = useI18n();
  const toggle = () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // Private mode – the choice just won't persist.
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={ui.nav.theme} title={ui.nav.theme}>
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
    </Button>
  );
}
