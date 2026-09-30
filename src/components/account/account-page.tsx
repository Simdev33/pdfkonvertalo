"use client";

import { CircleUserRound, CreditCard, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/controls";
import { INTL_LOCALE, pathFor, type Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { loadAccount, openBillingPortal, signOut, useAccount, type AccessInfo } from "@/lib/account";
import { formatMoney, PLAN } from "@/lib/plan";
import { LoginForm } from "./login-form";

function statusText(access: AccessInfo | null, locale: Locale, text: ReturnType<typeof useI18n>["ui"]["account"]) {
  const date = (seconds: number | null) =>
    seconds ? new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "long" }).format(new Date(seconds * 1000)) : "–";
  const monthly = formatMoney(PLAN.monthlyCents, INTL_LOCALE[locale]);
  if (!access || access.status === "none" || !["trialing", "active", "past_due"].includes(access.status)) return text.none;
  if (access.status === "past_due") return text.pastDue;
  if (access.cancelAtPeriodEnd) return fmt(text.canceling, { date: date(access.periodEnd) });
  if (access.status === "trialing") return fmt(text.trial, { date: date(access.trialEnd), monthly });
  return fmt(text.active, { date: date(access.periodEnd), monthly });
}

export function AccountPage({ locale }: { locale: Locale }) {
  const { ui } = useI18n();
  const text = ui.account;
  const account = useAccount();
  const [busy, setBusy] = useState<"portal" | "logout" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAccount().catch(() => setError(text.error));
  }, [text.error]);

  const act = async (kind: "portal" | "logout") => {
    setBusy(kind);
    setError(null);
    try {
      if (kind === "portal") await openBillingPortal(locale, pathFor("account", locale));
      else await signOut();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : ui.common.unexpected);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 pt-14 pb-24 sm:pt-20">
      <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
        <CircleUserRound className="size-6" />
      </span>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">{account.signedIn ? text.title : ui.auth.title}</h1>

      {!account.loaded && !error ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-fg-muted">
          <Spinner /> {text.loading}
        </p>
      ) : account.signedIn ? (
        <div className="mt-6 space-y-5">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm text-fg-subtle">{fmt(text.signedInAs, { email: account.email ?? "" })}</p>
            <p className="mt-2 leading-relaxed">{statusText(account.access, locale, text)}</p>
          </div>
          <div className="space-y-2">
            <Button variant="primary" size="lg" className="w-full" onClick={() => void act("portal")} disabled={busy !== null}>
              {busy === "portal" ? <Spinner /> : <CreditCard />}
              {text.manage}
            </Button>
            <p className="text-xs leading-relaxed text-fg-subtle">{text.manageHint}</p>
          </div>
          {!account.access?.active && (
            <Link href={pathFor("converter", locale)} className="block text-center text-sm font-medium text-primary hover:underline">
              {text.convert}
            </Link>
          )}
          <Button variant="ghost" className="w-full" onClick={() => void act("logout")} disabled={busy !== null}>
            {busy === "logout" ? <Spinner /> : <LogOut />}
            {text.logout}
          </Button>
        </div>
      ) : (
        <LoginForm className="mt-6" />
      )}
      {error && <p className="mt-4 text-sm text-danger">{error}</p>}
    </div>
  );
}
