/**
 * Stripe: prices, customers and the access check. There is no database –
 * whether someone may download is always read from their subscriptions.
 *
 * The plan: a subscription with a 7-day trial whose first invoice carries a
 * one-time 1.00 EUR fee, renewing at 9.90 EUR per month afterwards.
 */
import Stripe from "stripe";
import { DEFAULT_LOCALE, pathFor } from "@/i18n/config";
import { PLAN } from "@/lib/plan";
import { site } from "@/lib/site";

export { PLAN };

/**
 * The Stripe account is shared with other sites (e.g. DoneSignIn), so only
 * objects of this app count: subscriptions tagged with this app (or on our
 * product), and customers tagged with it – Stripe creates them at payment,
 * /api/checkout/complete tags them afterwards.
 */
export const APP = "pdf-konvertalo";
const PRODUCT_ID = "pdf_konvertalo";
const LOOKUP = { trial: "pdf_konvertalo_trial_fee_eur_100", monthly: "pdf_konvertalo_monthly_eur_990" } as const;
const PORTAL_TAG = "pdf-konvertalo";

export class BillingError extends Error {
  constructor(
    readonly code: "notConfigured" | "failed",
    message: string = code,
  ) {
    super(message);
    this.name = "BillingError";
  }
}

let client: Stripe | null = null;

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new BillingError("notConfigured", "STRIPE_SECRET_KEY is not set");
  client ??= new Stripe(key, { appInfo: { name: site.name } });
  return client;
}

export const billingConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

/* --------------------------------- prices -------------------------------- */

let pricesPromise: Promise<{ trial: string; monthly: string }> | null = null;

async function ensureProduct() {
  try {
    // The name shows on the payment page, receipts and the customer portal.
    const product = await stripe().products.retrieve(PRODUCT_ID);
    if (product.name !== site.name) await stripe().products.update(PRODUCT_ID, { name: site.name });
  } catch (error) {
    if ((error as { code?: string }).code !== "resource_missing") throw error;
    await stripe().products.create({ id: PRODUCT_ID, name: site.name, description: "PDF converter – full access" });
  }
}

async function loadPrices() {
  const fromEnv = { trial: process.env.STRIPE_PRICE_TRIAL, monthly: process.env.STRIPE_PRICE_MONTHLY };
  if (fromEnv.trial && fromEnv.monthly) return { trial: fromEnv.trial, monthly: fromEnv.monthly };

  const { data } = await stripe().prices.list({ lookup_keys: Object.values(LOOKUP), active: true, limit: 10 });
  const byKey = new Map(data.map((price) => [price.lookup_key, price.id]));
  let trial = fromEnv.trial ?? byKey.get(LOOKUP.trial);
  let monthly = fromEnv.monthly ?? byKey.get(LOOKUP.monthly);
  if (!trial || !monthly) await ensureProduct();
  if (!trial) {
    const price = await stripe().prices.create({
      product: PRODUCT_ID,
      currency: PLAN.currency.toLowerCase(),
      unit_amount: PLAN.trialFeeCents,
      lookup_key: LOOKUP.trial,
      nickname: "7-day trial fee",
    });
    trial = price.id;
  }
  if (!monthly) {
    const price = await stripe().prices.create({
      product: PRODUCT_ID,
      currency: PLAN.currency.toLowerCase(),
      unit_amount: PLAN.monthlyCents,
      recurring: { interval: "month" },
      lookup_key: LOOKUP.monthly,
      nickname: "Monthly",
    });
    monthly = price.id;
  }
  return { trial, monthly };
}

/** The two prices, created in Stripe on first use (or taken from STRIPE_PRICE_*). */
export function prices() {
  pricesPromise ??= loadPrices().catch((error) => {
    pricesPromise = null;
    throw error;
  });
  return pricesPromise;
}

/* --------------------------------- access -------------------------------- */

export interface Access {
  /** May download right now. */
  active: boolean;
  status: Stripe.Subscription.Status | "none";
  /** Unix seconds. */
  trialEnd: number | null;
  periodEnd: number | null;
  /** Cancelled, but usable until periodEnd. */
  cancelAtPeriodEnd: boolean;
}

const NO_ACCESS: Access = { active: false, status: "none", trialEnd: null, periodEnd: null, cancelAtPeriodEnd: false };
const ACTIVE = new Set<string>(["trialing", "active"]);
const RANK: Record<string, number> = { trialing: 0, active: 0, past_due: 1, unpaid: 2, incomplete: 3, paused: 4, canceled: 5, incomplete_expired: 6 };

