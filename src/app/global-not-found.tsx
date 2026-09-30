import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// Unmatched URLs have no language, so this page speaks English and Hungarian.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = { title: "404 – PDF Konvertáló" };

const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grid min-h-full place-items-center px-5 font-sans">
        <main className="max-w-md py-20 text-center">
          <p className="font-mono text-sm text-fg-subtle">404</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page could not be found</h1>
          <p className="mt-2 text-fg-muted" lang="hu">
            Ez az oldal nem található.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-[15px] font-medium text-primary-fg transition-colors hover:bg-primary-hover"
            >
              Back to the converter
            </Link>
            <Link
              href="/hu"
              lang="hu"
              className="inline-flex h-11 items-center rounded-xl px-5 text-[15px] font-medium text-fg-muted ring-1 ring-border transition-colors hover:text-fg"
            >
              Vissza a konvertálóhoz
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
