import { fail, json, localeOf, readBody, returnUrl } from "@/lib/server/api";
import { portalUrl } from "@/lib/server/billing";
import { getSession } from "@/lib/server/session";

/** A Stripe customer portal link: cancel, change card, invoices. */
export async function POST(request: Request) {
  const body = await readBody(request);
  const locale = localeOf(body.locale);
  const session = await getSession();
  if (!session) return fail(locale, "notSignedIn", 401);
  try {
    return json({ url: await portalUrl(session.customer, returnUrl(request, body.returnPath).toString(), locale) });
  } catch (error) {
    console.error("[portal]", error);
    return fail(locale, "billingUnavailable", 503);
  }
}
