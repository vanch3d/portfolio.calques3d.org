import Link from "next/link";
import type { Route } from "next";

export interface HeroLabels {
  name: string;
  role: string;
  thesis: string;
  currentlyLabel: string;
  currentlyPosition: string;
  currentlyHref: string;
}

export function Hero({ labels }: { labels: HeroLabels }) {
  const { name, role, thesis, currentlyLabel, currentlyPosition, currentlyHref } = labels;

  return (
    <div className="border-b border-border">
      <div className="container-page py-14 sm:py-20">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">
          {role}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          {name}
        </h1>
        <p className="mt-4 max-w-[50ch] text-2xl font-medium text-text sm:text-3xl">
          {thesis}
        </p>
        <div className="mt-6">
          <Link
            href={currentlyHref as Route}
            className="inline-flex items-center gap-2 rounded border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/20"
          >
            <span className="font-mono text-xs uppercase tracking-widest">
              {currentlyLabel}
            </span>
            <span>{currentlyPosition} →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
