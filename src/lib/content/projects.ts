/**
 * Unified project resolver
 *
 * Single entry point for /projects/[slug] — tries the research content
 * directory first, then engineering, and returns a discriminated union so
 * callers can narrow on `type` without re-checking both content sources.
 *
 * Server-side only — delegates to research.ts / engineering.ts, which use
 * the Node.js fs module.
 * Rendering: SSG (see ADR 020)
 */

import {
  getResearchProjectBySlug,
  getResearchSlugs,
  getAllResearchProjects,
} from '@/lib/content/research'
import {
  getEngineeringProjectBySlug,
  getEngineeringSlugs,
  getAllEngineeringProjects,
} from '@/lib/content/engineering'
import type { ResearchProject, EngineeringProject } from '@/types/content'

export type ProjectResolution =
  | { project: ResearchProject; type: 'research' }
  | { project: EngineeringProject; type: 'engineering' }

/**
 * Resolves a project by slug, trying research first, then engineering.
 * Returns null if no project with this slug exists in either directory.
 */
export function getProjectBySlug(slug: string): ProjectResolution | null {
  const research = getResearchProjectBySlug(slug)
  if (research) return { project: research, type: 'research' }

  const engineering = getEngineeringProjectBySlug(slug)
  if (engineering) return { project: engineering, type: 'engineering' }

  return null
}

/**
 * Returns all project slugs across both content directories — used by
 * generateStaticParams in /projects/[slug].
 */
export function getAllProjectSlugs(): string[] {
  return [...getResearchSlugs(), ...getEngineeringSlugs()]
}

/**
 * All projects belonging to a position, across both content sources, sorted
 * by period.start ascending. Used by SiblingNav (via pickSiblings in
 * _utils/project-utils.ts) to find the previous/next project at the same
 * position and the total count.
 */
export function getProjectsByPosition(positionSlug: string): ProjectResolution[] {
  const research: ProjectResolution[] = getAllResearchProjects()
    .filter((project) => project.position === positionSlug)
    .map((project) => ({ project, type: 'research' as const }))
  const engineering: ProjectResolution[] = getAllEngineeringProjects()
    .filter((project) => project.position === positionSlug)
    .map((project) => ({ project, type: 'engineering' as const }))

  return [...research, ...engineering].sort((a, b) =>
    a.project.period.start.localeCompare(b.project.period.start)
  )
}

/**
 * Every project across both content sources, in a single global chronological
 * order (period.start ascending) — regardless of era or position. Used by
 * ProjectNav to find the previous/next project on the career timeline, which
 * is a career-wide sequence, not scoped to the current project's position.
 *
 * Tie-break for identical start dates (e.g. two projects both starting in
 * 2008): the `primary` project sorts first, then title alphabetically, so
 * ordering is fully deterministic.
 */
export function getAllProjectsChronological(): ProjectResolution[] {
  const research: ProjectResolution[] = getAllResearchProjects().map((project) => ({
    project,
    type: 'research' as const,
  }))
  const engineering: ProjectResolution[] = getAllEngineeringProjects().map((project) => ({
    project,
    type: 'engineering' as const,
  }))

  return [...research, ...engineering].sort((a, b) => {
    const byStart = a.project.period.start.localeCompare(b.project.period.start)
    if (byStart !== 0) return byStart

    const byPrimary = Number(!!b.project.primary) - Number(!!a.project.primary)
    if (byPrimary !== 0) return byPrimary

    return a.project.title.localeCompare(b.project.title)
  })
}
