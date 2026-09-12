/**
 * EraTimeline — 50/50 grid wrapper for the two era columns.
 *
 * Server component. Resolves all i18n strings and position data, then
 * passes typed props down to EraColumn. Mobile: single column, engineering
 * first (order-1), research second (order-2) — handled by EraColumn className.
 *
 * Position data is read via getResearchPositions() / getEngineeringPositions()
 * from the content layer. Era classification is owned by those utilities.
 */

import type { Route } from 'next'
import { getTranslations } from 'next-intl/server'
import { getResearchPositions, getEngineeringPositions } from '@/lib/content/positions'
import type { Position } from '@/types/content'
import { extractYear } from '@/lib/period'
import { EraColumn, type EraEntry } from './EraColumn'

function toEraEntry({ title, organisation, period }: Position): EraEntry {
  return {
    year: extractYear(period.start),
    institution: `${title}, ${organisation}`,
  }
}

export async function EraTimeline() {
  const t = await getTranslations('HomePage')

  const researchPositions = getResearchPositions().map(toEraEntry)
  const engineeringPositions = getEngineeringPositions().map(toEraEntry)

  return (
    <div className="grid grid-cols-2 gap-0 max-md:grid-cols-1">
      <EraColumn
        era="research"
        badge={t('era_research_label')}
        name={t('era_research_name')}
        summary={t('era_research_summary')}
        positions={researchPositions}
        positionsAriaLabel={t('era_research_positions_aria')}
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
        positions={engineeringPositions}
        positionsAriaLabel={t('era_engineering_positions_aria')}
        links={[{ href: '/engineering' as Route, label: t('era_engineering_link_explore') }]}
      />
    </div>
  )
}
