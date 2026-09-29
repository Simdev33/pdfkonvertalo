import type { ReactNode } from "react";
import { rootMetadata, SiteShell, VIEWPORT } from "@/components/site-shell";

// Hungarian lives at the site root; its folder names are the SLUGS.hu values of @/i18n/config.
export const metadata = rootMetadata("hu");
export const viewport = VIEWPORT;

export default function HungarianLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="hu">{children}</SiteShell>;
}
