"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "@/lib/utils";

export type IconButtonVariant = "ghost" | "outline";
export type IconButtonSize = "sm" | "md" | "lg";

// aria-label is required — enforced at the type level (no optional).
export interface IconButtonProps
  extends React.ComponentPropsWithoutRef<typeof BaseButton> {
  "aria-label": string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

const variantClasses: Record<IconButtonVariant, string> = {
  ghost: "bg-transparent text-text hover:bg-bg-subtle",
  outline:
    "bg-transparent text-text border border-border hover:bg-bg-subtle hover:border-border-strong",
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

export function IconButton({
  variant = "ghost",
  size = "md",
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <BaseButton
      className={cn(
        "inline-flex items-center justify-center rounded-md",
        "transition-colors duration-150",
        "focus-visible:outline-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </BaseButton>
  );
}
