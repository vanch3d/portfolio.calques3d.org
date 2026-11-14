/**
 * Case-study listing model: era groups for the /case-studies landing page,
 * the featured set for the home page, and the case-study count per project
 * (home-page row marker).
 *
 * `groupCaseStudiesByEra` is pure; `getCaseStudyGroups` & co. bind it to the
 * content layer. Server-side only. Rendering: SSG
 */

import { caseStudyHref } from '@/lib/routes'
import { getAllCaseStudies } from '@/lib/content/case-studies'
import { getProjectBySlug } from '@/lib/content/projects'
import type { CaseStudy } from '@/types/content'

export type CaseStudyEra = 'engineering' | 'research'

export interface CaseStudyListItem {
  caseStudy: CaseStudy
  projectName: string
  chapterCount: number
  href: string
  /** 1-based, running across groups. */
  number: number
}

export interface CaseStudyGroup {
  era: CaseStudyEra
  items: CaseStudyListItem[]
}

export interface ProjectRef {
  title: string
  type: CaseStudyEra
}

const ERA_ORDER: CaseStudyEra[] = ['engineering', 'research']

function byOrderThenTitle(a: CaseStudy, b: CaseStudy): number {
  const ao = a.order ?? Number.POSITIVE_INFINITY
  const bo = b.order ?? Number.POSITIVE_INFINITY
  if (ao !== bo) return ao - bo
  return a.title.localeCompare(b.title)
}

/**
 * Groups case studies by the era of their project (Engineering, then
 * Research), numbering entries across groups. Empty groups are omitted.
 * Throws when a case study references a project that does not exist, so a
 * broken reference fails the build instead of vanishing from the list.
 */
export function groupCaseStudiesByEra(
  caseStudies: CaseStudy[],
  resolveProject: (slug: string) => ProjectRef | null
): CaseStudyGroup[] {
  const resolved = caseStudies.map((caseStudy) => {
    const project = resolveProject(caseStudy.project)
    if (!project) {
      throw new Error(
        `Case study "${caseStudy.project}/${caseStudy.slug}" references an unknown project`
      )
    }
    return { caseStudy, project }
  })

  let number = 0
  return ERA_ORDER.flatMap((era) => {
    const items = resolved
      .filter((r) => r.project.type === era)
      .sort((a, b) => byOrderThenTitle(a.caseStudy, b.caseStudy))
      .map(({ caseStudy, project }) => ({
        caseStudy,
        projectName: project.title,
        chapterCount: caseStudy.chapters?.length ?? 0,
        href: caseStudyHref(caseStudy.project, caseStudy.slug),
        number: ++number,
      }))
    return items.length > 0 ? [{ era, items }] : []
  })
}

function resolveProjectRef(slug: string): ProjectRef | null {
  const resolution = getProjectBySlug(slug)
  return resolution ? { title: resolution.project.title, type: resolution.type } : null
}

export function getCaseStudyGroups(): CaseStudyGroup[] {
  return groupCaseStudiesByEra(getAllCaseStudies(), resolveProjectRef)
}

/** Featured case studies in landing-page order; empty when none are featured. */
export function getFeaturedCaseStudyItems(): CaseStudyListItem[] {
  return getCaseStudyGroups()
    .flatMap((g) => g.items)
    .filter((item) => item.caseStudy.featured)
}

/** Case studies per project slug; projects without any are absent. */
export function countCaseStudiesByProject(caseStudies: CaseStudy[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const { project } of caseStudies) counts.set(project, (counts.get(project) ?? 0) + 1)
  return counts
}

export function getCaseStudyCountsByProject(): Map<string, number> {
  return countCaseStudiesByProject(getAllCaseStudies())
}
