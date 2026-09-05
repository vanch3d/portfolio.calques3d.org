"use client";

import { Button } from "@base-ui/react/button";

type LabButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  /** When true, adds aria-pressed="true" for toggle button semantics */
  pressed?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  "data-testid"?: string;
};

export function LabButton({
  children,
  onClick,
  pressed,
  disabled,
  "aria-label": ariaLabel,
  "data-testid": testId,
}: LabButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={pressed !== undefined ? pressed : undefined}
      data-testid={testId}
      className="label hover:text-ink"
      style={{
        border: "var(--line-ghost) solid var(--color-ink)",
        padding: "var(--space-2xs) var(--space-xs)",
        cursor: disabled ? "default" : "pointer",
        background: pressed ? "var(--color-active)" : "transparent",
        color: pressed ? "var(--color-ground)" : undefined,
        transition: "background 0.15s, color 0.15s",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </Button>
  );
}
