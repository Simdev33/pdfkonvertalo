/**
 * The <html> document shared by the two root layouts: app/(hu) for the
 * Hungarian pages at the site root and app/[lang] for the other languages.
 */
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { AppOverlays } from "@/components/app-overlays";
import { Header } from "@/components/header";
import { ThemeSync } from "@/components/theme-toggle";
import { INTL_LOCALE, LOCALES, OG_LOCALE, type Locale } from "@/i18n/config";
import { SITE, UI } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { priceVars } from "@/lib/plan";
import { I18nProvider } from "@/i18n/provider";
import { site } from "@/lib/site";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export function rootMetadata(locale: Locale): Metadata {
  const meta = SITE[locale].meta;
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} – ${meta.tagline}`, template: `%s · ${site.name}` },
    description: fmt(meta.description, priceVars(INTL_LOCALE[locale])),
    applicationName: site.name,
    keywords: meta.keywords,
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
  };
}

/** Open Graph data of one page (page metadata replaces the layout's openGraph as a whole). */
export function openGraph(locale: Locale, url: string, title: string, description: string): Metadata["openGraph"] {
  return {
    type: "website",
    url,
    title,
    description,
    siteName: site.name,
    locale: OG_LOCALE[locale],
    alternateLocale: LOCALES.filter((other) => other !== locale).map((other) => OG_LOCALE[other]),
  };
}

export const VIEWPORT: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c10" },
  ],
  colorScheme: "light dark",
};

// Applies the saved (or system) theme before first paint to avoid a flash.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- this is the root layout's document, rendered by app/(hu) and app/[lang] */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full font-sans">
        <I18nProvider locale={locale} ui={UI[locale]}>
          <ThemeSync />
          <Header />
          {children}
          <AppOverlays />
        </I18nProvider>
      </body>
    </html>
  );
}
