import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { ResearchProject } from "@/types/content";

export interface FeaturedWorkLabels {
  heading: string;
  sectionLabel: string;
  researchLabel: string;
  engineeringLabel: string;
  engineeringTitle: string;
  engineeringPeriod: string;
  engineeringBody: string;
  engineeringLink: string;
  publicationLabel: string;
  publicationBody: string;
  ongoing: string;
}

export interface FeaturedWorkProps {
  featuredResearch: ResearchProject;
  labels: FeaturedWorkLabels;
}

export function FeaturedWork({ featuredResearch, labels }: FeaturedWorkProps) {
  const researchEnd = featuredResearch.period.end ?? labels.ongoing;

  return (
    <section
      aria-label={labels.sectionLabel}
      className="border-t border-border py-16"
    >
      <h2 className="text-xl font-semibold text-foreground">{labels.heading}</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Research card */}
        <article className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 transition-shadow hover:shadow-md">
          <Badge variant="type">{labels.researchLabel}</Badge>
          <div className="flex-1">
            <p className="text-xs tabular-nums text-foreground-secondary">
              {featuredResearch.period.start}–{researchEnd}
            </p>
            <h3 className="mt-1 text-base font-semibold text-foreground">
              {featuredResearch.title}
            </h3>
            {featuredResearch.abbr && (
              <p className="mt-0.5 text-sm text-foreground-secondary">
                {featuredResearch.abbr}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {featuredResearch.tags.slice(0, 3).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <Link
            href={`/research/${featuredResearch.slug}`}
            className="mt-auto text-sm font-medium text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            View project →
          </Link>
        </article>

        {/* Engineering card */}
        <article className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 transition-shadow hover:shadow-md">
          <Badge variant="type">{labels.engineeringLabel}</Badge>
          <div className="flex-1">
            <p className="text-xs tabular-nums text-foreground-secondary">
              {labels.engineeringPeriod}
            </p>
            <h3 className="mt-1 text-base font-semibold text-foreground">
              {labels.engineeringTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
              {labels.engineeringBody}
            </p>
          </div>
          <Link
            href="/engineering"
            className="mt-auto text-sm font-medium text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {labels.engineeringLink} →
          </Link>
        </article>

        {/* Publication card */}
        <article className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 transition-shadow hover:shadow-md">
          <Badge variant="type">{labels.publicationLabel}</Badge>
          <div className="flex-1">
            <p className="mt-1 text-sm leading-relaxed text-foreground-secondary">
              {labels.publicationBody}
            </p>
          </div>
          <Link
            href="/research/publications"
            className="mt-auto text-sm font-medium text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            View publications →
          </Link>
        </article>
      </div>
    </section>
  );
}
