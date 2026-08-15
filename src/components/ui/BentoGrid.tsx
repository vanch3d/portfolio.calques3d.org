import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// ─── BentoGrid ───────────────────────────────────────────────────────────────

export interface BentoGridProps {
  children: ReactNode;
  columns?: 2 | 3;
  className?: string;
}

export function BentoGrid({ children, columns = 2, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── BentoCard ───────────────────────────────────────────────────────────────

const BENTO_SIZE = {
  standard: "",
  tall: "sm:row-span-2",
} as const;

export type BentoCardSize = keyof typeof BENTO_SIZE;

export interface BentoCardProps {
  heading: string;
  body?: string;
  label?: string;
  href?: string;
  linkLabel?: string;
  size?: BentoCardSize;
  className?: string;
  children?: ReactNode;
}

export function BentoCard({
  heading,
  body,
  label,
  href,
  linkLabel,
  size = "standard",
  className,
  children,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border bg-surface p-6",
        BENTO_SIZE[size],
        className
      )}
    >
      {label && (
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
          {label}
        </p>
      )}
      <h3 className="text-base font-semibold text-text">{heading}</h3>
      {body && <p className="mt-2 text-sm text-text-muted">{body}</p>}
      {children && <div className="mt-4 flex-1">{children}</div>}
      {href && linkLabel && (
        <Link
          href={href}
          className="mt-auto pt-4 text-sm font-medium text-accent hover:underline"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
