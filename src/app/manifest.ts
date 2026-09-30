import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { SITE } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

/** Name and icons for "Add to Home screen" (icons: npm run icons). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} – ${SITE[DEFAULT_LOCALE].meta.tagline}`,
    short_name: site.name,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
