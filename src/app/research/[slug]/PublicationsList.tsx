import type { Publication } from "@/types/content";
import { PublicationItem, type PublicationItemLabels } from "@/components/ui";

export interface PublicationsListLabels extends PublicationItemLabels {
  heading: string;
}

export function PublicationsList({
  publications,
  citationMap,
  labels,
}: {
  publications: Publication[];
  citationMap: Map<string, string>;
  labels: PublicationsListLabels;
}) {
  if (publications.length === 0) return null;

  return (
    <section
      aria-labelledby="publications-heading"
      className="border-t border-border"
    >
      <div className="container-page py-10">
        <h2
          id="publications-heading"
          className="text-xl font-semibold text-text"
        >
          {labels.heading}
        </h2>
        <ul className="mt-4 divide-y divide-border">
          {publications.map((pub) => (
            <PublicationItem
              key={pub.key}
              pub={pub}
              citationHtml={citationMap.get(pub.key) ?? pub.title}
              labels={labels}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
