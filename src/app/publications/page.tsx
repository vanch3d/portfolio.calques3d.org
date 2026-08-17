/**
 * /publications — Full publications listing
 *
 * Rendering: dynamic — next-intl calls headers() internally, which opts the
 * page out of static generation. ISR (revalidate) is intentionally deferred
 * until /api/revalidate is implemented; for now the page is fully dynamic.
 */

import { getTranslations } from "next-intl/server";
import { getAllPublications } from "@/lib/api";
import { formatCitations } from "@/lib/csl";
import { PageHeader } from "@/components/layout";
import { PublicationItem } from "@/components/ui";

export const metadata = { title: "Publications" };

export default async function PublicationsPage() {
  const [t, publications] = await Promise.all([
    getTranslations("PublicationsPage"),
    getAllPublications(),
  ]);

  const citationMap = await formatCitations(publications);

  const itemLabels = {
    abstract: t("abstract"),
    view: t("view_pdf"),
    close: t("close_pdf"),
  };

  return (
    <div>
      <PageHeader
        heading={t("heading")}
        tagline={t("tagline")}
        meta={t("publications_count", { count: publications.length })}
      />
      <section className="container-page py-10" aria-label={t("heading")}>
        <ul className="divide-y divide-border stagger-children">
          {publications.map((pub) => (
            <PublicationItem
              key={pub.key}
              pub={pub}
              citationHtml={citationMap.get(pub.key) ?? pub.title}
              labels={itemLabels}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
