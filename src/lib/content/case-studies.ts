/**
 * Case studies content layer
 *
 * Two kinds of case study, told apart by `chapters` in index.mdx frontmatter:
 *  - flat      — index.mdx alone, one page: /case-studies/{project}/{slug}
 *  - chaptered — index.mdx is the hub (+ optional intro/outro files); each
 *                declared chapter file is its own route:
 *                /case-studies/{project}/{slug}/{chapter}
 *
 * Directory convention: src/content/case-studies/{anything}/index.mdx
 * The directory name is a filesystem label only. The URL segments (project,
 * slug, chapter slug) always come from frontmatter, so folders are located by
 * scanning, never by constructing a name.
 *
 * Server-side only — uses Node.js fs module.
 * Rendering: SSG
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import type { CaseStudy, CaseStudyChapter } from '@/types/content'

const CASE_STUDIES_DIR = join(process.cwd(), 'src/content/case-studies')

interface CaseStudyEntry {
  dir: string
  meta: CaseStudy
}

/** Scans every subdirectory with an index.mdx. Directories without one are ignored. */
function readEntries(): CaseStudyEntry[] {
  return readdirSync(CASE_STUDIES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .flatMap((e) => {
      const indexPath = join(CASE_STUDIES_DIR, e.name, 'index.mdx')
      if (!existsSync(indexPath)) return []
      const { data } = matter(readFileSync(indexPath, 'utf-8'))
      return [{ dir: e.name, meta: data as CaseStudy }]
    })
}

function findEntry(project: string, slug: string): CaseStudyEntry | null {
  return readEntries().find((e) => e.meta.project === project && e.meta.slug === slug) ?? null
}

/**
 * Returns all case studies (published and draft) as typed metadata.
 * Featured case studies float to the top.
 */
export function getAllCaseStudies(): CaseStudy[] {
  return readEntries()
    .map((e) => e.meta)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return a.title.localeCompare(b.title)
    })
}

/** Returns case studies belonging to a specific project. */
export function getCaseStudiesForProject(projectSlug: string): CaseStudy[] {
  return getAllCaseStudies().filter((cs) => cs.project === projectSlug)
}

/** Returns a single case study by project + slug, or null if not found. */
export function getCaseStudyBySlug(project: string, slug: string): CaseStudy | null {
  return findEntry(project, slug)?.meta ?? null
}

/** Folder name of a case study (needed to locate its images), or null. */
export function getCaseStudyDir(project: string, slug: string): string | null {
  return findEntry(project, slug)?.dir ?? null
}

/** All {project, slug} pairs — generateStaticParams for the case-study page. */
export function getCaseStudyParams(): { project: string; slug: string }[] {
  return getAllCaseStudies().map((cs) => ({ project: cs.project, slug: cs.slug }))
}

/** All {project, slug, chapter} triples — generateStaticParams for chapter pages. */
export function getChapterParams(): { project: string; slug: string; chapter: string }[] {
  return getAllCaseStudies().flatMap((cs) =>
    (cs.chapters ?? []).map((ch) => ({ project: cs.project, slug: cs.slug, chapter: ch.slug }))
  )
}

export function getChapterBySlug(cs: CaseStudy, chapterSlug: string): CaseStudyChapter | null {
  return (cs.chapters ?? []).find((ch) => ch.slug === chapterSlug) ?? null
}

/** Previous / next chapter around the given one (null at either end). */
export function getAdjacentChapters(
  cs: CaseStudy,
  chapterSlug: string
): { prev: CaseStudyChapter | null; next: CaseStudyChapter | null } {
  const chapters = cs.chapters ?? []
  const i = chapters.findIndex((ch) => ch.slug === chapterSlug)
  if (i === -1) return { prev: null, next: null }
  return { prev: chapters[i - 1] ?? null, next: chapters[i + 1] ?? null }
}

/**
 * Raw source (frontmatter stripped) of index.mdx, or of a co-located chapter
 * file when `file` is given (.md preferred, then .mdx). Used to scan image
 * references before rendering.
 */
export function readCaseStudySource(dir: string, file?: string): string {
  const base = join(CASE_STUDIES_DIR, dir)
  const path = file
    ? [join(base, `${file}.md`), join(base, `${file}.mdx`)].find((p) => existsSync(p))
    : join(base, 'index.mdx')
  if (!path) throw new Error(`Case study file not found: ${dir}/${file}`)
  return matter(readFileSync(path, 'utf-8')).content
}

/** Raw text of the collection intro (src/content/case-studies/index.mdx). */
export function readCollectionIntro(): string {
  return matter(readFileSync(join(CASE_STUDIES_DIR, 'index.mdx'), 'utf-8')).content
}

/**
 * Dynamic import of the compiled index.mdx for a case study.
 * Only call in a Server Component page — resolved at build time.
 */
export async function importCaseStudyMDX(dir: string) {
  const mod = await import(`@/content/case-studies/${dir}/index.mdx`)
  return mod.default as React.ComponentType<MdxProps>
}

/** Dynamic import of a chapter / intro / outro file (.md) co-located with index.mdx. */
export async function importCaseStudyFileMDX(dir: string, file: string) {
  const mod = await import(`@/content/case-studies/${dir}/${file}.md`)
  return mod.default as React.ComponentType<MdxProps>
}

/** Dynamic import of the collection intro. */
export async function importCollectionIntroMDX() {
  const mod = await import('@/content/case-studies/index.mdx')
  return mod.default as React.ComponentType<MdxProps>
}

type MdxProps = { components?: import('mdx/types').MDXComponents }
