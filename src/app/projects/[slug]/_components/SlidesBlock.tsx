/**
 * SlidesBlock — Client, needs ProjectDetail.* strings
 *
 * Speakerdeck link (project.media.slides is already a full URL). Hidden
 * when absent.
 */

'use client'

import { useTranslations } from 'next-intl'
import { ResourceBlockSection } from './ResourceBlockSection'
import { ExternalAnchor } from './ExternalAnchor'

type SlidesBlockProps = {
  slidesUrl?: string
}

export function SlidesBlock({ slidesUrl }: SlidesBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (!slidesUrl) return null

  return (
    <ResourceBlockSection testId="slides-block" heading={t('slides_heading')}>
      <ExternalAnchor href={slidesUrl} className="text-ink-secondary">
        {t('view_slides')}
      </ExternalAnchor>
    </ResourceBlockSection>
  )
}
