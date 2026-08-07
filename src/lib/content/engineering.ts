/**
 * Engineering projects content layer
 *
 * Two responsibilities:
 *  1. Listing — reads frontmatter from all .mdx files using gray-matter.
 *     Used by the /engineering index page and generateStaticParams.
 *  2. Detail — dynamic import() of the compiled MDX module.
 *     Used by /engineering/[slug] page for the rendered body.
 *
 * Server-side only — uses Node.js fs module.
 * Rendering: SSG (engineering content is stable once authored)
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import type { EngineeringProject } from "@/types/content";

const ENGINEERING_DIR = join(process.cwd(), "src/content/engineering");

/**
 * Parse frontmatter from a single .mdx file and coerce to EngineeringProject.
 * The slug is derived from the filename.
 */
function parseFrontmatter(filename: string): EngineeringProject {
  const raw = readFileSync(join(ENGINEERING_DIR, filename), "utf-8");
  const { data } = matter(raw);
  const slug = filename.replace(/\.mdx$/, "");

  return {
    slug,
    ...(data as Omit<EngineeringProject, "slug">),
  };
}

/**
 * Returns all engineering projects as typed metadata objects.
 * Featured projects float to the top; within each group, sorted by period.end
 * descending (most recent first), then period.start descending.
 */
export function getAllEngineeringProjects(): EngineeringProject[] {
  const files = readdirSync(ENGINEERING_DIR).filter((f) => f.endsWith(".mdx"));
  const projects = files.map((f) => parseFrontmatter(f));

  return projects.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;

    const aEnd = a.period.end ?? "9999";
    const bEnd = b.period.end ?? "9999";
    if (bEnd !== aEnd) return bEnd.localeCompare(aEnd);

    return b.period.start.localeCompare(a.period.start);
  });
}

/**
 * Returns a single project's frontmatter by slug, or null if not found.
 */
export function getEngineeringProjectBySlug(
  slug: string,
): EngineeringProject | null {
  try {
    return parseFrontmatter(`${slug}.mdx`);
  } catch {
    return null;
  }
}

/**
 * Returns all slugs for projects that have routable detail pages.
 * Excludes `redacted` projects — they show cards only, no detail page.
 * Used by generateStaticParams in /engineering/[slug].
 */
export function getEngineeringSlugs(): string[] {
  return readdirSync(ENGINEERING_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .filter((slug) => {
      const project = getEngineeringProjectBySlug(slug);
      return project !== null && project.visibility !== "redacted";
    });
}

/**
 * Dynamically imports the compiled MDX module for a given slug.
 * Returns the default export (React component) for rendering the body.
 *
 * Only call this in a Server Component page — the import is resolved at
 * build time by Next.js when used with generateStaticParams.
 */
export async function importEngineeringMDX(slug: string) {
  const mod = await import(`@/content/engineering/${slug}.mdx`);
  return mod.default as React.ComponentType;
}
