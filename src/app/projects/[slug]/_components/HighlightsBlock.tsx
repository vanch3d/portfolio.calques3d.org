/**
 * HighlightsBlock — Client, needs ProjectDetail.* strings
 *
 * Engineering-only. 3–5 bullet achievements, rendered above the narrative
 * prose (direction contract: "Highlights appear as the first block
 * immediately after the description, inside the narrative column").
 */

'use client'

import { useTranslations } from 'next-intl'
import { ResourceBlockSection } from './ResourceBlockSection'

type HighlightsBlockProps = {
  highlights: string[]
}

export function HighlightsBlock({ highlights }: HighlightsBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (highlights.length === 0) return null

  return (
    <ResourceBlockSection as="div" testId="highlights-block" heading={t('highlights_heading')}>
      <ul className="flex flex-col gap-xs">
        {highlights.map((highlight) => (
          <li
            key={highlight}
            className="border-l-medium border-ink-ghost pl-sm font-body text-body leading-body text-ink-secondary"
          >
            {highlight}
          </li>
        ))}
      </ul>
    </ResourceBlockSection>
  )
}
