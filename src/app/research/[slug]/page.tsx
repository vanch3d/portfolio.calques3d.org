/**
 * /research/[slug] — Research project detail page
 *
 * Rendering: SSG
 * All slugs are known at build time from src/content/research/*.mdx.
 * Publications are fetched from Zotero at build time via the project tag.
 * dynamicParams = false prevents runtime 404 attempts.
 */

import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getResearchSlugs,
  getResearchProjectBySlug,
  importResearchMDX,
} from "@/lib/content";
import { getPublicationsByProject } from "@/lib/api";
import { formatCitations } from "@/lib/csl";
import {
  Breadcrumb,
  type BreadcrumbItem,
  Tag,
  GlassPanel,
  PdfPanelProvider,
  type PdfPanelLabels,
} from "@/components/ui";
import { joinParts, formatPeriod } from "@/lib/format";
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
}) {
  const { slug } = await params;
  const project = getResearchProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `Research project: ${project.title} (${project.period.start}–${project.period.end ?? "ongoing"})`,
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

  const [MDXContent, publications, researchT, pubT, panelT] = await Promise.all([
    importResearchMDX(slug),
    project.publications
      ? getPublicationsByProject(project.publications)
      : Promise.resolve([]),
    getTranslations("ResearchPage"),
    getTranslations("Publications"),
    getTranslations("PdfPanel"),
  ]);

  const citationMap = await formatCitations(publications);

  const periodStr = formatPeriod(
    project.period.start.slice(0, 4),
    project.period.end?.slice(0, 4),
    researchT("ongoing")
  );

  const headerLabels = { period: periodStr };

  const pubLabels = {
    heading: pubT("heading"),
    abstract: pubT("abstract"),
    viewPdfNewTab: pubT("view_pdf_new_tab"),
    viewPdf: pubT("view_pdf"),
  };

  const panelLabels: PdfPanelLabels = {
    close: panelT("close"),
    loading: panelT("loading"),
    iframeTitle: panelT("iframe_title"),
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: researchT("breadcrumb_home"), href: "/" },
    { label: researchT("breadcrumb_research"), href: "/research" },
    { label: project.title },
  ];

  return (
    <div>
      <div className="container-page pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <ProjectHeader project={project} labels={headerLabels} />

      <div className="container-page py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
          <article className="prose prose-width min-w-0">
            <MDXContent />
          </article>

          <aside>
            <GlassPanel
              className="lg:sticky lg:h-fit lg:overflow-y-auto"
              style={{
                top: "calc(var(--nav-height) + 24px)",
                maxHeight: "calc(100vh - var(--nav-height) - 48px)",
              } satisfies CSSProperties}
            >
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    {researchT("period_label")}
                  </dt>
                  <dd className="mt-1 font-mono tabular-nums text-text">{periodStr}</dd>
                </div>

                {project.institution && (
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-text-muted">
                      {researchT("institution_label")}
                    </dt>
                    <dd className="mt-1 text-text">{project.institution}</dd>
                  </div>
                )}

                {project.funding && (
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-text-muted">
                      {researchT("funding_label")}
                    </dt>
                    <dd className="mt-1 text-text">{project.funding}</dd>
                  </div>
                )}
              </dl>

              {project.tags.length > 0 && (
                <div className="mt-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    {researchT("topics_label")}
                  </p>
                  <ul
                    className="mt-2 flex flex-wrap gap-1"
                    aria-label={researchT("topics_label")}
                  >
                    {project.tags.map((tag) => (
                      <li key={tag}>
                        <Tag variant="mono">{tag}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.links.github && project.links.github.length > 0 && (
                <div className="mt-5">
                  <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    {researchT("repositories_label")}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {project.links.github.map((repo) => (
                      <li key={repo}>
                        <a
                          href={`https://github.com/${repo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-sm text-accent hover:underline"
                        >
                          {joinParts(["github.com", repo], "/")}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </GlassPanel>
          </aside>
        </div>
      </div>

      <PdfPanelProvider labels={panelLabels}>
        <PublicationsList
          publications={publications}
          citationMap={citationMap}
          labels={pubLabels}
          pdfMode="panel"
        />
      </PdfPanelProvider>
    </div>
  );
}
