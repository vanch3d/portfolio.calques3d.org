import type { Publication } from "@/types/content";
import { PublicationItem, type PublicationItemLabels } from "./PublicationItem";

export interface PublicationsListLabels extends PublicationItemLabels {
  heading: string;
}

export interface PublicationsListProps {
  publications: Publication[];
  labels: PublicationsListLabels;
}

export function PublicationsList({ publications, labels }: PublicationsListProps) {
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
            <PublicationItem key={pub.key} pub={pub} labels={itemLabels} />
          ))}
        </ul>
      </div>
    </section>
  );
}
