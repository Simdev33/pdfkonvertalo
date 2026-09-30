import { json } from "@/lib/server/api";
import { accessFor, billingConfigured } from "@/lib/server/billing";
import { clearSession, getSession } from "@/lib/server/session";

export const dynamic = "force-dynamic";

/** Who is signed in and whether they may download. */
export async function GET() {
  const session = await getSession();
  if (!session) return json({ signedIn: false, billing: billingConfigured() });
  try {
    return json({ signedIn: true, billing: true, email: session.email, access: await accessFor(session.customer) });
  } catch (error) {
    console.error("[account]", error);
    return json({ signedIn: true, billing: billingConfigured(), email: session.email, access: null }, 503);
  }
}

/** Sign out. */
export async function DELETE() {
  await clearSession();
  return json({ signedIn: false });
}
