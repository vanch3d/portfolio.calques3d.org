import Link from "next/link";
import type { Position } from "@/types/content";

export interface CurrentlyBannerLabels {
  sectionLabel: string;
  prefix: string;
  body: string;
  linkLabel: string;
}

export interface CurrentlyBannerProps {
  position: Position;
  labels: CurrentlyBannerLabels;
}

export function CurrentlyBanner({ position, labels }: CurrentlyBannerProps) {
  return (
    <section
      aria-label={labels.sectionLabel}
      className="border-t border-border py-12"
    >
      <div className="rounded-lg border border-border-subtle bg-surface-raised px-8 py-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent-hover">
          {labels.prefix}
        </p>
        <p className="mt-2 text-lg font-medium text-foreground">
          {position.title} at {position.organisation}
        </p>
        <p className="mt-2 leading-relaxed text-foreground">
          {labels.body}
        </p>
        <Link
          href="/engineering"
          className="mt-4 inline-block text-sm font-medium text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {labels.linkLabel}
        </Link>
      </div>
    </section>
  );
}
