/**
 * Research projects content layer
 *
 * Two responsibilities:
 *  1. Listing — reads frontmatter from all .mdx files using gray-matter.
 *     Used by the /research index page and generateStaticParams.
 *  2. Detail — dynamic import() of the compiled MDX module.
 *     Used by /research/[slug] page for the rendered body.
 *
 * Server-side only — uses Node.js fs module.
 * Rendering: SSG (research content is frozen once authored)
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import type { ResearchProject } from '@/types/content'

const RESEARCH_DIR = join(process.cwd(), 'src/content/research')

/**
 * Parse frontmatter from a single .mdx file and coerce to ResearchProject.
 * The slug is derived from the filename.
 */
function parseFrontmatter(filename: string): ResearchProject {
  const raw = readFileSync(join(RESEARCH_DIR, filename), 'utf-8')
  const { data } = matter(raw)
  const slug = filename.replace(/\.mdx$/, '')

  return {
    slug,
    // Spread parsed frontmatter — fields match ResearchProject shape
    ...(data as Omit<ResearchProject, 'slug'>),
  }
}

// Content is frozen for the lifetime of a build/dev process (SSG — see file
// header), and every caller of getAllResearchProjects builds a *new* array
// via spread/filter/map, never mutating the cached elements — so caching the
// directory read across the several call sites that each want "all research
// projects" (getAllProjectsChronological, getProjectsByPosition, /research
// listing) is safe and avoids re-reading + re-parsing every .mdx file per call.
let allResearchProjectsCache: ResearchProject[] | null = null

/**
 * Returns all research projects as typed metadata objects.
 * Featured projects float to the top; within each group, sorted by period.end
 * descending (most recent first), then period.start descending.
 */
export function getAllResearchProjects(): ResearchProject[] {
  if (allResearchProjectsCache) return allResearchProjectsCache

  const files = readdirSync(RESEARCH_DIR).filter((f) => f.endsWith('.mdx'))
  const projects = files.map((f) => parseFrontmatter(f))

  allResearchProjectsCache = projects.sort((a, b) => {
    // Featured projects first
    if (a.featured !== b.featured) return a.featured ? -1 : 1

    // Then most recent end date first (null = ongoing, treated as latest)
    const aEnd = a.period.end ?? '9999'
    const bEnd = b.period.end ?? '9999'
    if (bEnd !== aEnd) return bEnd.localeCompare(aEnd)

    return b.period.start.localeCompare(a.period.start)
  })
  return allResearchProjectsCache
}

/**
 * Returns a single project's frontmatter by slug, or null if not found.
 */
export function getResearchProjectBySlug(slug: string): ResearchProject | null {
  try {
    return parseFrontmatter(`${slug}.mdx`)
  } catch {
    return null
  }
}

/**
 * Returns all valid slugs — used by generateStaticParams in /research/[slug].
 */
export function getResearchSlugs(): string[] {
  return readdirSync(RESEARCH_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

/**
 * Dynamically imports the compiled MDX module for a given slug.
 * Returns the default export (React component) for rendering the body.
 *
 * Only call this in a Server Component page — the import is resolved at
 * build time by Next.js when used with generateStaticParams.
 */
export async function importResearchMDX(slug: string) {
  // Dynamic import — Next.js resolves this at build time for SSG routes.
  // The path must be a string literal prefix for static analysis to work.
  const mod = await import(`@/content/research/${slug}.mdx`)
  return mod.default as React.ComponentType
}
