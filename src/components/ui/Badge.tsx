import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "warning" | "muted" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-accent-subtle text-accent border border-accent-muted",
  success:
    "bg-green-100 text-success border border-green-200 dark:bg-green-950 dark:border-green-800",
  warning:
    "bg-yellow-100 text-warning border border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
  muted:
    "bg-bg-muted text-text-muted border border-border-muted",
  outline:
    "bg-transparent text-text border border-border",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5",
        "text-xs font-medium leading-none rounded-full tabular-nums",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
