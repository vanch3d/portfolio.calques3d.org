import type { Publication } from "@/types/content";
import { PublicationItem, type PublicationItemLabels } from "@/components/ui";

export interface PublicationsListLabels extends PublicationItemLabels {
  heading: string;
}

export interface PublicationsListProps {
  publications: Publication[];
  citationMap: Map<string, string>;
  labels: PublicationsListLabels;
}

export function PublicationsList({ publications, citationMap, labels }: PublicationsListProps) {
  if (publications.length === 0) return null;

  const { heading, ...itemLabels } = labels;

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
          {heading}
        </h2>
        <ul className="mt-4 divide-y divide-border">
          {publications.map((pub) => (
            <PublicationItem
              key={pub.key}
              pub={pub}
              citationHtml={citationMap.get(pub.key) ?? pub.title}
              labels={itemLabels}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
