import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAllPublications } from "@/lib/api/zotero";
import { formatCitations } from "@/lib/csl";
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
  const t = await getTranslations("Publications");

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
    abstract:     t("abstract"),
    showAbstract: t("show_abstract"),
    hideAbstract: t("hide_abstract"),
    doiLinkLabel: t("doi_link_label"),
    typeLabel:    (type: PublicationType) => typeLabels[type],
    count:        (n: number) => t("count", { count: n }),
    // Nested labels for the PdfControls island — all serialisable strings
    pdf: {
      pdfLinkLabel:     t("pdf_link_label"),
      pdfDownloadLabel: t("pdf_download_label"),
      viewPdf:          t("pdf_view"),
      closePdf:         t("pdf_close"),
      pdfLoading:       t("pdf_loading"),
      pdfError:         t("pdf_error"),
      pdfPage:          (current, total) => t("pdf_page", { current, total }),
      pdfPrevious:      t("pdf_previous"),
      pdfNext:          t("pdf_next"),
    },
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          {t("heading")}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-foreground-secondary leading-relaxed">
          {t("description")}
        </p>
      </header>

      <PublicationsList
        publications={publications}
        citations={citations}
        labels={labels}
      />
    </div>
  );
}
