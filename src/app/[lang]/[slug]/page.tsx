import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContent, pageMetadata } from "@/components/pages";
import { isLocale, pageForSlug, SLUGS, type Locale } from "@/i18n/config";

// Translated slugs, e.g. /de/pdf-in-bild or /fr/confidentialite.
export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  return Object.values(SLUGS).map((slugs) => ({ slug: slugs[params.lang as Locale] }));
}

type Props = { params: Promise<{ lang: string; slug: string }> };

async function resolve(params: Props["params"]) {
  const { lang, slug } = await params;
  const page = isLocale(lang) ? pageForSlug(lang, slug) : null;
  return page && isLocale(lang) ? { locale: lang, page } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await resolve(params);
  return found ? pageMetadata(found.locale, found.page) : {};
}

export default async function Page({ params }: Props) {
  const found = await resolve(params);
  if (!found) notFound();
  return <PageContent locale={found.locale} page={found.page} />;
}
