/**
 * /publications — Full publications listing
 *
 * Rendering: dynamic (next-intl uses headers() internally, which opts the page
 * out of static generation). Caching is handled by Vercel's CDN on the edge.
 * Zotero data is revalidated on demand via /api/revalidate.
 */

import { getTranslations } from "next-intl/server";
import { getAllPublications } from "@/lib/api";
import { formatCitations } from "@/lib/csl";
import { PageHeader } from "@/components/layout";
import { SectionHeader } from "@/components/layout";
import { PublicationCard, type PublicationCardLabels } from "./PublicationCard";
import type { Publication } from "@/types/content";

export const metadata = { title: "Publications" };

function groupByYear(publications: Publication[]): Map<number, Publication[]> {
  const groups = new Map<number, Publication[]>();
  for (const pub of publications) {
    const existing = groups.get(pub.year) ?? [];
    existing.push(pub);
    groups.set(pub.year, existing);
  }
  return groups;
}

export default async function PublicationsPage() {
  const [t, publications] = await Promise.all([
    getTranslations("PublicationsPage"),
    getAllPublications(),
  ]);

  const citationMap = await formatCitations(publications);

  const byYear = groupByYear(publications);
  const years = [...byYear.keys()].sort((a, b) => b - a);

  const cardLabels: PublicationCardLabels = {
    doi: t("doi_label"),
    types: {
      conferencePaper: t("type_conference"),
      journalArticle: t("type_journal"),
      bookChapter: t("type_chapter"),
      thesis: t("type_thesis"),
      report: t("type_report"),
      patent: t("type_patent"),
    },
  };

  return (
    <div>
      <PageHeader
        heading={t("heading")}
        tagline={t("tagline")}
        meta={t("publications_count", { count: publications.length })}
      />
      <div className="container-page py-10">
        {years.map((year) => {
          const pubs = byYear.get(year) ?? [];
          return (
            <section
              key={year}
              aria-labelledby={`year-${year}`}
              className="mb-10"
            >
              <SectionHeader
                heading={String(year)}
                id={`year-${year}`}
                ruled
                mono
                className="mb-2"
              />
              <ul className="divide-y divide-border stagger-children">
                {pubs.map((pub) => (
                  <li key={pub.key}>
                    <PublicationCard
                      pub={pub}
                      citationHtml={citationMap.get(pub.key) ?? pub.title}
                      labels={cardLabels}
                    />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
