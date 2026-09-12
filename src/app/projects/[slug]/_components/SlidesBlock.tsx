/**
 * SlidesBlock — Client, needs ProjectDetail.* strings
 *
 * Speakerdeck link (project.media.slides is already a full URL). Hidden
 * when absent.
 */

'use client'

import { useTranslations } from 'next-intl'

type SlidesBlockProps = {
  slidesUrl?: string
}

export function SlidesBlock({ slidesUrl }: SlidesBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (!slidesUrl) return null

  return (
    <section data-testid="slides-block" className="mb-lg">
      <p className="mb-sm label text-ink-ghost">{t('slides_heading')}</p>
      <a
        href={slidesUrl}
        className="label text-ink-secondary nav-link hover:text-ink"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('view_slides')}
      </a>
    </section>
  )
}
