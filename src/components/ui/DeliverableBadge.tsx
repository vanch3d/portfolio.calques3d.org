import { cn } from "@/lib/utils";
import type { ProjectVisibility } from "@/types/content";

const DELIVERABLE_BADGE_VARIANT = {
  public: "public",
  proprietary: "proprietary",
  redacted: "redacted",
} as const;

export type DeliverableBadgeVariant = keyof typeof DELIVERABLE_BADGE_VARIANT;

const VARIANT_CLASS: Record<DeliverableBadgeVariant, string> = {
  public:
    "border-accent/40 bg-accent/10 text-accent",
  proprietary:
    "border-border bg-surface text-text-muted",
  redacted:
    "border-border bg-surface text-text-muted opacity-70",
};

export interface DeliverableBadgeProps {
  visibility: ProjectVisibility;
  label: string;
  className?: string;
}

export function DeliverableBadge({ visibility, label, className }: DeliverableBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs uppercase tracking-widest",
        VARIANT_CLASS[visibility],
        className
      )}
    >
      {label}
    </span>
  );
}
