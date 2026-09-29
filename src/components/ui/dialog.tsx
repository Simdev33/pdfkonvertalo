"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

/** Thin wrapper around the native <dialog>: focus trap, Esc and top layer for free. */
export function Dialog({
  open,
  onClose,
  children,
  className,
  label,
  dismissible = true,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  label: string;
  dismissible?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        if (dismissible) onClose();
      }}
      onClick={(event) => {
        if (dismissible && event.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-lg overflow-visible rounded-2xl bg-transparent p-0 text-fg open:animate-pop-in",
        className,
      )}
    >
      {open && <div className="overflow-hidden rounded-2xl bg-surface shadow-2xl ring-1 ring-border">{children}</div>}
    </dialog>
  );
}

export function DialogClose({ onClick }: { onClick: () => void }) {
  const { ui } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ui.common.close}
      className="absolute top-3.5 right-3.5 grid size-8 place-items-center rounded-lg text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg"
    >
      <X className="size-4" />
    </button>
  );
}
