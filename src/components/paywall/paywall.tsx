"use client";

import { Check, CircleCheck, FileText, Lock, ShieldCheck, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LoginForm } from "@/components/account/login-form";
import { LinkText } from "@/components/link-text";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/controls";
import { cn } from "@/lib/utils";
import { INTL_LOCALE, pathFor } from "@/i18n/config";
import { fmt, plural } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { api, ApiError, loadAccount, requestLoginCode, useAccount } from "@/lib/account";
import { releaseResult } from "@/lib/deliver";
import type { OutputFile } from "@/lib/files";
import { clearPending } from "@/lib/pending-result";
import { formatMoney, PLAN } from "@/lib/plan";
import { setPaywall, toast, useApp, type PaywallState } from "@/lib/store";
import { StripeCheckout, stripeConfigured, type Prices } from "./stripe-checkout";

/** The payment page shown instead of the download when there is no active subscription. */
export default function Paywall() {
  const paywall = useApp((state) => state.paywall);
  if (!paywall) return null;
  return <PaywallScreen key={paywall.expiresAt} paywall={paywall} />;
}

function PaywallScreen({ paywall }: { paywall: PaywallState }) {
  const { ui } = useI18n();
  const text = ui.paywall;
  const { result } = paywall;
  const images = result.files.every((file) => file.blob.type.startsWith("image/"));

  const close = () => {
    setPaywall(null);
    void clearPending();
  };

  // Leaving the page (e.g. to the account page in the header) closes the payment page.
  const pathname = usePathname();
  const openedOn = useRef(pathname);
  useEffect(() => {
    if (pathname !== openedOn.current) setPaywall(null);
  }, [pathname]);

  return (
    <div role="dialog" aria-modal aria-label={text.label} className="fixed inset-x-0 top-14 bottom-0 z-30 overflow-y-auto bg-bg animate-fade-in">
      <Countdown expiresAt={paywall.expiresAt} onExpired={close} />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-8 pb-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:pt-12">
        <section className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-success sm:text-3xl">
              <CircleCheck className="size-8 shrink-0" />
              {images ? text.readyImages : text.readyPdf}
            </h1>
            <Button variant="ghost" size="icon" onClick={close} aria-label={ui.common.close} title={ui.common.close}>
              <X />
            </Button>
          </div>
          <PreviewCard files={result.files} />
        </section>
        <section className="min-w-0">
          <PaymentPanel paywall={paywall} />
        </section>
      </div>
    </div>
  );
}

function Countdown({ expiresAt, onExpired }: { expiresAt: number; onExpired: () => void }) {
  const { ui } = useI18n();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const left = Math.max(0, expiresAt - now);
  useEffect(() => {
    if (left > 0) return;
    toast(ui.paywall.expired, "error");
    onExpired();
  }, [left, onExpired, ui.paywall.expired]);
  const minutes = Math.floor(left / 60_000);
  const seconds = Math.floor((left % 60_000) / 1000);
  return (
    <div className="border-b border-success/20 bg-success-soft">
      <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-5 py-2.5 text-center text-sm text-success">
        <ShieldCheck className="size-4 shrink-0" />
        {ui.paywall.expires}
        <span className="rounded-md bg-success/15 px-2 py-0.5 font-mono font-semibold tabular-nums">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </p>
    </div>
  );
}

