/**
 * Case studies content layer
 *
 * Two responsibilities:
 *  1. Listing — reads frontmatter from index.mdx in each case study directory.
 *     Used by listing pages and generateStaticParams.
 *  2. Detail — dynamic import() of the compiled MDX module.
 *     Used by /case-studies/[project]/[slug] for the rendered body.
 *
 * Directory convention: src/content/case-studies/{project}--{slug}/index.mdx
 * The directory name is for filesystem uniqueness only; project and slug are
 * read from frontmatter.
 *
 * Server-side only — uses Node.js fs module.
 * Rendering: SSG
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import type { CaseStudy } from "@/types/content";

const CASE_STUDIES_DIR = join(process.cwd(), "src/content/case-studies");

/**
 * Parse frontmatter from a case study's index.mdx.
 * Returns null if the directory has no index.mdx (draft source folder).
 */
function parseFrontmatter(dirName: string): CaseStudy | null {
  const indexPath = join(CASE_STUDIES_DIR, dirName, "index.mdx");
  if (!existsSync(indexPath)) return null;

  const raw = readFileSync(indexPath, "utf-8");
  const { data } = matter(raw);

  return data as CaseStudy;
}

/**
 * Returns all published and draft case studies as typed metadata objects.
 * Featured case studies float to the top.
 */
export function getAllCaseStudies(): CaseStudy[] {
  const dirs = readdirSync(CASE_STUDIES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  const caseStudies = dirs
    .map((dir) => parseFrontmatter(dir))
    .filter((cs): cs is CaseStudy => cs !== null);

  return caseStudies.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}

/**
 * Returns case studies belonging to a specific project.
 */
export function getCaseStudiesForProject(projectSlug: string): CaseStudy[] {
  return getAllCaseStudies().filter((cs) => cs.project === projectSlug);
}

/**
 * Returns a single case study by project + slug, or null if not found.
 */
export function getCaseStudyBySlug(
  project: string,
  slug: string
): CaseStudy | null {
  const dirName = `${project}--${slug}`;
  return parseFrontmatter(dirName);
}

/**
 * Returns all [project, slug] pairs for generateStaticParams.
 */
export function getCaseStudyParams(): { project: string; slug: string }[] {
  return getAllCaseStudies().map((cs) => ({
    project: cs.project,
    slug: cs.slug,
  }));
}

/**
 * Dynamically imports the compiled MDX module for a given case study.
 * Returns the default export (React component) for rendering the body.
 *
 * Only call this in a Server Component page — the import is resolved at
 * build time by Next.js when used with generateStaticParams.
 */
export async function importCaseStudyMDX(project: string, slug: string) {
  const mod = await import(`@/content/case-studies/${project}--${slug}/index.mdx`);
  return mod.default as React.ComponentType;
}
