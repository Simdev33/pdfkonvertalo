/**
 * Transactional e-mail (login codes) through Resend's HTTP API. Without an
 * API key, development prints the code to the server log instead.
 */
import { SITE } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { site } from "@/lib/site";

export class EmailError extends Error {}

const escape = (text: string) => text.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]!);

export async function sendLoginCode(to: string, code: string, locale: Locale) {
  const text = SITE[locale].email;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") throw new EmailError("RESEND_API_KEY is not set");
    console.info(`[login] code for ${to}: ${code} (set RESEND_API_KEY to send it by e-mail)`);
    return;
  }

  const lines = [fmt(text.intro, { site: site.name }), code, fmt(text.validity, { minutes: 10 }), text.ignore];
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#1a1c24">
<p>${escape(lines[0])}</p>
<p style="font-size:32px;font-weight:700;letter-spacing:6px;margin:24px 0">${code}</p>
<p>${escape(lines[2])}</p>
<p style="color:#6b6f7a;font-size:13px">${escape(lines[3])}</p>
</div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? `${site.name} <no-reply@${new URL(site.url).hostname}>`,
      to: [to],
      subject: fmt(text.subject, { code, site: site.name }),
      text: lines.join("\n\n"),
      html,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    console.error("[email] Resend", response.status, await response.text().catch(() => ""));
    throw new EmailError("sending failed");
  }
}
