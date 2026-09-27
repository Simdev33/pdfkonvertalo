import { ChevronDown, Cpu, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

export function Backdrop() {
  return (
    <>
      <div className="bg-grid-dots pointer-events-none absolute inset-x-0 top-0 h-[640px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="pointer-events-none absolute top-[-180px] left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
    </>
  );
}

export function Hero({
  title,
  accent,
  text,
  badge = "Feltöltés nélkül · 100%-ban a böngésződben",
  children,
}: {
  title: ReactNode;
  accent: ReactNode;
  text: ReactNode;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <section className="relative mx-auto max-w-3xl px-5 pt-14 pb-16 text-center sm:pt-20">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-fg-muted shadow-sm backdrop-blur">
        <ShieldCheck className="size-3.5 text-success" />
        {badge}
      </div>
      <h1 className="text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-6xl">
        {title}
        <br />
        <span className="bg-linear-to-r from-primary via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">{accent}</span>
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">{text}</p>
      <div className="mt-10 text-left">{children}</div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-sm font-medium text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance">{title}</h2>
      {text && <p className="mt-3 text-fg-muted">{text}</p>}
    </div>
  );
}

export function FeatureGrid({ features }: { features: { icon: ReactNode; title: string; text: string }[] }) {
  return (
    <div className={features.length === 4 ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
      {features.map((feature) => (
        <article key={feature.title} className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary [&_svg]:size-5">{feature.icon}</span>
          <h3 className="mt-4 font-semibold tracking-tight">{feature.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{feature.text}</p>
        </article>
      ))}
    </div>
  );
}

export function Steps({ steps }: { steps: { icon: ReactNode; title: string; text: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step, index) => (
        <div key={step.title} className="relative rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary [&_svg]:size-4">{step.icon}</span>
            <span className="font-mono text-xs text-fg-subtle">0{index + 1}</span>
          </div>
          <h3 className="mt-4 font-semibold">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{step.text}</p>
        </div>
      ))}
    </div>
  );
}

export function Privacy() {
  return (
    <div className="grid items-center gap-10 overflow-hidden rounded-3xl border border-border bg-surface p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <span className="grid size-10 place-items-center rounded-xl bg-success-soft text-success">
          <ShieldCheck className="size-5" />
        </span>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance">A fájljaid nálad maradnak</h2>
        <p className="mt-3 leading-relaxed text-fg-muted">
          Személyi igazolvány, bérpapír, szerződés, családi fotók: ezeket nem kellene idegen szerverekre feltölteni. A {site.name} a
          képeket, szöveges fájlokat és PDF-eket a saját eszközödön alakítja át, ezért gyors, és akkor is biztonságos, ha bizalmas anyaggal
          dolgozol. Egyedül a Word-, Excel- és PowerPoint-fájlokhoz kell a szerver: azokat egy irodai program alakítja PDF-fé, majd azonnal
          törlődnek.
        </p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {[
          { value: "0 bájt", label: "feltöltés képeknél és PDF-eknél" },
          { value: "Azonnal", label: "törlődik az Office-fájl a szerverről" },
          { value: "Nincs", label: "regisztráció és vízjel" },
          { value: "pdf.js", label: "a Mozilla megjelenítőmotorja" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-surface-2 p-5">
            <dt className="text-xs text-fg-muted">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <>
      <h2 className="text-center text-3xl font-semibold tracking-tight">Gyakori kérdések</h2>
      <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-surface">
        {items.map((item) => (
          <details key={item.q} className="group px-6 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-4 py-1 font-medium">
              {item.q}
              <ChevronDown className="size-4 shrink-0 text-fg-subtle transition-transform group-open:rotate-180" />
            </summary>
            <p className="pt-2 pb-1 text-sm leading-relaxed text-fg-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-fg-subtle sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="flex items-center gap-1.5">
          <Cpu className="size-3.5" /> Az Office-fájlok kivételével minden a böngésződben fut.
        </p>
      </div>
    </footer>
  );
}
