"use client";

import { useEffect } from "react";
import { useI18n } from "@/i18n/provider";
import { api, loadAccount } from "@/lib/account";
import { releaseResult } from "@/lib/deliver";
import { loadPending } from "@/lib/pending-result";
import { setPaywall, toast } from "@/lib/store";

/**
 * Coming back from a payment method that left the page (e.g. PayPal): sign in
 * with the finished Checkout Session and hand over the files kept on this device.
 */
export function CheckoutReturn() {
  const { locale, ui } = useI18n();

  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("checkout_session_id");
    if (!sessionId) return;
    url.searchParams.delete("checkout_session_id");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);

    void (async () => {
      toast(ui.paywall.returning);
      const pending = await loadPending();
      try {
        await api("/api/checkout/complete", { body: { sessionId, locale } });
        const account = await loadAccount();
        if (!account.access?.active) throw new Error(ui.common.unexpected);
        toast(ui.paywall.success, "success");
        if (pending) await releaseResult(pending);
      } catch (error) {
        const message = error instanceof Error ? error.message : ui.common.unexpected;
        if (pending) setPaywall({ ...pending, error: message });
        else toast(message, "error");
      }
    })();
    // Runs once per page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