function PreviewCard({ files }: { files: OutputFile[] }) {
  const { locale, ui } = useI18n();
  const [first] = files;
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let revoked = false;
    let objectUrl: string | null = null;
    (async () => {
      if (first.blob.type.startsWith("image/")) {
        objectUrl = URL.createObjectURL(first.blob);
      } else {
        const { openDocument, renderPage, canvasToBlob, releaseCanvas, closeDocument } = await import("@/lib/pdf/pdfjs");
        const pdf = await openDocument(new Uint8Array(await first.blob.arrayBuffer()));
        try {
          const page = await pdf.getPage(1);
          const canvas = await renderPage(pdf, 0, 560 / page.getViewport({ scale: 1 }).width);
          objectUrl = URL.createObjectURL(await canvasToBlob(canvas, "image/jpeg", 0.85));
          releaseCanvas(canvas);
        } finally {
          void closeDocument(pdf);
        }
      }
      if (revoked) URL.revokeObjectURL(objectUrl);
      else setUrl(objectUrl);
    })().catch((error) => console.warn("[paywall] preview failed", error));
    return () => {
      revoked = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [first]);

  return (
    <div className="mt-8">
      <div className="relative rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-10">
        <span className="absolute top-4 left-4 rounded-md bg-danger px-2 py-1 text-[11px] font-bold tracking-wide text-white">
          {first.blob.type === "application/pdf" ? "PDF" : first.name.split(".").pop()?.toUpperCase()}
        </span>
        <div className="mx-auto flex aspect-[4/3] max-w-sm items-center justify-center">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview
            <img src={url} alt="" className="max-h-full max-w-full rounded-[3px] bg-white object-contain shadow-page" />
          ) : (
            <div className="grid size-full place-items-center rounded-lg bg-surface-2">
              <FileText className="size-8 text-fg-subtle" />
            </div>
          )}
        </div>
        <p className="mt-5 truncate text-center text-sm font-medium text-fg-muted" title={first.name}>
          {first.name}
        </p>
      </div>
      {files.length > 1 && (
        <p className="mt-3 text-center text-sm text-fg-subtle">{plural(locale, ui.paywall.moreFiles, files.length - 1)}</p>
      )}
    </div>
  );
}

type Step = { kind: "pay" } | { kind: "login"; email: string; codeSent: boolean; note?: string };

