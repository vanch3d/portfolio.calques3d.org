/**
 * Pure helpers for the /projects/[slug] surface.
 *
 * No data-fetching here — these operate on already-resolved arrays passed
 * in by page.tsx / ProjectDetailPage, per ADR 021 (page.tsx is the only
 * component allowed to read the filesystem).
 */

import type { ProjectResolution } from '@/lib/content/projects'

export type ChronologicalNeighbours = {
  prev: ProjectResolution | null
  next: ProjectResolution | null
}

/**
 * Given the full career-wide chronological project list (as returned by
 * getAllProjectsChronological) and the current slug, returns the previous
 * and next project on the timeline — regardless of era or position. This is
 * the ProjectNav navigation model: prev/next follow the career timeline, not
 * "other projects at this position" (that's a separate, position-scoped
 * count — see getProjectsByPosition).
 */
export function pickChronologicalNeighbours(
  allProjects: ProjectResolution[],
  currentSlug: string
): ChronologicalNeighbours {
  const index = allProjects.findIndex((p) => p.project.slug === currentSlug)

  if (index === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: index > 0 ? allProjects[index - 1] : null,
    next: index < allProjects.length - 1 ? allProjects[index + 1] : null,
  }
}

export type SpecimenPosition = {
  index: number
  total: number
}

/**
 * 1-based position of `currentSlug` within the global chronological project
 * list (same source and lookup pattern as pickChronologicalNeighbours above),
 * for the Specimen Mount mat band ("Specimen No. {index} of {total}").
 * Returns null if the slug isn't found — defensive, shouldn't happen since
 * the caller always passes the current project's own slug.
 */
export function getSpecimenPosition(
  allProjects: ProjectResolution[],
  currentSlug: string
): SpecimenPosition | null {
  const index = allProjects.findIndex((p) => p.project.slug === currentSlug)

  if (index === -1) {
    return null
  }

  return { index: index + 1, total: allProjects.length }
}

export type TagSlice = {
  visible: string[]
  moreCount: number
}

/**
 * Slices a tag list to `limit` entries, reporting how many were hidden.
 * Used to precompute the three breakpoint-specific tag lists TaxonomyPanel
 * renders (lg: all, md: top 5, sm: top 3 + "N more") — the direction
 * contract requires this be resolved without JS breakpoint detection, so
 * all three slices are rendered server-side and toggled with CSS visibility.
 */
export function sliceTags(tags: string[], limit: number): TagSlice {
  if (tags.length <= limit) {
    return { visible: tags, moreCount: 0 }
  }
  return { visible: tags.slice(0, limit), moreCount: tags.length - limit }
}
