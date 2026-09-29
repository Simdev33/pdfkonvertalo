import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { rootMetadata, SiteShell, VIEWPORT } from "@/components/site-shell";
import { isLocale, PREFIXED_LOCALES } from "@/i18n/config";

// Every language except Hungarian (which lives at the root, see app/(hu)).
export const dynamicParams = false;
export const viewport = VIEWPORT;

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((lang) => ({ lang }));
}

type Props = { children: ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? rootMetadata(lang) : {};
}

export default async function LocalizedLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === "hu") notFound();
  return <SiteShell locale={lang}>{children}</SiteShell>;
}
