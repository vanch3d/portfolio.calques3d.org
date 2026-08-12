/**
 * /research/publications/[key] — Individual publication detail page.
 *
 * Rendering: SSG
 * All Zotero item keys are known at build time via generateStaticParams().
 * dynamicParams = false prevents runtime 404 attempts for unknown keys.
 *
 * This page solves two problems with the inline viewer on the list page:
 *  1. UX — a focused single-publication view is cleaner than an expanding
 *     viewer card in a long scrolling list.
 *  2. CORS — the viewer (pdf.js) cannot fetch GitHub Release assets
 *     directly. This page serves a PdfControls island that uses the
 *     /api/pdf-proxy route to stream the PDF from the server side.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getAllPublications, getPublicationByKey } from "@/lib/api";
import { formatCitations } from "@/lib/csl";
import type { PublicationType } from "@/types/content";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PublicationDetail, type PublicationDetailLabels } from "./PublicationDetail";

export const dynamicParams = false;

export async function generateStaticParams() {
  const publications = await getAllPublications();
  return publications.map((pub) => ({ key: pub.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;
  const publication = await getPublicationByKey(key);
  if (!publication) return {};

  const t = await getTranslations("Publications");
  return {
    title: `${t("heading")} | ${publication.title}`,
    description: publication.abstract ?? publication.title,
  };
}

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;

  const [publication, t, navT] = await Promise.all([
    getPublicationByKey(key),
    getTranslations("Publications"),
    getTranslations("Navigation"),
  ]);

  if (!publication) notFound();

  const citations = await formatCitations([publication]);
  const citation = citations.get(publication.key) ?? publication.title;

  const typeLabels: Record<PublicationType, string> = {
    conferencePaper: t("type_conferencePaper"),
    journalArticle:  t("type_journalArticle"),
    bookChapter:     t("type_bookChapter"),
    thesis:          t("type_thesis"),
    report:          t("type_report"),
    patent:          t("type_patent"),
  };

  const labels: PublicationDetailLabels = {
    doiLinkLabel:     t("doi_link_label"),
    pdfLinkLabel:     t("pdf_link_label"),
    pdfDownloadLabel: t("pdf_download_label"),
    typeLabel:        (type: PublicationType) => typeLabels[type],
    viewer: {
      pdfLinkLabel:     t("pdf_link_label"),
      pdfDownloadLabel: t("pdf_download_label"),
      pdfLoading:       t("pdf_loading"),
      pdfError:         t("pdf_error"),
      pdfPageTemplate:  t("pdf_page"),
      pdfPrevious:      t("pdf_previous"),
      pdfNext:          t("pdf_next"),
    },
  };

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: navT("home"), href: "/" },
          { label: navT("research"), href: "/research" },
          { label: navT("publications"), href: "/research/publications" },
          { label: publication.title },
        ]}
        navLabel={navT("breadcrumb_nav_label")}
      />

      <PublicationDetail
        publication={publication}
        citation={citation}
        labels={labels}
      />
    </div>
  );
}
