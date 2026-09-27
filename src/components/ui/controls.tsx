"use client";

import { ChevronDown, Minus, Plus } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { clamp, cn, formatNumber, parseDecimal } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Segmented                                 */
/* -------------------------------------------------------------------------- */

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  title?: string;
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className,
  size = "md",
  label,
}: {
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
  label?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("grid gap-1 rounded-lg bg-surface-2 p-1 ring-1 ring-inset ring-border", className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex min-w-0 items-center justify-center gap-1.5 rounded-md font-medium transition-colors [&_svg]:size-4 [&_svg]:shrink-0",
              size === "sm" ? "h-7 px-2 text-xs" : "h-8 px-2.5 text-[13px]",
              active ? "bg-surface text-fg shadow-sm ring-1 ring-border dark:bg-surface-3 dark:ring-border-strong" : "text-fg-muted hover:text-fg",
            )}
          >
            {option.icon}
            <span className="truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Fields                                   */
/* -------------------------------------------------------------------------- */

export function Field({ label, hint, children, className }: { label: ReactNode; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="text-xs font-medium text-fg-muted">{label}</div>
      {children}
      {hint && <p className="text-xs leading-relaxed text-fg-subtle">{hint}</p>}
    </div>
  );
}

export function Section({ title, action, children, className }: { title: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("space-y-3 border-b border-border px-5 py-5 last:border-b-0", className)}>
      <div className="flex min-h-6 items-center justify-between gap-3">
        <h3 className="text-[13px] font-semibold tracking-tight text-fg">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Hint({ children, tone = "info", icon }: { children: ReactNode; tone?: "info" | "warning"; icon?: ReactNode }) {
  return (
    <div
      className={cn(
        "flex gap-2.5 rounded-lg px-3 py-2.5 text-xs leading-relaxed [&_svg]:mt-0.5 [&_svg]:size-3.5 [&_svg]:shrink-0",
        tone === "warning" ? "bg-warning-soft text-warning" : "bg-surface-2 text-fg-muted",
      )}
    >
      {icon}
      <div>{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Number input                                */
/* -------------------------------------------------------------------------- */

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  unit,
  digits = 1,
  label,
  className,
  stepper = false,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  digits?: number;
  label?: string;
  className?: string;
  stepper?: boolean;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? formatNumber(value, digits);
  const invalid = draft !== null && Number.isNaN(parseDecimal(draft));

  const commit = (next: number) => {
    const rounded = Math.round(clamp(next, min, max) * 10 ** digits) / 10 ** digits;
    onChange(rounded);
  };

  return (
    <div
      className={cn(
        "flex h-9 items-center rounded-lg bg-surface ring-1 ring-inset transition-shadow focus-within:ring-2 focus-within:ring-primary",
        invalid ? "ring-danger" : "ring-border-strong/70",
        className,
      )}
    >
      {stepper && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Csökkentés"
          onClick={() => commit(value - step)}
          className="grid h-full w-8 shrink-0 place-items-center text-fg-subtle hover:text-fg"
        >
          <Minus className="size-3.5" />
        </button>
      )}
      <input
        id={id}
        aria-label={label}
        inputMode="decimal"
        autoComplete="off"
        value={shown}
        onChange={(event) => {
          setDraft(event.target.value);
          const parsed = parseDecimal(event.target.value);
          if (!Number.isNaN(parsed) && parsed >= min && parsed <= max) onChange(parsed);
        }}
        onFocus={(event) => event.target.select()}
        onBlur={() => {
          if (draft !== null) {
            const parsed = parseDecimal(draft);
            if (!Number.isNaN(parsed)) commit(parsed);
          }
          setDraft(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") (event.target as HTMLInputElement).blur();
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            const delta = (event.key === "ArrowUp" ? 1 : -1) * step * (event.shiftKey ? 10 : 1);
            setDraft(null);
            commit(value + delta);
          }
        }}
        className={cn(
          "h-full w-full min-w-0 bg-transparent text-sm tabular-nums outline-none",
          stepper ? "text-center" : "pl-3",
          !unit && !stepper && "pr-3",
        )}
      />
      {unit && <span className="pointer-events-none pr-3 pl-1 text-xs text-fg-subtle">{unit}</span>}
      {stepper && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Növelés"
          onClick={() => commit(value + step)}
          className="grid h-full w-8 shrink-0 place-items-center text-fg-subtle hover:text-fg"
        >
          <Plus className="size-3.5" />
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Switch                                   */
/* -------------------------------------------------------------------------- */

export function Switch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <label htmlFor={id} className="min-w-0">
        <span className="block text-[13px] font-medium text-fg">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-fg-subtle">{description}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-surface-3 ring-1 ring-inset ring-border-strong",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform",
            checked && "translate-x-4",
          )}
        />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Misc bits                                 */
/* -------------------------------------------------------------------------- */

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border-strong bg-surface px-1 font-sans text-[11px] font-medium text-fg-muted shadow-[0_1px_0_var(--border-strong)]">
      {children}
    </kbd>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4 animate-spin", className)} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function ProgressBar({ value, className }: { value: number | null; className?: string }) {
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-surface-3", className)}>
      {value === null ? (
        <div className="h-full w-1/3 animate-[indeterminate_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
      ) : (
        <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${Math.round(clamp(value, 0, 1) * 100)}%` }} />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Select                                   */
/* -------------------------------------------------------------------------- */

export function Select<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-9 w-full appearance-none rounded-lg bg-surface pr-9 pl-3 text-sm ring-1 ring-border-strong/70 outline-none ring-inset focus:ring-2 focus:ring-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-fg-subtle" />
    </div>
  );
}
