"use client";

import { CheckoutElementsProvider, ExpressCheckoutElement, PaymentElement, useCheckoutElements } from "@stripe/react-stripe-js/checkout";
import { loadStripe, type Appearance, type Stripe, type StripeConstructorOptions, type StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";
import { Lock } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/controls";
import { INTL_LOCALE, type Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

const stripes = new Map<Locale, Promise<Stripe | null>>();

function stripeFor(locale: Locale) {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return null;
  let promise = stripes.get(locale);
  if (!promise) {
    // developerTools: with test keys Stripe.js would pin its "stripe >" helper badge to the corner of every page.
    promise = loadStripe(key, { locale: locale as StripeConstructorOptions["locale"], developerTools: { assistant: { enabled: false } } });
    stripes.set(locale, promise);
  }
  return promise;
}

export const stripeConfigured = () => Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

/** Stripe's iframes cannot read our CSS variables, so the current theme is copied in. */
function appearance(): Appearance {
  const css = getComputedStyle(document.documentElement);
  const token = (name: string) => css.getPropertyValue(name).trim();
  const dark = document.documentElement.classList.contains("dark");
  return {
    theme: dark ? "night" : "stripe",
    variables: {
      colorPrimary: token("--primary"),
      colorBackground: token("--surface"),
      colorText: token("--fg"),
      colorDanger: token("--danger"),
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      borderRadius: "10px",
    },
  };
}

export interface Prices {
  today: string;
  monthly: string | null;
}

/** A format check is enough here – the server and Stripe check the address again. */
export const looksLikeEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

interface CheckoutProps {
  consent: boolean;
  onConsentMissing: () => void;
  /** From the parent's field; the card payment is made with it. */
  email: string;
  onEmailMissing: () => void;
  /** Before paying: false when this address must not pay (already subscribed) or the check failed. */
  checkEmail: (email: string) => Promise<boolean>;
  onPaid: (sessionId: string) => void;
  renderPrices: (prices: Prices) => ReactNode;
}

/**
 * The payment methods of one Checkout Session: express wallet buttons
 * (Apple Pay, Google Pay, PayPal, Link) and the card form, open from the
 * start. `consent` must be given before any of them can be used.
 */
export function StripeCheckout({ clientSecret, ...props }: CheckoutProps & { clientSecret: string }) {
  const { locale } = useI18n();
  const stripe = useMemo(() => stripeFor(locale), [locale]);
  const options = useMemo(() => ({ clientSecret, elementsOptions: { appearance: appearance() } }), [clientSecret]);
  return (
    <CheckoutElementsProvider stripe={stripe} options={options}>
      <PaymentMethods {...props} />
    </CheckoutElementsProvider>
  );
}

function PaymentMethods({ consent, onConsentMissing, email, onEmailMissing, checkEmail, onPaid, renderPrices }: CheckoutProps) {
  const state = useCheckoutElements();
  const { locale, ui } = useI18n();
  const text = ui.paywall;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stripe gets the typed address too, so Link's save option shows up filled in.
  const checkout = state.type === "success" ? state.checkout : null;
  useEffect(() => {
    const address = email.trim();
    if (!checkout || !looksLikeEmail(address)) return;
    const timer = setTimeout(() => {
      void checkout.updateEmail(address).then((result) => result.type === "error" && console.warn("[checkout] updateEmail:", result.error.message));
    }, 700);
    return () => clearTimeout(timer);
  }, [checkout, email]);

  if (state.type === "loading") {
    return (
      <p className="flex items-center gap-2 py-6 text-sm text-fg-muted">
        <Spinner /> {text.loading}
      </p>
    );
  }
  if (state.type === "error" || !checkout) return <p className="py-4 text-sm text-danger">{state.type === "error" ? state.error.message : null}</p>;

  // Stripe's own strings read "1,00 EUR" in some locales; its minor units are formatted like the rest of the page.
  const money = (minor: number) =>
    new Intl.NumberFormat(INTL_LOCALE[locale], { style: "currency", currency: checkout.currency.toUpperCase(), currencyDisplay: "narrowSymbol" }).format(
      minor / checkout.minorUnitsAmountDivisor,
    );
  const prices: Prices = {
    today: money(checkout.total.total.minorUnitsAmount),
    monthly: checkout.recurring ? money(checkout.recurring.dueNext.total.minorUnitsAmount) : null,
  };

  const finish = async (confirmation: Parameters<typeof checkout.confirm>[0]) => {
    const result = await checkout.confirm({ redirect: "if_required", ...confirmation });
    if (result.type === "error") {
      setError(result.error.message);
      setBusy(false);
      return;
    }
    onPaid(result.session.id);
  };

  const payByCard = async () => {
    if (!consent) return onConsentMissing();
    const address = email.trim();
    if (!looksLikeEmail(address)) return onEmailMissing();
    setBusy(true);
    setError(null);
    if (!(await checkEmail(address))) return setBusy(false);
    await finish({ email: address });
  };

  const payExpress = async (event: StripeExpressCheckoutElementConfirmEvent) => {
    // With a wallet the address comes from the wallet.
    const address = event.billingDetails?.email ?? email.trim();
    setBusy(true);
    setError(null);
    if (looksLikeEmail(address) && !(await checkEmail(address))) {
      event.paymentFailed({ reason: "fail" });
      return setBusy(false);
    }
    await finish({ expressCheckoutConfirmEvent: event });
  };

  return (
    <div className="space-y-3">
      {renderPrices(prices)}

      <div className="relative">
        {/* Wallet buttons cannot be intercepted, so they stay disabled until consent is given. */}
        <div className={cn("space-y-3 transition-opacity", !consent && "pointer-events-none opacity-45")} aria-disabled={!consent}>
          <ExpressCheckoutElement
            options={{
              buttonHeight: 48,
              buttonTheme: undefined,
              buttonType: { applePay: "plain", googlePay: "plain", paypal: "paypal" },
              layout: { maxColumns: 1, maxRows: 6, overflow: "never" },
              paymentMethodOrder: ["apple_pay", "google_pay", "paypal", "link"],
              paymentMethods: undefined,
            }}
            onConfirm={(event) => void payExpress(event)}
          />
          <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
            <PaymentElement options={{ layout: "tabs" }} />
            <Button variant="primary" size="lg" className="h-12 w-full" disabled={busy} onClick={() => void payByCard()}>
              {busy ? <Spinner /> : <Lock />}
              {fmt(text.pay, { amount: prices.today })}
            </Button>
          </div>
        </div>
        {!consent && <button type="button" aria-label={text.consentNeeded} className="absolute inset-0 cursor-not-allowed" onClick={onConsentMissing} />}
      </div>

      {busy && !error && (
        <p className="flex items-center gap-2 text-sm text-fg-muted">
          <Spinner /> {text.processing}
        </p>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
