/**
 * The one plan: 7 days of full access for 1.00 EUR, then 9.90 EUR a month
 * (a subscription with a 7-day trial and a one-time fee on its first invoice).
 * The payment page shows the amounts Stripe reports; these are for texts
 * elsewhere (account page, landing, legal) and for creating the prices.
 */
export const PLAN = { trialDays: 7, trialFeeCents: 100, monthlyCents: 990, currency: "EUR" } as const;

export const formatMoney = (cents: number, locale: string) =>
  new Intl.NumberFormat(locale, { style: "currency", currency: PLAN.currency, currencyDisplay: "narrowSymbol" }).format(cents / 100);

/** Placeholders for dictionary texts: {trial}, {monthly}, {days}, {next}. */
export const priceVars = (locale: string) => ({
  trial: formatMoney(PLAN.trialFeeCents, locale),
  monthly: formatMoney(PLAN.monthlyCents, locale),
  days: PLAN.trialDays,
  next: PLAN.trialDays + 1,
});
