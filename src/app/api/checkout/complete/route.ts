import { fail, json, localeOf, readBody, text } from "@/lib/server/api";
import { accessFor, forgetAccess, stripe } from "@/lib/server/billing";
import { setSession } from "@/lib/server/session";

const MAX_AGE_SECONDS = 24 * 60 * 60;

/** After a successful payment: sign the payer in on this device. */
export async function POST(request: Request) {
  const body = await readBody(request);
  const locale = localeOf(body.locale);
  const id = text(body.sessionId, 200);
  if (!id.startsWith("cs_")) return fail(locale, "paymentIncomplete", 400);

  try {
    const session = await stripe().checkout.sessions.retrieve(id);
    const customer = typeof session.customer === "string" ? session.customer : session.customer?.id;
    const email = session.customer_details?.email ?? session.customer_email;
    const fresh = Date.now() / 1000 - session.created < MAX_AGE_SECONDS;
    if (session.status !== "complete" || !customer || !email || !fresh || session.metadata?.app !== "pdf-konvertalo") {
      return fail(locale, "paymentIncomplete", 402);
    }
    forgetAccess(customer);
    await setSession({ customer, email });
    return json({ signedIn: true, email, access: await accessFor(customer) });
  } catch (error) {
    console.error("[checkout/complete]", error);
    return fail(locale, "billingUnavailable", 503);
  }
}