function PaymentPanel({ paywall }: { paywall: PaywallState }) {
  const { locale, ui } = useI18n();
  const text = ui.paywall;
  const intl = INTL_LOCALE[locale];
  const accountEmail = useAccount((state) => state.email);
  const [step, setStep] = useState<Step>({ kind: "pay" });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [email, setEmail] = useState(accountEmail ?? "");
  const [emailWarning, setEmailWarning] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentWarning, setConsentWarning] = useState(false);
  const [error, setError] = useState<string | null>(paywall.error ?? null);
  const emailRef = useRef<HTMLInputElement>(null);
  const requested = useRef(false);

  const staticPrices: Prices = { today: formatMoney(PLAN.trialFeeCents, intl), monthly: formatMoney(PLAN.monthlyCents, intl) };
  const days = PLAN.trialDays;
  const describe = (failure: unknown) => (failure instanceof Error ? failure.message : ui.common.unexpected);

  // The payment form shows right away: the Checkout Session is made with the page (once, even under StrictMode).
  useEffect(() => {
    if (requested.current || !stripeConfigured()) return;
    requested.current = true;
    api<{ clientSecret: string }>("/api/checkout", { body: { locale, returnPath: window.location.pathname } })
      .then((session) => setClientSecret(session.clientSecret))
      .catch((failure) => setError(failure instanceof Error ? failure.message : ui.common.unexpected));
  }, [locale, ui.common.unexpected]);

  const checkEmail = async (address: string) => {
    setError(null);
    try {
      await api("/api/checkout/email", { body: { email: address, locale } });
      return true;
    } catch (failure) {
      if (failure instanceof ApiError && failure.code === "alreadySubscribed") {
        // Already paying with this address: sign in instead of paying twice.
        await requestLoginCode(address, locale).catch(() => undefined);
        setStep({ kind: "login", email: address, codeSent: true, note: failure.message });
      } else {
        setError(describe(failure));
      }
      return false;
    }
  };

  const emailMissing = () => {
    setEmailWarning(true);
    emailRef.current?.focus();
  };

  const unlocked = async () => {
    const account = await loadAccount().catch(() => null);
    if (account?.access?.active) {
      toast(text.success, "success");
      await releaseResult(paywall);
    }
  };

  const paid = async (sessionId: string) => {
    try {
      await api("/api/checkout/complete", { body: { sessionId, locale } });
      await unlocked();
    } catch (failure) {
      setError(describe(failure));
    }
  };

  const priceRow = (prices: Prices) => (
    <div className="flex items-baseline justify-between gap-4 border-y border-border py-5">
      <span className="font-semibold">{text.priceLabel}</span>
      <span className="text-3xl font-bold tracking-tight tabular-nums">{prices.today}</span>
    </div>
  );

  const header = (prices: Prices) => (
    <>
      {priceRow(prices)}
      <label className="block space-y-1.5 pt-3">
        <span className="text-sm font-medium">{text.email}</span>
        <input
          ref={emailRef}
          type="email"
          autoComplete="email"
          placeholder={text.emailPlaceholder}
          value={email}
          aria-invalid={emailWarning}
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailWarning(false);
          }}
          className={cn(
            "h-12 w-full rounded-xl bg-surface px-4 text-[15px] ring-1 ring-border-strong ring-inset outline-none placeholder:text-fg-subtle focus:ring-2 focus:ring-primary",
            emailWarning && "ring-danger/60",
          )}
        />
        <span className={cn("block text-xs", emailWarning ? "text-danger" : "text-fg-subtle")}>{emailWarning ? text.emailInvalid : text.emailHint}</span>
      </label>
      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-xl p-3 text-sm leading-relaxed ring-1 ring-inset",
          consentWarning && !consent ? "bg-danger-soft ring-danger/40" : "bg-surface ring-border",
        )}
      >
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => {
            setConsent(event.target.checked);
            setConsentWarning(false);
          }}
          className="mt-0.5 size-4 shrink-0 accent-primary"
        />
        <span>
          <LinkText
            text={fmt(text.consent, { termsPath: pathFor("terms", locale), privacyPath: pathFor("privacy", locale) })}
            className="font-medium text-primary underline underline-offset-2"
            newTab
          />
        </span>
      </label>
      {consentWarning && !consent && <p className="text-sm text-danger">{text.consentNeeded}</p>}
      <p className="pt-2 text-xs font-semibold tracking-wider text-fg-subtle uppercase">{text.methods}</p>
    </>
  );

  const renewal = fmt(text.renewal, {
    days,
    next: days + 1,
    monthly: staticPrices.monthly ?? "",
    accountPath: pathFor("account", locale),
    termsPath: pathFor("terms", locale),
    privacyPath: pathFor("privacy", locale),
  });

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{text.title}</h2>
      <p className="mt-5 text-sm text-fg-muted">
        <span className="font-semibold text-fg">{text.includes}</span>
      </p>
      <ul className="mt-3 space-y-2.5">
        {text.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-[15px]">
            <Check className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={3} />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {!stripeConfigured() ? (
          <>
            {priceRow(staticPrices)}
            <p className="mt-6 rounded-xl bg-danger-soft p-4 text-sm text-danger">{text.notConfigured}</p>
          </>
        ) : (
          <>
            {/* Stays mounted while signing in, so "Back to payment" returns to the same checkout. */}
            <div hidden={step.kind !== "pay"}>
              {clientSecret ? (
                <StripeCheckout
                  clientSecret={clientSecret}
                  consent={consent}
                  onConsentMissing={() => setConsentWarning(true)}
                  email={email}
                  onEmailMissing={emailMissing}
                  checkEmail={checkEmail}
                  onPaid={(sessionId) => void paid(sessionId)}
                  renderPrices={header}
                />
              ) : (
                <>
                  {priceRow(staticPrices)}
                  {!error && (
                    <p className="flex items-center gap-2 py-6 text-sm text-fg-muted">
                      <Spinner /> {text.loading}
                    </p>
                  )}
                </>
              )}
              <p className="mt-4 text-center text-sm text-fg-muted">
                {text.haveAccount}{" "}
                <button type="button" className="font-medium text-primary hover:underline" onClick={() => setStep({ kind: "login", email: email.trim(), codeSent: false })}>
                  {text.login}
                </button>
              </p>
            </div>

            {step.kind === "login" && (
              <>
                {priceRow(staticPrices)}
                <div className="mt-6 space-y-3">
                  {step.note && <p className="rounded-xl bg-primary-soft p-3 text-sm text-primary-soft-fg">{step.note}</p>}
                  <LoginForm initialEmail={step.email} codeSent={step.codeSent} onSuccess={() => void unlocked()} />
                  <button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => setStep({ kind: "pay" })}>
                    {text.backToPay}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-border pt-5 text-xs text-fg-subtle">
        <span className="flex items-center gap-1.5">
          <Lock className="size-3.5" /> {text.ssl}
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5" /> {text.stripe}
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="size-3.5" /> {text.cancelAnytime}
        </span>
      </div>
      <p className="mt-5 rounded-2xl border border-border bg-surface p-4 text-xs leading-relaxed text-fg-muted">
        <LinkText text={renewal} newTab />
      </p>
    </div>
  );
}
