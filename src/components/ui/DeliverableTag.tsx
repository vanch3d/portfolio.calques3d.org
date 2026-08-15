import Link from "next/link";
import { cn } from "@/lib/utils";

const DELIVERABLE_TYPE = {
  publication: "publication",
  repo: "repo",
  presentation: "presentation",
  dataset: "dataset",
  tool: "tool",
} as const;

export type DeliverableType = keyof typeof DELIVERABLE_TYPE;

const TYPE_LABEL: Record<DeliverableType, string> = {
  publication: "pub",
  repo: "repo",
  presentation: "talk",
  dataset: "data",
  tool: "tool",
};

export interface DeliverableTagProps {
  type: DeliverableType;
  label: string;
  href?: string;
  className?: string;
}

export function DeliverableTag({ type, label, href, className }: DeliverableTagProps) {
  const prefix = (
    <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
      {TYPE_LABEL[type]}
    </span>
  );

  const inner = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border border-border px-2 py-0.5 text-xs text-text-muted",
        href && "hover:border-accent hover:text-accent",
        className
      )}
    >
      {prefix}
      <span className="text-text">{label}</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline">
        {inner}
      </Link>
    );
  }

  return inner;
}
