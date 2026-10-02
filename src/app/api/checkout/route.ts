import { fail, json, localeOf, readBody, returnUrl } from "@/lib/server/api";
import { APP, BillingError, PLAN, prices, stripe } from "@/lib/server/billing";
import { clientIp, limited } from "@/lib/server/rate-limit";

/**
 * Starts a Checkout Session for the custom payment page (ui_mode "elements"):
 * 1.00 EUR today for 7 days, then 9.90 EUR / month. It is created when the
 * payment page opens, without a customer: the pay button hands over the e-mail
 * address, and Stripe creates the customer only when the payment goes through.
 */
export async function POST(request: Request) {
  const body = await readBody(request);
  const locale = localeOf(body.locale);
  if (limited(`checkout:${clientIp(request)}`, 20, 15 * 60_000)) return fail(locale, "rateLimited", 429);

  try {
    const { trial, monthly } = await prices();

    // Stripe replaces the literal {CHECKOUT_SESSION_ID}, so it must not be URL-encoded.
    const back = returnUrl(request, body.returnPath);
    back.searchParams.delete("checkout_session_id");
    const separator = back.search ? "&" : "?";

    const session = await stripe().checkout.sessions.create({
      ui_mode: "elements",
      mode: "subscription",
      line_items: [
        { price: monthly, quantity: 1 },
        { price: trial, quantity: 1 },
      ],
      subscription_data: { trial_period_days: PLAN.trialDays, metadata: { app: APP } },
      billing_address_collection: "auto",
      // The finished files wait on the device for an hour too (src/lib/pending-result.ts).
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
      return_url: `${back.toString()}${separator}checkout_session_id={CHECKOUT_SESSION_ID}`,
      metadata: { app: APP, locale },
    });
    return json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("[checkout]", error);
    return fail(locale, error instanceof BillingError && error.code === "notConfigured" ? "billingUnavailable" : "checkoutFailed", 503);
  }
}
