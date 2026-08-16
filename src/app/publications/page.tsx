/**
 * /publications — Full publications listing
 *
 * Rendering: dynamic (next-intl uses headers() internally, which opts the page
 * out of static generation). Caching is handled by Vercel's CDN on the edge.
 * Zotero data is revalidated on demand via /api/revalidate.
 */

import { getTranslations } from "next-intl/server";
import { getAllPublications } from "@/lib/api";
import { PageHeader } from "@/components/layout";
import { PublicationItem } from "@/components/ui";

export const metadata = { title: "Publications" };

export default async function PublicationsPage() {
  const [t, publications] = await Promise.all([
    getTranslations("PublicationsPage"),
    getAllPublications(),
  ]);

  const itemLabels = { abstract: t("abstract") };

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
            <PublicationItem key={pub.key} pub={pub} labels={itemLabels} />
          ))}
        </ul>
      </section>
    </div>
  );
}
