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

import { getResearchProjectBySlug, getResearchSlugs } from '@/lib/content/research'
import { getEngineeringProjectBySlug, getEngineeringSlugs } from '@/lib/content/engineering'
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
