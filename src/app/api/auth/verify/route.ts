import { fail, json, localeOf, readBody, text } from "@/lib/server/api";
import { finishLogin } from "@/lib/server/login";
import { clientIp, limited } from "@/lib/server/rate-limit";

const MESSAGES = { invalid: "codeInvalid", expired: "codeExpired", locked: "codeLocked" } as const;

/** Step 2 of logging in: check the code and start the session. */
export async function POST(request: Request) {
  const body = await readBody(request);
  const locale = localeOf(body.locale);
  if (limited(`verify:${clientIp(request)}`, 20, 15 * 60_000)) return fail(locale, "rateLimited", 429);
  try {
    const result = await finishLogin(text(body.code, 20));
    return result === "ok" ? json({ signedIn: true }) : fail(locale, MESSAGES[result], result === "invalid" ? 400 : 410);
  } catch (error) {
    console.error("[auth/verify]", error);
    return fail(locale, "billingUnavailable", 503);
  }
}
