import Link from "next/link";
import type { ReactNode } from "react";

/** Plain text with "[label](/path)" links (used by dictionary texts). */
export function LinkText({ text, className, newTab }: { text: string; className?: string; newTab?: boolean }) {
  const parts: ReactNode[] = [];
  let index = 0;
  for (const match of text.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
    if (match.index > index) parts.push(text.slice(index, match.index));
    parts.push(
      <Link
        key={match.index}
        href={match[2]}
        className={className ?? "underline underline-offset-2 hover:text-fg"}
        {...(newTab ? { target: "_blank", rel: "noopener" } : {})}
      >
        {match[1]}
      </Link>,
    );
    index = match.index + match[0].length;
  }
  if (index < text.length) parts.push(text.slice(index));
  return <>{parts}</>;
}
