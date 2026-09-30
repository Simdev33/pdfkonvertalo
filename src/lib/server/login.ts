/**
 * Passwordless login with a 6-digit e-mail code. Only paying customers can
 * log in; the code's hash, expiry and attempt counter live in the Stripe
 * customer's metadata, so no database is needed and guessing is capped.
 */
import { randomInt, timingSafeEqual } from "node:crypto";
import type { Locale } from "@/i18n/config";
import { customersFor, forgetAccess, normalizeEmail, stripe } from "./billing";
import { sendLoginCode } from "./email";
import { clearPendingLogin, getPendingLogin, keyedHash, setPendingLogin, setSession } from "./session";

const CODE_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export type LoginResult = "ok" | "invalid" | "expired" | "locked";

/** Sends a code if the address belongs to a customer; the answer never tells whether it does. */
export async function startLogin(rawEmail: string, locale: Locale) {
  const email = normalizeEmail(rawEmail);
  const exp = Date.now() + CODE_MINUTES * 60_000;
  const target = (await customersFor(email))[0]?.customer ?? null;
  if (target) {
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    await stripe().customers.update(target.id, {
      metadata: { login_code: keyedHash(`${target.id}:${code}`), login_expires: String(Math.floor(exp / 1000)), login_attempts: "0" },
    });
    await sendLoginCode(email, code, locale);
  }
  await setPendingLogin({ customer: target?.id ?? null, email, exp });
}

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function finishLogin(rawCode: string): Promise<LoginResult> {
  const pending = await getPendingLogin();
  if (!pending) return "expired";
  const code = rawCode.replace(/\D/g, "");
  if (!pending.customer || code.length !== 6) return "invalid";

  const customer = await stripe().customers.retrieve(pending.customer);
  if (customer.deleted) return "invalid";
  const meta = customer.metadata;
  if (!meta.login_code || Number(meta.login_expires) * 1000 < Date.now()) return "expired";
  const attempts = Number(meta.login_attempts || 0);
  if (attempts >= MAX_ATTEMPTS) return "locked";

  if (!same(keyedHash(`${customer.id}:${code}`), meta.login_code)) {
    await stripe().customers.update(customer.id, { metadata: { login_attempts: String(attempts + 1) } });
    return attempts + 1 >= MAX_ATTEMPTS ? "locked" : "invalid";
  }

  await stripe().customers.update(customer.id, { metadata: { login_code: "", login_expires: "", login_attempts: "" } });
  forgetAccess(customer.id);
  await setSession({ customer: customer.id, email: customer.email ?? pending.email });
  await clearPendingLogin();
  return "ok";
}