// A short-lived cache: the header and every download ask for the same customer.
const cache = new Map<string, { access: Access; until: number }>();

const productOf = (item: Stripe.SubscriptionItem) => (typeof item.price.product === "string" ? item.price.product : item.price.product.id);

/** A subscription of this app — never one of another site on the same Stripe account. */
const isOurs = (subscription: Stripe.Subscription) =>
  subscription.metadata?.app === APP || subscription.items.data.some((item) => productOf(item) === PRODUCT_ID);

export function forgetAccess(customer: string) {
  cache.delete(customer);
}

export async function accessFor(customer: string): Promise<Access> {
  const cached = cache.get(customer);
  if (cached && cached.until > Date.now()) return cached.access;

  const { data } = await stripe().subscriptions.list({ customer, status: "all", limit: 20 });
  const best = data.filter(isOurs).sort((a, b) => (RANK[a.status] ?? 9) - (RANK[b.status] ?? 9) || b.created - a.created)[0];
  const access: Access = best
    ? {
        active: ACTIVE.has(best.status),
        status: best.status,
        trialEnd: best.status === "trialing" ? best.trial_end : null,
        periodEnd: best.items.data[0]?.current_period_end ?? null,
        cancelAtPeriodEnd: best.cancel_at_period_end || best.cancel_at !== null,
      }
    : NO_ACCESS;
  cache.set(customer, { access, until: Date.now() + 60_000 });
  return access;
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;

const ours = (customer: Stripe.Customer) => customer.metadata?.app === APP;

/** Customers with this e-mail, the one with access (or the newest) first. */
export async function customersFor(email: string) {
  const { data } = await stripe().customers.list({ email: normalizeEmail(email), limit: 20 });
  // Customers tagged for another app (metadata.app set to something else) are not ours.
  const candidates = data.filter((customer) => !customer.deleted && (ours(customer) || !customer.metadata?.app));
  const withAccess = await Promise.all(candidates.map(async (customer) => ({ customer, access: await accessFor(customer.id) })));
  // Stripe creates an untagged customer at payment; it is ours only if it has one of our subscriptions.
  const mine = withAccess.filter(({ customer, access }) => ours(customer) || access.status !== "none");
  return mine.sort((a, b) => Number(b.access.active) - Number(a.access.active) || b.customer.created - a.customer.created);
}

/** Tags the customer Stripe created at payment, so the other sites on the account leave it alone. */
export async function claimCustomer(customer: Stripe.Customer | Stripe.DeletedCustomer, locale?: string) {
  if (customer.deleted || ours(customer)) return;
  await stripe().customers.update(customer.id, {
    metadata: { app: APP },
    ...(locale && !customer.preferred_locales?.length ? { preferred_locales: [locale] } : {}),
  });
}

/* ------------------------------ customer portal --------------------------- */

let portalConfig: Promise<string> | null = null;

/** Our own portal configuration (cancel at period end, card update, invoices), created once. */
function portalConfiguration() {
  portalConfig ??= (async () => {
    const { data } = await stripe().billingPortal.configurations.list({ active: true, limit: 100 });
    const existing = data.find((configuration) => configuration.metadata?.app === PORTAL_TAG);
    if (existing) return existing.id;
    const created = await stripe().billingPortal.configurations.create({
      metadata: { app: PORTAL_TAG },
      business_profile: {
        privacy_policy_url: new URL(pathFor("privacy", DEFAULT_LOCALE), site.url).toString(),
        terms_of_service_url: new URL(pathFor("terms", DEFAULT_LOCALE), site.url).toString(),
      },
      features: {
        subscription_cancel: { enabled: true, mode: "at_period_end" },
        payment_method_update: { enabled: true },
        invoice_history: { enabled: true },
        customer_update: { enabled: true, allowed_updates: ["email"] },
      },
    });
    return created.id;
  })().catch((error) => {
    portalConfig = null;
    throw error;
  });
  return portalConfig;
}

export async function portalUrl(customer: string, returnUrl: string, locale: string) {
  const session = await stripe().billingPortal.sessions.create({
    customer,
    return_url: returnUrl,
    configuration: await portalConfiguration(),
    locale: locale as Stripe.BillingPortal.SessionCreateParams.Locale,
  });
  return session.url;
}
