import { fail, json, localeOf, readBody, returnUrl, text } from "@/lib/server/api";
import { BillingError, customersFor, isEmail, normalizeEmail, PLAN, prices, stripe } from "@/lib/server/billing";
import { clientIp, limited } from "@/lib/server/rate-limit";

/**
 * Starts a Checkout Session for the custom payment page (ui_mode "elements"):
 * 1.00 EUR today for 7 days, then 9.90 EUR / month.
 */
export async function POST(request: Request) {
  const body = await readBody(request);
  const locale = localeOf(body.locale);
  const email = normalizeEmail(text(body.email, 254));
  if (!isEmail(email)) return fail(locale, "invalidEmail", 400);
  if (limited(`checkout:${clientIp(request)}`, 20, 15 * 60_000)) return fail(locale, "rateLimited", 429);

  try {
    const customers = await customersFor(email);
    if (customers[0]?.access.active) return fail(locale, "alreadySubscribed", 409);
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
      subscription_data: { trial_period_days: PLAN.trialDays, metadata: { app: "pdf-konvertalo" } },
      ...(customers[0] ? { customer: customers[0].customer.id } : { customer_email: email }),
      billing_address_collection: "auto",
      return_url: `${back.toString()}${separator}checkout_session_id={CHECKOUT_SESSION_ID}`,
      metadata: { app: "pdf-konvertalo", locale },
    });
    return json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("[checkout]", error);
    return fail(locale, error instanceof BillingError && error.code === "notConfigured" ? "billingUnavailable" : "checkoutFailed", 503);
  }
}
