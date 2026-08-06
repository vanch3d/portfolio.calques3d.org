export interface DualNarrativeLabels {
  sectionLabel: string;
  researchEraLabel: string;
  researchEraPeriod: string;
  researchEraBody: string;
  engineeringEraLabel: string;
  engineeringEraPeriod: string;
  engineeringEraBody: string;
}

export function DualNarrative({ labels }: { labels: DualNarrativeLabels }) {
  return (
    <section
      aria-label={labels.sectionLabel}
      className="border-t border-border py-16"
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-0">
        <div className="md:pr-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-hover">
            {labels.researchEraLabel}
          </p>
          <p className="mt-1 text-sm tabular-nums text-foreground-secondary">
            {labels.researchEraPeriod}
          </p>
          <p className="mt-4 leading-relaxed text-foreground-secondary">
            {labels.researchEraBody}
          </p>
        </div>
        <div className="md:border-l md:border-border md:pl-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-hover">
            {labels.engineeringEraLabel}
          </p>
          <p className="mt-1 text-sm tabular-nums text-foreground-secondary">
            {labels.engineeringEraPeriod}
          </p>
          <p className="mt-4 leading-relaxed text-foreground-secondary">
            {labels.engineeringEraBody}
          </p>
        </div>
      </div>
    </section>
  );
}
