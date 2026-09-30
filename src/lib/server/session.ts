/**
 * Signed, httpOnly cookies instead of a user database: the session names the
 * Stripe customer, and Stripe stays the source of truth for the subscription.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "pk_session";
/** Readable by scripts: tells the page to ask /api/account who is signed in. */
const SIGNED_IN_COOKIE = "pk_signed_in";
const LOGIN_COOKIE = "pk_login";

const SESSION_DAYS = 180;

export interface Session {
  customer: string;
  email: string;
}

export interface PendingLogin {
  customer: string | null;
  email: string;
  exp: number;
}

function secret() {
  const value = process.env.SESSION_SECRET;
  if (value && value.length >= 16) return value;
  if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET is not set");
  return "development-only-session-secret";
}

const mac = (body: string) => createHmac("sha256", secret()).update(body).digest("base64url");

export function sign(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${mac(body)}`;
}

export function unsign<T>(token: string | undefined): T | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = Buffer.from(mac(body));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

/** Keyed hash for values that must not be stored in the clear (login codes). */
export function keyedHash(value: string) {
  return createHmac("sha256", secret()).update(`code:${value}`).digest("hex");
}

const base = { path: "/", sameSite: "lax" as const, secure: process.env.NODE_ENV === "production" };

export async function getSession(): Promise<Session | null> {
  const session = unsign<Session>((await cookies()).get(SESSION_COOKIE)?.value);
  return session?.customer && session.email ? session : null;
}

export async function setSession(session: Session) {
  const store = await cookies();
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  store.set(SESSION_COOKIE, sign(session), { ...base, httpOnly: true, maxAge });
  store.set(SIGNED_IN_COOKIE, "1", { ...base, httpOnly: false, maxAge });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(SIGNED_IN_COOKIE);
}

export async function getPendingLogin(): Promise<PendingLogin | null> {
  const pending = unsign<PendingLogin>((await cookies()).get(LOGIN_COOKIE)?.value);
  return pending && pending.exp > Date.now() ? pending : null;
}

export async function setPendingLogin(pending: PendingLogin) {
  (await cookies()).set(LOGIN_COOKIE, sign(pending), { ...base, httpOnly: true, maxAge: Math.ceil((pending.exp - Date.now()) / 1000) });
}

export async function clearPendingLogin() {
  (await cookies()).delete(LOGIN_COOKIE);
}
