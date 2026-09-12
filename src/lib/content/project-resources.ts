/**
 * Project resource counting
 *
 * Pure data-prep helper for the ResourceAnnotationBar: turns a project's
 * links/media fields (plus the two counts that require an async fetch —
 * publications and case studies) into a single typed count record. This is
 * the "already-computed data" a Client Component receives as a prop per
 * ADR 021 — no _components/ file counts resources itself.
 */

import type { Project } from '@/types/content'

export type ResourceCounts = {
  publications: number
  repositories: number
  caseStudies: number
  external: number
  slides: number
  gallery: number
}

export type ResourceCountsInput = {
  publicationsCount: number
  caseStudiesCount: number
}

/**
 * Builds the full resource count record for a project.
 *
 * - `repositories` — number of GitHub links
 * - `external` — external links plus a live-deployment link, if present
 * - `slides` / `gallery` — 1 when the media field is a non-empty string, else 0
 *   (these are presence flags, not literal counts — there is only ever one
 *   slide deck or one gallery album per project)
 */
export function buildResourceCounts(
  project: Project,
  { publicationsCount, caseStudiesCount }: ResourceCountsInput
): ResourceCounts {
  const githubCount = project.links.github?.length ?? 0
  const externalCount = (project.links.external?.length ?? 0) + (project.links.live ? 1 : 0)
  const slidesCount = project.media?.slides ? 1 : 0
  const galleryCount = project.media?.gallery ? 1 : 0

  return {
    publications: publicationsCount,
    repositories: githubCount,
    caseStudies: caseStudiesCount,
    external: externalCount,
    slides: slidesCount,
    gallery: galleryCount,
  }
}
