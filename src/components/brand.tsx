import { cn } from "@/lib/utils";

/** The page-with-a-bolt mark; the same drawing as src/app/icon.svg (the favicon). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative block size-8 overflow-hidden rounded-[7.5px] bg-linear-to-br from-[#8b7cf8] to-[#4338ca] shadow-sm shadow-primary/30",
        className,
      )}
    >
      <svg viewBox="0 0 64 64" className="size-full" aria-hidden>
        <path d="M20.5 9H37l11 11v30.5a4.5 4.5 0 0 1-4.5 4.5h-23a4.5 4.5 0 0 1-4.5-4.5v-37A4.5 4.5 0 0 1 20.5 9z" fill="#fff" />
        <path d="M37 9v8a3 3 0 0 0 3 3h8z" fill="#cfcbff" />
        <path d="M35.5 19 22.5 37.5H31L28.5 50 41.5 31.5H33z" fill="#4f46e5" />
      </svg>
    </span>
  );
}

/** `compact`: the name is hidden on phones, where the header needs the room. */
export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className={cn("text-[15px] font-semibold tracking-tight text-fg", compact && "hidden sm:inline")}>
        ConvertPDF<span className="text-primary">Now</span>
      </span>
    </span>
  );
}
