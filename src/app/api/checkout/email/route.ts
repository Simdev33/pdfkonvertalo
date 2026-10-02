import { fail, json, localeOf, readBody, text } from "@/lib/server/api";
import { BillingError, customersFor, isEmail, normalizeEmail } from "@/lib/server/billing";
import { clientIp, limited } from "@/lib/server/rate-limit";

/** Before paying: whether this address already has a live subscription (then the payer signs in instead). */
export async function POST(request: Request) {
  const body = await readBody(request);
  const locale = localeOf(body.locale);
  const email = normalizeEmail(text(body.email, 254));
  if (!isEmail(email)) return fail(locale, "invalidEmail", 400);
  if (limited(`checkout-email:${clientIp(request)}`, 20, 15 * 60_000)) return fail(locale, "rateLimited", 429);

  try {
    const [existing] = await customersFor(email);
    if (existing?.access.active) return fail(locale, "alreadySubscribed", 409);
    return json({ ok: true });
  } catch (error) {
    console.error("[checkout/email]", error);
    return fail(locale, error instanceof BillingError && error.code === "notConfigured" ? "billingUnavailable" : "checkoutFailed", 503);
  }
}
