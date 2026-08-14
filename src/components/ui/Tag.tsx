import * as React from "react";
import { cn } from "@/lib/utils";

export type TagVariant = "default" | "mono";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
}

export function Tag({
  variant = "default",
  className,
  children,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded",
        "text-xs leading-none",
        "bg-bg-muted text-text-muted border border-border-muted",
        variant === "mono" && "font-mono tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
