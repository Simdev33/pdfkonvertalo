/**
 * Page contents and metadata by page id, so the Hungarian routes in app/(hu)
 * and the localized routes in app/[lang] stay thin wrappers.
 */
import type { Metadata } from "next";
import { AccountPage } from "@/components/account/account-page";
import { ConverterApp } from "@/components/converter/converter-app";
import { ConverterLanding } from "@/components/landing/converter-landing";
import { PdfToImageLanding } from "@/components/landing/pdf-to-image-landing";
import { LegalPage } from "@/components/legal-page";
import { PdfToImageApp } from "@/components/pdf-to-image/pdf-to-image-app";
import { openGraph } from "@/components/site-shell";
import { alternatesFor, INTL_LOCALE, pathFor, type Locale, type PageId } from "@/i18n/config";
import { SITE } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { priceVars } from "@/lib/plan";
import { site } from "@/lib/site";

export function pageMetadata(locale: Locale, page: PageId): Metadata {
  const meta = SITE[locale].meta;
  const [title, description] = {
    converter: [`${site.name} – ${meta.tagline}`, fmt(meta.description, priceVars(INTL_LOCALE[locale]))],
    pdfToImage: [meta.pdfToImageTitle, meta.pdfToImageDescription],
    terms: [meta.termsTitle, meta.termsDescription],
    privacy: [meta.privacyTitle, meta.privacyDescription],
    account: [meta.accountTitle, meta.accountDescription],
  }[page];
  const url = pathFor(page, locale);
  return {
    title: page === "converter" ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: alternatesFor(page) },
    openGraph: openGraph(locale, url, page === "converter" ? title : `${title} · ${site.name}`, description),
    ...(page === "account" ? { robots: { index: false } } : {}),
  };
}

export function PageContent({ locale, page }: { locale: Locale; page: PageId }) {
  switch (page) {
    case "converter":
      return <ConverterApp landing={<ConverterLanding locale={locale} />} />;
    case "pdfToImage":
      return <PdfToImageApp landing={<PdfToImageLanding locale={locale} />} />;
    case "account":
      return (
        <main>
          <AccountPage locale={locale} />
        </main>
      );
    default:
      return (
        <main>
          <LegalPage locale={locale} doc={page} />
        </main>
      );
  }
}
