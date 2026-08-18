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
import { PageHeader, SectionHeader } from "@/components/layout";
import {
  PublicationItem,
  PdfPanelProvider,
  type PublicationItemLabels,
  type PdfPanelLabels,
} from "@/components/ui";
import { groupByYear } from "@/lib/publications";

export const metadata = { title: "Publications" };

export default async function PublicationsPage() {
  const [t, publications] = await Promise.all([
    getTranslations("PublicationsPage"),
    getAllPublications(),
  ]);

  const panelT = await getTranslations("PdfPanel");

  const citationMap = await formatCitations(publications);

  const itemLabels: PublicationItemLabels = {
    abstract: t("abstract"),
    viewPdfNewTab: t("view_pdf_new_tab"),
    viewPdf: t("view_pdf"),
  };

  const panelLabels: PdfPanelLabels = {
    close: panelT("close"),
    loading: panelT("loading"),
    iframeTitle: panelT("iframe_title"),
  };

  const byYear = groupByYear(publications);

  return (
    <PdfPanelProvider labels={panelLabels}>
      <div>
        <PageHeader
          heading={t("heading")}
          tagline={t("tagline")}
          meta={t("publications_count", { count: publications.length })}
        />
        <div className="container-page py-10">
          {byYear.map(([year, pubs]) => (
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
                  <PublicationItem
                    key={pub.key}
                    pub={pub}
                    citationHtml={citationMap.get(pub.key) ?? pub.title}
                    labels={itemLabels}
                    pdfMode="panel"
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </PdfPanelProvider>
  );
}
