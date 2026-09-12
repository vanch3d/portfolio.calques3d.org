/**
 * EraTimeline — 50/50 grid wrapper for the two era columns.
 *
 * Server component. Resolves all i18n strings and project data, then
 * passes typed props down to EraColumn. Mobile: single column, engineering
 * first (order-1), research second (order-2) — handled by EraColumn className.
 *
 * IA amendment (2026-09-12): sources PROJECTS, not positions — see EraColumn's
 * doc comment for the rationale (interim fix, pending full design review, for
 * an era → position → project → case-study hierarchy that put the actual
 * reading focus two clicks from the homepage). Project data comes from
 * getAllProjectsChronological() (src/lib/content/projects.ts), the same
 * career-wide ordering ProjectNav uses.
 *
 * No visibility filtering here: every project — including "redacted" ones
 * like Intrica — already has a real /projects/[slug] page and is already
 * linked from ProjectNav, so hiding it from the homepage while it's reachable
 * elsewhere would be the actual inconsistency. (The schema's "redacted: card
 * only, no detail page" comment doesn't reflect current behaviour — no route
 * enforces it — that's a separate pre-existing gap, not something this
 * component should paper over.)
 */

import type { Route } from 'next'
import { getTranslations } from 'next-intl/server'
import { getAllProjectsChronological } from '@/lib/content/projects'
import type { ProjectResolution } from '@/lib/content/projects'
import { extractYear } from '@/lib/period'
import { projectHref } from '@/lib/routes'
import { EraColumn, type EraEntry } from './EraColumn'

function toEraEntry({ project }: ProjectResolution): EraEntry {
  return {
    year: extractYear(project.period.start),
    label: project.title,
    href: projectHref(project.slug) as Route,
  }
}

export async function EraTimeline() {
  const t = await getTranslations('HomePage')

  const allProjects = getAllProjectsChronological()
  // getAllProjectsChronological sorts ascending (oldest first); the era
  // columns read newest-first, top to bottom.
  const researchProjects = allProjects
    .filter((p) => p.type === 'research')
    .reverse()
    .map(toEraEntry)
  const engineeringProjects = allProjects
    .filter((p) => p.type === 'engineering')
    .reverse()
    .map(toEraEntry)

  return (
    <div className="grid grid-cols-2 gap-0 max-md:grid-cols-1">
      <EraColumn
        era="research"
        badge={t('era_research_label')}
        name={t('era_research_name')}
        summary={t('era_research_summary')}
        projects={researchProjects}
        projectsAriaLabel={t('era_research_positions_aria')}
        links={[
          { href: '/research' as Route, label: t('era_research_link_explore') },
          { href: '/research/publications' as Route, label: t('era_research_link_publications') },
        ]}
      />
      <EraColumn
        era="engineering"
        badge={t('era_engineering_label')}
        name={t('era_engineering_name')}
        summary={t('era_engineering_summary')}
        projects={engineeringProjects}
        projectsAriaLabel={t('era_engineering_positions_aria')}
        links={[{ href: '/engineering' as Route, label: t('era_engineering_link_explore') }]}
      />
    </div>
  )
}
