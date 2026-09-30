import { Check, Combine, FileCheck2, FileText, Images, LayoutGrid, MousePointerClick, RotateCw, Shrink, Upload } from "lucide-react";
import { INTL_LOCALE, type Locale } from "@/i18n/config";
import { SITE } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { priceVars } from "@/lib/plan";
import { Backdrop, FeatureGrid, Faq, Footer, Hero, Privacy, SectionHeading, Steps } from "./sections";
import { ConverterDropzone } from "./tool-dropzones";

const FORMATS = ["JPG", "PNG", "HEIC", "WebP", "TIFF", "GIF", "BMP", "AVIF", "SVG", "Word", "Excel", "PowerPoint", "TXT", "CSV", "Markdown", "JSON", "PDF"];

// Icons in the order of the dictionary's features and steps.
const FEATURE_ICONS = [<Images key="images" />, <RotateCw key="rotate" />, <FileText key="text" />, <Combine key="combine" />, <LayoutGrid key="layout" />, <Shrink key="shrink" />];
const STEP_ICONS = [<Upload key="upload" />, <MousePointerClick key="arrange" />, <FileCheck2 key="download" />];

export function ConverterLanding({ locale }: { locale: Locale }) {
  const { converter: text, sections } = SITE[locale];
  const prices = priceVars(INTL_LOCALE[locale]);
  const withPrices = (value: string) => fmt(value, prices);

  return (
    <div className="relative overflow-x-clip">
      <Backdrop />
      <Hero title={text.title} accent={text.accent} text={withPrices(text.text)} badge={text.badge}>
        <ConverterDropzone />
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-1.5" aria-label={text.formatsLabel}>
          {FORMATS.map((format) => (
            <li key={format} className="rounded-full border border-border bg-surface/80 px-2.5 py-0.5 text-xs font-medium text-fg-muted">
              {format}
            </li>
          ))}
        </ul>
      </Hero>

      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow={text.featuresEyebrow} title={text.featuresTitle} text={text.featuresText} />
        <FeatureGrid features={text.features.map((feature, index) => ({ ...feature, icon: FEATURE_ICONS[index] }))} />
      </section>

      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow={text.stepsEyebrow} title={text.stepsTitle} />
        <Steps steps={text.steps.map((step, index) => ({ ...step, text: withPrices(step.text), icon: STEP_ICONS[index] }))} />
      </section>

      <section id="ar" className="relative mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
        <SectionHeading eyebrow={text.pricingEyebrow} title={text.pricingTitle} text={text.pricingText} />
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-fg-muted">{withPrices(text.pricingTrial)}</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight">{prices.trial}</p>
          <p className="mt-2 text-sm text-fg-muted">{withPrices(text.pricingThen)}</p>
          <ul className="mt-6 space-y-2.5 text-left text-[15px]">
            {text.pricingPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={3} />
                {point}
              </li>
            ))}
          </ul>
          <a
            href="#start"
            className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-5 text-[15px] font-medium text-primary-fg shadow-sm shadow-primary/25 transition-colors hover:bg-primary-hover"
          >
            {text.pricingCta}
          </a>
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <Privacy locale={locale} />
      </section>

      <section id="gyik" className="relative mx-auto max-w-3xl scroll-mt-20 px-5 py-16">
        <Faq title={sections.faqTitle} items={text.faq.map((item) => ({ q: item.q, a: withPrices(item.a) }))} />
      </section>

      <Footer locale={locale} />
    </div>
  );
}
