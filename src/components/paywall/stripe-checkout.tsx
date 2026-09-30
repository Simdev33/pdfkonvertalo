"use client";

import { CheckoutElementsProvider, ExpressCheckoutElement, PaymentElement, useCheckoutElements } from "@stripe/react-stripe-js/checkout";
import { loadStripe, type Appearance, type Stripe, type StripeConstructorOptions } from "@stripe/stripe-js";
import { CreditCard, Lock } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
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
  if (!promise) stripes.set(locale, (promise = loadStripe(key, { locale: locale as StripeConstructorOptions["locale"] })));
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

/**
 * The payment methods of one Checkout Session: express wallet buttons
 * (Apple Pay, Google Pay, PayPal, Link) and the card form behind a button, as
 * on the design. `consent` must be given before any of them can be used.
 */
export function StripeCheckout({
  clientSecret,
  consent,
  onConsentMissing,
  onPaid,
  renderPrices,
}: {
  clientSecret: string;
  consent: boolean;
  onConsentMissing: () => void;
  onPaid: (sessionId: string) => void;
  renderPrices: (prices: Prices) => ReactNode;
}) {
  const { locale } = useI18n();
  const stripe = useMemo(() => stripeFor(locale), [locale]);
  const options = useMemo(() => ({ clientSecret, elementsOptions: { appearance: appearance() } }), [clientSecret]);
  return (
    <CheckoutElementsProvider stripe={stripe} options={options}>
      <PaymentMethods consent={consent} onConsentMissing={onConsentMissing} onPaid={onPaid} renderPrices={renderPrices} />
    </CheckoutElementsProvider>
  );
}

function PaymentMethods({
  consent,
  onConsentMissing,
  onPaid,
  renderPrices,
}: {
  consent: boolean;
  onConsentMissing: () => void;
  onPaid: (sessionId: string) => void;
  renderPrices: (prices: Prices) => ReactNode;
}) {
  const state = useCheckoutElements();
  const { locale, ui } = useI18n();
  const text = ui.paywall;
  const [cardOpen, setCardOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (state.type === "loading") {
    return (
      <p className="flex items-center gap-2 py-6 text-sm text-fg-muted">
        <Spinner /> {text.loading}
      </p>
    );
  }
  if (state.type === "error") return <p className="py-4 text-sm text-danger">{state.error.message}</p>;

  const { checkout } = state;
  // Stripe's own strings read "1,00 EUR" in some locales; its minor units are formatted like the rest of the page.
  const money = (minor: number) =>
    new Intl.NumberFormat(INTL_LOCALE[locale], { style: "currency", currency: checkout.currency.toUpperCase(), currencyDisplay: "narrowSymbol" }).format(
      minor / checkout.minorUnitsAmountDivisor,
    );
  const prices: Prices = {
    today: money(checkout.total.total.minorUnitsAmount),
    monthly: checkout.recurring ? money(checkout.recurring.dueNext.total.minorUnitsAmount) : null,
  };

  const confirm = async (extra: Parameters<typeof checkout.confirm>[0] = {}) => {
    if (!consent) {
      onConsentMissing();
      return;
    }
    setBusy(true);
    setError(null);
    const result = await checkout.confirm({ redirect: "if_required", ...extra });
    if (result.type === "error") {
      setError(result.error.message);
      setBusy(false);
      return;
    }
    onPaid(result.session.id);
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
            onConfirm={(event) => void confirm({ expressCheckoutConfirmEvent: event })}
          />
          {cardOpen ? (
            <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
              <PaymentElement options={{ layout: "tabs" }} />
              <Button variant="primary" size="lg" className="w-full" disabled={busy} onClick={() => void confirm()}>
                {busy ? <Spinner /> : <Lock />}
                {fmt(text.pay, { amount: prices.today })}
              </Button>
            </div>
          ) : (
            <Button variant="primary" size="lg" className="h-12 w-full" onClick={() => setCardOpen(true)}>
              <CreditCard />
              {text.card}
            </Button>
          )}
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
