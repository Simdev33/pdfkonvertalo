import type { ReactNode } from "react";
import { rootMetadata, SiteShell, VIEWPORT } from "@/components/site-shell";

// English lives at the site root; its folder names are the SLUGS.en values of @/i18n/config.
export const metadata = rootMetadata("en");
export const viewport = VIEWPORT;

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
