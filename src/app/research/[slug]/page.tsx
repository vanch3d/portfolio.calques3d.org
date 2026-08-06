/**
 * /research/[slug] — Research project detail page
 *
 * Rendering: SSG
 * All slugs are known at build time from src/content/research/*.mdx.
 * Publications are fetched from Zotero at build time via the project tag.
 * dynamicParams = false prevents runtime 404 attempts.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getResearchSlugs,
  getResearchProjectBySlug,
  importResearchMDX,
} from "@/lib/content";
import { getPublicationsByProject } from "@/lib/api";
import { formatCitations } from "@/lib/csl";
import type { PublicationType } from "@/types/content";
import { ProjectHeader } from "./ProjectHeader";
import { PublicationsList } from "./PublicationsList";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getResearchSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getResearchProjectBySlug(slug);
  if (!project) return {};
  const t = await getTranslations("ResearchPage");
  return {
    // "{section} | {title}" — two-level pattern per ADR 012
    title: `${t("heading")} | ${project.title}`,
    // Description is data-driven from content fields — not UI copy (ADR 006)
    description: `${project.title} — ${project.type} research project (${project.period.start}–${project.period.end ?? t("ongoing")}).`,
  };
}

export default async function ResearchProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = getResearchProjectBySlug(slug);
  if (!project) notFound();

  const [MDXContent, publications, researchT, pubT] = await Promise.all([
    importResearchMDX(slug),
    project.publications
      ? getPublicationsByProject(project.publications)
      : Promise.resolve([]),
    getTranslations("ResearchPage"),
    getTranslations("Publications"),
  ]);

  const citations = await formatCitations(publications);

  const headerLabels = {
    ongoing: researchT("ongoing"),
    periodLabel: researchT("period_label"),
    institutionLabel: researchT("institution_label"),
    fundingLabel: researchT("funding_label"),
    topicsLabel: researchT("topics_label"),
    repositoriesLabel: researchT("repositories_label"),
  };

  const typeLabels: Record<PublicationType, string> = {
    conferencePaper: pubT("type_conferencePaper"),
    journalArticle:  pubT("type_journalArticle"),
    bookChapter:     pubT("type_bookChapter"),
    thesis:          pubT("type_thesis"),
    report:          pubT("type_report"),
    patent:          pubT("type_patent"),
  };

  const pubLabels = {
    abstract:     pubT("abstract"),
    showAbstract: pubT("show_abstract"),
    hideAbstract: pubT("hide_abstract"),
    doiLinkLabel: pubT("doi_link_label"),
    typeLabel:    (type: PublicationType) => typeLabels[type],
    count:        (n: number) => pubT("count", { count: n }),
    pdf: {
      pdfLinkLabel:     pubT("pdf_link_label"),
      pdfDownloadLabel: pubT("pdf_download_label"),
      viewPdf:          pubT("pdf_view"),
      closePdf:         pubT("pdf_close"),
      pdfLoading:       pubT("pdf_loading"),
      pdfError:         pubT("pdf_error"),
      pdfPageTemplate:  pubT("pdf_page"),
      pdfPrevious:      pubT("pdf_previous"),
      pdfNext:          pubT("pdf_next"),
    },
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <nav aria-label={researchT("back_nav_label")}>
        <a href="/research" className="text-sm text-foreground-secondary hover:text-foreground">{researchT("back")}</a>
      </nav>
      <ProjectHeader project={project} labels={headerLabels} />
      <article>
        <MDXContent />
      </article>
      {publications.length > 0 && (
        <section aria-labelledby="publications-heading" className="mt-12">
          <h2
            id="publications-heading"
            className="mb-6 text-xl font-semibold tracking-tight text-foreground"
          >
            {pubT("heading")}
          </h2>
          <PublicationsList publications={publications} citations={citations} labels={pubLabels} />
        </section>
      )}
    </div>
  );
}
