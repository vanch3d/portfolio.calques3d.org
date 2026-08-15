import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const GLASS_PANEL_VARIANT = {
  sidebar: "sidebar",
  notice: "notice",
} as const;

export type GlassPanelVariant = keyof typeof GLASS_PANEL_VARIANT;

export function GlassPanel({
  variant = "sidebar",
  className,
  children,
}: {
  variant?: GlassPanelVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface/60 backdrop-blur-sm",
        variant === "sidebar" && "p-5",
        variant === "notice" && "p-8 text-center",
        className
      )}
    >
      {children}
    </div>
  );
}
