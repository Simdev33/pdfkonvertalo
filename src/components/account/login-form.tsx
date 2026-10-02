"use client";

import { KeyRound, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/controls";
import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/provider";
import { requestLoginCode, verifyLoginCode, type AccountState } from "@/lib/account";
import { cn } from "@/lib/utils";

const field =
  "h-11 w-full rounded-xl bg-surface px-4 text-[15px] ring-1 ring-border-strong ring-inset outline-none placeholder:text-fg-subtle focus:ring-2 focus:ring-primary";

/**
 * Passwordless login: e-mail → 6-digit code. `codeSent` starts at the code
 * step (the caller already requested one, e.g. at checkout).
 */
export function LoginForm({
  initialEmail = "",
  codeSent = false,
  onSuccess,
  className,
}: {
  initialEmail?: string;
  codeSent?: boolean;
  onSuccess?: (account: AccountState) => void;
  className?: string;
}) {
  const { locale, ui } = useI18n();
  const text = ui.auth;
  const [step, setStep] = useState<"email" | "code">(codeSent ? "code" : "email");
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : ui.common.unexpected);
    } finally {
      setBusy(false);
    }
  };

  const send = (event?: FormEvent) => {
    event?.preventDefault();
    void run(async () => {
      await requestLoginCode(email.trim(), locale);
      setCode("");
      setStep("code");
    });
  };

  const verify = (event: FormEvent) => {
    event.preventDefault();
    void run(async () => {
      // Not `onSuccess?.(await …)`: without a callback that would skip the verification itself.
      const account = await verifyLoginCode(code, locale);
      onSuccess?.(account);
    });
  };

  if (step === "email") {
    return (
      <form onSubmit={send} className={cn("space-y-3", className)}>
        <p className="text-sm leading-relaxed text-fg-muted">{text.intro}</p>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{text.email}</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={field}
          />
        </label>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy || !email.trim()}>
          {busy ? <Spinner /> : <Mail />}
          {text.sendCode}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={verify} className={cn("space-y-3", className)}>
      <p className="text-sm leading-relaxed text-fg-muted">{fmt(text.sent, { email: email.trim() })}</p>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">{text.code}</span>
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]*"
          maxLength={7}
          autoFocus
          required
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/[^\d ]/g, ""))}
          className={cn(field, "text-center font-mono text-xl tracking-[0.4em]")}
        />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy || code.replace(/\D/g, "").length !== 6}>
        {busy ? <Spinner /> : <KeyRound />}
        {text.verify}
      </Button>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <button type="button" className="text-primary hover:underline disabled:opacity-50" onClick={() => send()} disabled={busy}>
          {text.resend}
        </button>
        <button type="button" className="text-fg-muted hover:text-fg" onClick={() => setStep("email")} disabled={busy}>
          {text.otherEmail}
        </button>
      </div>
    </form>
  );
}
