export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "type";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const cls =
    variant === "type"
      ? // text-foreground (not text-foreground-secondary) ensures ≥4.5:1 in dark mode
        // dark: #f1f5f9 on #334155 ≈ 10:1 — both modes pass WCAG AA
        "inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-surface-raised text-foreground"
      : "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-accent-subtle text-accent-hover border border-accent/20";

  return <span className={cls}>{children}</span>;
}
