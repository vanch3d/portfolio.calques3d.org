import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

const GLASS_PANEL_VARIANT = {
  sidebar: "sidebar",
  notice: "notice",
} as const;

export type GlassPanelVariant = keyof typeof GLASS_PANEL_VARIANT;

export function GlassPanel({
  variant = "sidebar",
  className,
  style,
  children,
}: {
  variant?: GlassPanelVariant;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      style={style}
      className={cn(
        "glass rounded-xl shadow-[var(--shadow-glass)]",
        variant === "sidebar" && "p-5",
        variant === "notice" && "p-8 text-center",
        className
      )}
    >
      {children}
    </div>
  );
}
