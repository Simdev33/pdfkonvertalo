import { Gauge, KeyRound, ListChecks, Printer } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { SITE } from "@/i18n/dictionaries";
import { Backdrop, FeatureGrid, Faq, Footer, Hero, Privacy } from "./sections";
import { PdfDropzone } from "./tool-dropzones";

// Icons in the order of the dictionary's features.
const FEATURE_ICONS = [<ListChecks key="pages" />, <Printer key="print" />, <KeyRound key="protected" />, <Gauge key="fast" />];

export function PdfToImageLanding({ locale }: { locale: Locale }) {
  const { pdfToImage: text, sections } = SITE[locale];
  return (
    <div className="relative overflow-x-clip">
      <Backdrop />
      <Hero title={text.title} accent={text.accent} text={text.text} badge={sections.badge} trust={sections.trust}>
        <PdfDropzone />
      </Hero>
      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <FeatureGrid features={text.features.map((feature, index) => ({ ...feature, icon: FEATURE_ICONS[index] }))} />
      </section>
      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <Privacy locale={locale} />
      </section>
      <section className="relative mx-auto max-w-3xl px-5 py-16">
        <Faq title={sections.faqTitle} items={text.faq} />
      </section>
      <Footer locale={locale} />
    </div>
  );
}
