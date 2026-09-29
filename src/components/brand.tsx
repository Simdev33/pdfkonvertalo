import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-8 place-items-center rounded-[10px] bg-linear-to-br from-[#6d66f6] to-[#4338ca] text-white shadow-sm shadow-primary/30 ring-1 ring-white/15 ring-inset",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5" />
        <path d="M9 14.5h6M12.5 12l2.5 2.5-2.5 2.5" />
      </svg>
    </span>
  );
}

/** `compact`: the name is hidden on phones, where the header needs the room. */
export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className={cn("text-[15px] font-semibold tracking-tight text-fg", compact && "hidden sm:inline")}>{site.name}</span>
    </span>
  );
}
