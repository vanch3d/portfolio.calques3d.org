/**
 * /research/[slug] — Research project detail page
 *
 * Rendering: SSG
 * All slugs are known at build time from src/content/research/*.mdx.
 * Publications are fetched from Zotero at build time via the project tag.
 * dynamicParams = false prevents runtime 404 attempts.
 */

import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getResearchSlugs,
  getResearchProjectBySlug,
  importResearchMDX,
} from "@/lib/content";
import { getPublicationsByProject } from "@/lib/api";
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

  const [MDXContent, publications, researchT, pubT] = await Promise.all([
    importResearchMDX(slug),
    project.publications
      ? getPublicationsByProject(project.publications)
      : Promise.resolve([]),
    getTranslations("ResearchPage"),
    getTranslations("Publications"),
  ]);

  const headerLabels = {
    ongoing: researchT("ongoing"),
    periodLabel: researchT("period_label"),
    institutionLabel: researchT("institution_label"),
    fundingLabel: researchT("funding_label"),
    topicsLabel: researchT("topics_label"),
    repositoriesLabel: researchT("repositories_label"),
  };

  const pubLabels = {
    heading: pubT("heading"),
    abstract: pubT("abstract"),
  };

  return (
    <main>
      <nav>
        <a href="/research">{researchT("back")}</a>
      </nav>
      <ProjectHeader project={project} labels={headerLabels} />
      <article>
        <MDXContent />
      </article>
      <PublicationsList publications={publications} labels={pubLabels} />
    </main>
  );
}
