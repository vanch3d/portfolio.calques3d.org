import type { Publication } from "@/types/content";
import { PublicationCard, type PublicationCardLabels } from "./PublicationCard";

export interface PublicationsListLabels extends PublicationCardLabels {
  count: (n: number) => string;
  // typeLabel is a function — resolved by the parent page, not passed to the island
}

export function PublicationsList({
  publications,
  citations,
  labels,
}: {
  publications: Publication[];
  citations: Map<string, string>;
  labels: PublicationsListLabels;
}) {
  if (publications.length === 0) return null;

  // Group by year descending
  const byYear = new Map<number, Publication[]>();
  for (const pub of publications) {
    const group = byYear.get(pub.year) ?? [];
    group.push(pub);
    byYear.set(pub.year, group);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <div className="flex flex-col gap-10">
      {years.map((year) => (
        <section key={year} aria-labelledby={`year-${year}`}>
          <h2
            id={`year-${year}`}
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground-secondary border-b border-border pb-2"
          >
            {year}
            <span className="ml-2 font-normal normal-case tracking-normal">
              · {labels.count(byYear.get(year)!.length)}
            </span>
          </h2>
          <div>
            {byYear.get(year)!.map((pub) => (
              <PublicationCard
                key={pub.key}
                publication={pub}
                citation={citations.get(pub.key) ?? pub.title}
                labels={labels}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
