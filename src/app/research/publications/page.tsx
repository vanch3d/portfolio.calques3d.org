import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllPublications } from "@/lib/api/zotero";
import { formatCitations } from "@/lib/csl";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PublicationsList, type PublicationsListLabels } from "./PublicationsList";
import type { PublicationType } from "@/types/content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Publications");
  return {
    title: t("heading"),
    description: t("description"),
  };
}

export default async function PublicationsPage() {
  const [t, navT] = await Promise.all([
    getTranslations("Publications"),
    getTranslations("Navigation"),
  ]);

  const publications = await getAllPublications();
  const citations = await formatCitations(publications);

  const typeLabels: Record<PublicationType, string> = {
    conferencePaper: t("type_conferencePaper"),
    journalArticle:  t("type_journalArticle"),
    bookChapter:     t("type_bookChapter"),
    thesis:          t("type_thesis"),
    report:          t("type_report"),
    patent:          t("type_patent"),
  };

  const labels: PublicationsListLabels = {
    abstract:             t("abstract"),
    showAbstract:         t("show_abstract"),
    hideAbstract:         t("hide_abstract"),
    doiLinkLabel:         t("doi_link_label"),
    pdfLinkLabel:         t("pdf_link_label"),
    pdfDownloadLabel:     t("pdf_download_label"),
    viewPublicationLabel: t("view_publication"),
    typeLabel:            (type: PublicationType) => typeLabels[type],
    count:                (n: number) => t("count", { count: n }),
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: navT("home"), href: "/" },
          { label: navT("research"), href: "/research" },
          { label: navT("publications") },
        ]}
        navLabel={navT("breadcrumb_nav_label")}
      />
      <div className="mt-6 mb-12">
        <SectionHeader heading={t("heading")} tagline={t("tagline")} />
      </div>

      <PublicationsList
        publications={publications}
        citations={citations}
        labels={labels}
      />
    </div>
  );
}
