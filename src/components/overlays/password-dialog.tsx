"use client";

import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useApp, type PasswordRequest } from "@/lib/store";
import { cn } from "@/lib/utils";

export function PasswordDialog() {
  const request = useApp((state) => state.passwordRequest);
  return (
    <Dialog open={request !== null} onClose={() => request?.resolve(null)} label="Jelszó megadása" className="max-w-md">
      {/* Keyed so every request starts with an empty field. */}
      {request && <PasswordForm key={request.id} request={request} />}
    </Dialog>
  );
}

function PasswordForm({ request }: { request: PasswordRequest }) {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  return (
    <form
      className="p-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (password) request.resolve(password);
      }}
    >
      <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
        <KeyRound className="size-5" />
      </span>
      <h2 className="mt-4 text-lg font-semibold tracking-tight">Jelszóval védett PDF</h2>
      <p className="mt-1 text-sm leading-relaxed text-fg-muted">
        A(z) <span className="font-medium break-all text-fg">{request.fileName}</span> megnyitásához jelszó szükséges. A jelszó csak a
        böngésződben használódik fel.
      </p>
      <div
        className={cn(
          "mt-5 flex h-11 items-center rounded-xl bg-surface ring-1 ring-inset focus-within:ring-2 focus-within:ring-primary",
          request.reason === "incorrect" ? "ring-danger" : "ring-border-strong",
        )}
      >
        <input
          type={visible ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
          autoComplete="off"
          placeholder="Jelszó"
          aria-label="Jelszó"
          aria-invalid={request.reason === "incorrect"}
          className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="grid h-full w-11 place-items-center text-fg-subtle hover:text-fg"
          aria-label={visible ? "Jelszó elrejtése" : "Jelszó megjelenítése"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {request.reason === "incorrect" && <p className="mt-2 text-sm text-danger">Hibás jelszó, próbáld újra.</p>}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={() => request.resolve(null)}>
          Mégse
        </Button>
        <Button type="submit" variant="primary" disabled={!password}>
          Megnyitás
        </Button>
      </div>
    </form>
  );
}
