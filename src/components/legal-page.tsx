import Link from "next/link";
import type { ReactNode } from "react";
import { Footer } from "@/components/landing/sections";
import { INTL_LOCALE, pathFor, type Locale } from "@/i18n/config";
import { LEGAL, SITE } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import type { LegalBlock } from "@/i18n/legal/types";
import { site } from "@/lib/site";

// Marks an operator field that still has to be filled in site.ts.
const MISSING = "\u0000missing\u0000";

const TOKENS = /\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s)]+[^\s).,;:])|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)|\u0000missing\u0000/g;

/** Plain text with [label](/path) links, bare URLs, e-mail addresses and missing-field markers. */
function Inline({ text, missing }: { text: string; missing: string }) {
  const parts: ReactNode[] = [];
  let index = 0;
  for (const match of text.matchAll(TOKENS)) {
    if (match.index > index) parts.push(text.slice(index, match.index));
    const [whole, label, href, url, email] = match;
    const key = match.index;
    if (label !== undefined) {
      parts.push(
        <Link key={key} href={href} className="font-medium text-primary underline-offset-2 hover:underline">
          {label}
        </Link>,
      );
    } else if (url) {
      parts.push(
        <a key={key} href={url} rel="noopener noreferrer" target="_blank" className="text-primary underline-offset-2 hover:underline">
          {url.replace(/^https?:\/\//, "")}
        </a>,
      );
    } else if (email) {
      parts.push(
        <a key={key} href={`mailto:${email}`} className="text-primary underline-offset-2 hover:underline">
          {email}
        </a>,
      );
    } else {
      parts.push(<Missing key={key} label={missing} />);
    }
    index = match.index + whole.length;
  }
  if (index < text.length) parts.push(text.slice(index));
  return <>{parts}</>;
}

function Missing({ label }: { label: string }) {
  return <mark className="rounded bg-warning-soft px-1 font-medium text-warning">{label}</mark>;
}

function Details({ rows, missing }: { rows: [label: string, value: string, required: boolean][]; missing: string }) {
  return (
    <dl className="grid gap-x-6 gap-y-1.5 rounded-2xl border border-border bg-surface p-5 text-sm sm:grid-cols-[max-content_1fr]">
      {rows
        .filter(([, value, required]) => value || required)
        .map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-fg-subtle">{label}</dt>
            <dd className="font-medium break-words">{value ? <Inline text={value} missing={missing} /> : <Missing label={missing} />}</dd>
          </div>
        ))}
    </dl>
  );
}

export function LegalPage({ locale, doc }: { locale: Locale; doc: "terms" | "privacy" }) {
  const legal = LEGAL[locale];
  const chrome = SITE[locale].legal;
  const content = legal[doc];
  const missing = chrome.operatorMissing;
  const { operator, hosting } = site;
  const vars = {
    site: site.name,
    url: site.url,
    operatorEmail: operator.email || MISSING,
    privacyPath: pathFor("privacy", locale),
    termsPath: pathFor("terms", locale),
  };
  const effective = new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "long" }).format(new Date(`${site.legalEffective}T12:00:00Z`));

  const block = (item: LegalBlock, key: number) => {
    if (typeof item === "string") {
      return (
        <p key={key}>
          <Inline text={fmt(item, vars)} missing={missing} />
        </p>
      );
    }
    if ("list" in item) {
      return (
        <ul key={key} className="list-disc space-y-1.5 pl-5 marker:text-fg-subtle">
          {item.list.map((entry) => (
            <li key={entry}>
              <Inline text={fmt(entry, vars)} missing={missing} />
            </li>
          ))}
        </ul>
      );
    }
    if (item.details === "operator") {
      return (
        <Details
          key={key}
          missing={missing}
          rows={[
            [legal.labels.name, operator.name, true],
            [legal.labels.address, operator.address, true],
            [legal.labels.email, operator.email, true],
            [legal.labels.registration, operator.registration, false],
            [legal.labels.taxNumber, operator.taxNumber, false],
          ]}
        />
      );
    }
    return (
      <Details
        key={key}
        missing={missing}
        rows={[
          [legal.labels.name, hosting.name, true],
          [legal.labels.address, hosting.address, true],
          [legal.labels.web, hosting.web, true],
        ]}
      />
    );
  };

  return (
    <div className="relative">
      <article className="mx-auto max-w-3xl px-5 pt-12 pb-20 sm:pt-16">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{content.title}</h1>
        <p className="mt-3 text-sm text-fg-subtle">{fmt(chrome.effective, { date: effective })}</p>
        <p className="mt-6 leading-relaxed text-fg-muted">
          <Inline text={fmt(content.intro, vars)} missing={missing} />
        </p>
        {content.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-lg font-semibold tracking-tight">{section.heading}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-fg-muted">{section.blocks.map(block)}</div>
          </section>
        ))}
      </article>
      <Footer locale={locale} />
    </div>
  );
}
