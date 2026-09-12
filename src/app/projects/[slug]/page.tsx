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
 * Pass 2 component tree: ClassificationHeader, ProjectTitle,
 * SpecimenIllustration, TaxonomyPanel, ProjectNarrative, HighlightsBlock,
 * ResourceAnnotationBar, PublicationsBlock, CaseStudiesBlock,
 * RepositoryBlock, ExternalLinksBlock, SlidesBlock, GalleryBlock,
 * ArtefactsBlock, RestrictedBlock, ProjectNav, Breadcrumb — see
 * .docs/tasks/2026-09-08-project-surface.md.
 *
 * ProjectNav prev/next follow the GLOBAL chronological project order
 * (getAllProjectsChronological), not the current project's position — see
 * ProjectNav.tsx for the full rationale (this corrects a misreading of the
 * comp from an earlier pass, where prev/next were scoped to the position).
 */

import type { Metadata, Route } from 'next'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import {
  getProjectBySlug,
  getAllProjectSlugs,
  getProjectsByPosition,
  getAllProjectsChronological,
} from '@/lib/content/projects'
import { getPositionBySlug } from '@/lib/content/positions'
import { getCaseStudiesForProject } from '@/lib/content/case-studies'
import { getPublicationsByProject } from '@/lib/api/zotero'
import { importResearchMDX } from '@/lib/content/research'
import { importEngineeringMDX } from '@/lib/content/engineering'
import { extractYear, CAREER_START, ERA_TRANSITION } from '@/lib/period'
import type { PeriodDatum } from '@/lib/period'
import { buildResourceCounts } from '@/lib/content/project-resources'
import { eraHref } from '@/lib/routes'
import type { Publication } from '@/types/content'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PeriodRuler } from '@/components/ui/PeriodRuler'
import { ClassificationHeader } from './_components/ClassificationHeader'
import { ProjectTitle } from './_components/ProjectTitle'
import { TaxonomyPanel } from './_components/TaxonomyPanel'
import { ProjectNarrative } from './_components/ProjectNarrative'
import { ResourceAnnotationBar } from './_components/ResourceAnnotationBar'
import { PublicationsBlock } from './_components/PublicationsBlock'
import { CaseStudiesBlock } from './_components/CaseStudiesBlock'
import { RepositoryBlock } from './_components/RepositoryBlock'
import { ExternalLinksBlock } from './_components/ExternalLinksBlock'
import { SlidesBlock } from './_components/SlidesBlock'
import { GalleryBlock } from './_components/GalleryBlock'
import { ArtefactsBlock } from './_components/ArtefactsBlock'
import { ProjectNav } from './_components/ProjectNav'
import { pickChronologicalNeighbours } from './_utils/project-utils'

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
  const positionProjects = getProjectsByPosition(project.position)
  const chronologicalProjects = getAllProjectsChronological()
  const { prev, next } = pickChronologicalNeighbours(chronologicalProjects, project.slug)

  const MDXContent =
    type === 'research'
      ? await importResearchMDX(project.slug)
      : await importEngineeringMDX(project.slug)

  const t = await getTranslations('ProjectDetail')
  const eraLabel = type === 'research' ? t('era_research_label') : t('era_engineering_label')

  const currentYear = new Date().getFullYear()
  const periodStartYear = Number(extractYear(project.period.start))
  const periodEndYear = project.period.end ? Number(extractYear(project.period.end)) : currentYear

  const organisation = project.institution ?? position?.organisation ?? ''
  const location = project.location ?? position?.location ?? ''
  const positionLabel = position?.department ?? organisation

  const roleOrFunding =
    type === 'research'
      ? project.funding
        ? ({ kind: 'funding', value: project.funding } as const)
        : null
      : (project.role_title ?? position?.title)
        ? ({ kind: 'role', value: project.role_title ?? position?.title ?? '' } as const)
        : null

  const subtitle = [roleOrFunding?.value, organisation].filter(Boolean).join(' · ')

  const resourceCounts = buildResourceCounts(project, {
    publicationsCount: publications.length,
    caseStudiesCount: caseStudies.length,
  })

  const highlights = type === 'engineering' ? (project.highlights ?? []) : []
  const artefacts = type === 'engineering' ? (project.artefacts ?? []) : []

  const ongoing = project.status === 'ongoing'
  const careerDatums: PeriodDatum[] = [
    { year: CAREER_START, role: 'default' },
    { year: ERA_TRANSITION, role: 'transition' },
    { year: periodStartYear, role: 'project-start' },
    ...(project.period.end
      ? ([
          { year: periodEndYear, role: 'project-end' },
          { year: currentYear, role: 'default' },
        ] as const)
      : ([{ year: currentYear, role: 'present', label: t('period_present_label') }] as const)),
  ]

  return (
    <main className="page-wrap py-2xl">
      <Breadcrumb
        items={[
          { label: 'Nicolas Van Labeke', href: '/' as Route },
          { label: eraLabel, href: eraHref(type) as Route },
        ]}
        current={project.title}
      />

      <ClassificationHeader
        type={type}
        status={project.status}
        primary={project.primary}
        period={{ start: periodStartYear, end: periodEndYear }}
        contextLabel={project.title}
      />

      <ProjectTitle title={project.title} subtitle={subtitle} coverUrl={project.media?.cover} />

      <div className="grid gap-lg py-lg lg:grid-cols-[280px_1fr]">
        <TaxonomyPanel
          type={type}
          status={project.status}
          roleOrFunding={roleOrFunding}
          client={type === 'engineering' ? project.client : undefined}
          organisation={organisation}
          location={location}
          period={{ start: project.period.start, end: project.period.end }}
          visibility={project.visibility}
          tags={project.tags}
        />

        <div>
          <ProjectNarrative highlights={highlights}>
            {project.description}
            <MDXContent />
          </ProjectNarrative>

          <ResourceAnnotationBar counts={resourceCounts} />

          {type === 'engineering' ? (
            <>
              <CaseStudiesBlock projectSlug={project.slug} caseStudies={caseStudies} />
              <RepositoryBlock repos={project.links.github ?? []} />
              <ArtefactsBlock artefacts={artefacts} visibility={project.visibility} />
              <ExternalLinksBlock links={project.links.external ?? []} live={project.links.live} />
              <SlidesBlock slidesUrl={project.media?.slides} />
            </>
          ) : (
            <>
              <PublicationsBlock publications={publications} />
              <GalleryBlock galleryAlbum={project.media?.gallery} />
              <SlidesBlock slidesUrl={project.media?.slides} />
              <ExternalLinksBlock links={project.links.external ?? []} live={project.links.live} />
            </>
          )}
        </div>
      </div>

      <footer className="mt-xl border-t-heavy border-ink pt-lg">
        <p className="mb-md label text-ink-ghost">{t('footer_career_timeline_label')}</p>
        <PeriodRuler
          domain={{ start: CAREER_START, end: currentYear }}
          datums={careerDatums}
          span={{ from: periodStartYear, to: periodEndYear }}
          ongoing={ongoing}
          contextLabel={project.title}
        />

        <ProjectNav
          prev={prev}
          next={next}
          positionLabel={positionLabel}
          positionCount={positionProjects.length}
        />
      </footer>
    </main>
  )
}
