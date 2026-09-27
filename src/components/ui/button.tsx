import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const variants = {
  primary:
    "bg-primary text-primary-fg shadow-sm shadow-primary/25 hover:bg-primary-hover active:translate-y-px disabled:shadow-none",
  secondary: "bg-surface text-fg ring-1 ring-inset ring-border-strong/70 shadow-xs hover:bg-surface-2",
  soft: "bg-primary-soft text-primary-soft-fg hover:bg-primary-soft/70",
  ghost: "text-fg-muted hover:bg-surface-2 hover:text-fg",
  danger: "bg-danger-soft text-danger hover:bg-danger/15",
} as const;

const sizes = {
  sm: "h-8 gap-1.5 rounded-md px-2.5 text-[13px]",
  md: "h-9 gap-2 rounded-lg px-3.5 text-sm",
  lg: "h-11 gap-2 rounded-xl px-5 text-[15px]",
  icon: "size-9 rounded-lg",
  "icon-sm": "size-8 rounded-md",
} as const;

export type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({ variant = "secondary", size = "md", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-150 select-none disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
