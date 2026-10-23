// Builds ArcSprinkleContent from project metadata for CareerArc's annotation
// slots. Slot geometry lives in CareerArc.tsx; this produces the display text.

import type { ResearchProject, EngineeringProject } from '@/types/content'
import { formatPeriod, extractYear } from '@/lib/period'
import type { ArcSprinkleContent } from '@/app/_components/CareerArc'

type Project = ResearchProject | EngineeringProject

/**
 * `currentYear` resolves an ongoing project's (period.end === null)
 * periodEndYear to "now", for the duration indicator — not the display text,
 * which already uses `present` via formatPeriod.
 */
export function buildSprinkle(
  project: Project,
  present: string,
  currentYear: number
): ArcSprinkleContent {
  return {
    title: `${project.abbr ?? project.title} · ${formatPeriod(project.period.start, project.period.end, present)}`,
    subtitle: project.tags.slice(0, 3).join(' · '),
    periodStartYear: Number(extractYear(project.period.start)),
    periodEndYear: project.period.end ? Number(extractYear(project.period.end)) : currentYear,
  }
}

/**
 * Selects a project whose period contains idealYear, preferring featured
 * candidates (random within a tier). page.tsx is `force-static`, so this
 * runs once at build time — the choice is frozen into the generated HTML.
 * Returns null when no project overlaps idealYear.
 */
export function pickSprinkle(
  projects: Project[],
  idealYear: string,
  present: string,
  currentYear: number
): ArcSprinkleContent | null {
  const year = extractYear(idealYear)
  const candidates = projects.filter((p) => {
    const start = extractYear(p.period.start)
    const end = p.period.end ? extractYear(p.period.end) : '9999'
    return start <= year && year <= end
  })

  if (candidates.length === 0) return null

  const featured = candidates.filter((p) => p.featured)
  const pool = featured.length > 0 ? featured : candidates
  const picked = pool[Math.floor(Math.random() * pool.length)]

  return buildSprinkle(picked, present, currentYear)
}
