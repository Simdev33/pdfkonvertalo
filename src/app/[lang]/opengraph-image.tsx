import { OG_SIZE, renderOgImage } from "@/components/og-image";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return renderOgImage(isLocale(lang) ? lang : DEFAULT_LOCALE);
}
