import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContent, pageMetadata } from "@/components/pages";
import { isLocale } from "@/i18n/config";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "converter") : {};
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <PageContent locale={lang} page="converter" />;
}
