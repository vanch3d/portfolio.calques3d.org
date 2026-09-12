/**
 * /projects/[slug] — route file.
 *
 * Per ADR 020 (rendering strategy) and its Implementation notes addendum
 * (Track P Decision 1): this page.tsx is the ONLY async Server Component on
 * this surface. It resolves every data dependency — project record, position,
 * case studies, and publications — and will pass fully-resolved props down to
 * the component tree. Everything under `_components/` (added in Pass 2) must
 * be either a Client Component with its own i18n namespace or a plain
 * synchronous Server Component — never async — so every one of them stays
 * mountable with cy.mountAccessible() in Cypress CT.
 *
 * Rendering: SSG for the page shell (generateStaticParams below) + a
 * per-tag unstable_cache for Zotero publications, so the shell stays static
 * while publication data can be refreshed on demand via revalidateTag.
 *
 * Pass 1 scope: route skeleton + data resolution only. The full component
 * tree (ClassificationHeader, ProjectTitle, SpecimenIllustration,
 * TaxonomyPanel, ProjectNarrative, HighlightsBlock, ResourceAnnotationBar,
 * PublicationsBlock, CaseStudiesBlock, RepositoryBlock, ExternalLinksBlock,
 * SlidesBlock, GalleryBlock, ArtefactsBlock, RestrictedBlock, SiblingNav,
 * Breadcrumb) is built in Pass 2 — see .docs/tasks/2026-09-08-project-surface.md.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/content/projects'
import { getPositionBySlug } from '@/lib/content/positions'
import { getCaseStudiesForProject } from '@/lib/content/case-studies'
import { getPublicationsByProject } from '@/lib/api/zotero'
import type { Publication } from '@/types/content'

type ProjectPageParams = { slug: string }

type ProjectPageProps = {
  params: Promise<ProjectPageParams>
}

export async function generateStaticParams(): Promise<ProjectPageParams[]> {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const resolved = getProjectBySlug(slug)
  if (!resolved) return {}

  return { title: `${resolved.project.title} — Nicolas Van Labeke` }
}

/**
 * Fetches publications for a project's Zotero tag, cached per-tag with
 * on-demand revalidation via revalidateTag("publications"). Zotero outages
 * resolve to an empty array rather than failing the page — see ADR 020.
 */
function getCachedPublications(tag: string) {
  return unstable_cache(
    async (): Promise<Publication[]> => {
      try {
        return await getPublicationsByProject(tag)
      } catch {
        return []
      }
    },
    [`publications-${tag}`],
    { tags: ['publications', `publications-${tag}`] }
  )()
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const resolved = getProjectBySlug(slug)
  if (!resolved) notFound()

  const { project, type } = resolved
  const position = getPositionBySlug(project.position)
  const caseStudies = getCaseStudiesForProject(project.slug)
  const publications = project.publications ? await getCachedPublications(project.publications) : []

  // Reserved for the Pass 2 component tree (ClassificationHeader, TaxonomyPanel,
  // CaseStudiesBlock, PublicationsBlock, SiblingNav, ...) — resolved here so the
  // route stays the single async boundary on this surface (Decision 1).
  void type
  void position
  void caseStudies
  void publications

  return (
    <main className="page-wrap py-2xl">
      <h1 className="font-display text-display leading-display text-ink italic">{project.title}</h1>
    </main>
  )
}
