/**
 * /research/[slug] — Research project detail page
 *
 * Rendering: SSG
 * All slugs are known at build time from src/content/research/*.mdx.
 * Publications are fetched from Zotero at build time via the project tag.
 * dynamicParams = false prevents runtime 404 attempts.
 */

import { notFound } from "next/navigation";
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

  // Both resolved at build time via generateStaticParams
  const [MDXContent, publications] = await Promise.all([
    importResearchMDX(slug),
    project.publications
      ? getPublicationsByProject(project.publications)
      : Promise.resolve([]),
  ]);

  return (
    <main>
      <nav>
        <a href="/research">← Research</a>
      </nav>
      <ProjectHeader project={project} />
      <article>
        <MDXContent />
      </article>
      <PublicationsList publications={publications} />
    </main>
  );
}
