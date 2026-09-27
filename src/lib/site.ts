export const site = {
  name: "PDF Konvertáló",
  tagline: "Képek, Office- és szöveges fájlok PDF-be",
  description:
    "Ingyenes, profi PDF konvertáló: JPG, PNG, HEIC, WebP, TIFF, SVG képek, Word-, Excel- és PowerPoint-fájlok, TXT, CSV, Markdown és JSON fájlok PDF-be alakítása, PDF-ek összefűzése és PDF-ből kép készítése. A képek, szövegek és PDF-ek a böngésződben maradnak.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const TOOLS = [
  { href: "/", label: "PDF-be konvertálás", short: "PDF-be" },
  { href: "/pdf-bol-kep", label: "PDF-ből kép", short: "PDF → kép" },
] as const;
