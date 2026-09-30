import { fail, json, localeOf, readBody, text } from "@/lib/server/api";
import { BillingError, isEmail, normalizeEmail } from "@/lib/server/billing";
import { EmailError } from "@/lib/server/email";
import { startLogin } from "@/lib/server/login";
import { clientIp, limited } from "@/lib/server/rate-limit";

/** Step 1 of logging in: e-mail a code (only to customers; the reply is the same either way). */
export async function POST(request: Request) {
  const body = await readBody(request);
  const locale = localeOf(body.locale);
  const email = normalizeEmail(text(body.email, 254));
  if (!isEmail(email)) return fail(locale, "invalidEmail", 400);
  if (limited(`ip:${clientIp(request)}`, 10, 15 * 60_000) || limited(`email:${email}`, 4, 15 * 60_000)) return fail(locale, "rateLimited", 429);

  try {
    await startLogin(email, locale);
    return json({ sent: true });
  } catch (error) {
    console.error("[auth/request]", error);
    if (error instanceof EmailError) return fail(locale, "emailFailed", 502);
    return fail(locale, error instanceof BillingError ? "billingUnavailable" : "unexpected", 503);
  }
}
