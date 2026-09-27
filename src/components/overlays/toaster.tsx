"use client";

import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { dismissToast, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const ICONS = {
  info: <Info className="size-4 text-primary" />,
  success: <CircleCheck className="size-4 text-success" />,
  error: <CircleAlert className="size-4 text-danger" />,
};

export function Toaster() {
  const toasts = useApp((state) => state.toasts);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2 p-4 sm:items-end">
      {toasts.map((item) => (
        <div
          key={item.id}
          role={item.tone === "error" ? "alert" : "status"}
          className={cn(
            "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-surface px-4 py-3 text-sm shadow-lg animate-slide-up",
            item.tone === "error" ? "border-danger/30" : "border-border",
          )}
        >
          <span className="mt-0.5">{ICONS[item.tone]}</span>
          <p className="min-w-0 flex-1 leading-relaxed">{item.message}</p>
          <button type="button" onClick={() => dismissToast(item.id)} className="-mr-1 text-fg-subtle hover:text-fg" aria-label="Bezárás">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
