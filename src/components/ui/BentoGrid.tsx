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
        "grid grid-cols-1 gap-4 stagger-children",
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

const HEADING_LEVEL = {
  h2: "h2",
  h3: "h3",
} as const;

export type BentoCardHeadingLevel = keyof typeof HEADING_LEVEL;

export interface BentoCardProps {
  heading: string;
  headingLevel?: BentoCardHeadingLevel;
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
  headingLevel = "h2",
  body,
  label,
  href,
  linkLabel,
  size = "standard",
  className,
  children,
}: BentoCardProps) {
  const Heading = HEADING_LEVEL[headingLevel];
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border bg-surface p-6 animate-reveal-up",
        BENTO_SIZE[size],
        className
      )}
    >
      {label && (
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-text-muted">
          {label}
        </p>
      )}
      <Heading className="text-base font-semibold text-text">{heading}</Heading>
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
