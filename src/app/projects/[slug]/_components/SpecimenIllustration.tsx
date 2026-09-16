/**
 * SpecimenIllustration — Client, needs ProjectDetail.* strings
 *
 * Renders `media.cover` as a duotone-filtered image when present. When
 * absent, renders the ghost dashed placeholder with corner registration
 * marks — this is the correct empty state, never hide the zone (direction
 * contract, "Specimen illustration — image notes").
 *
 * Responsive: hidden on sm (title zone too narrow), 120×100 on md (inline
 * metadata band), 200×168 on lg (top-right of ProjectTitle).
 */

'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

type SpecimenIllustrationProps = {
  coverUrl?: string
  alt: string
}

const SIZE_CLASSES =
  'hidden md:block md:h-specimen-h-md md:w-specimen-w-md lg:h-specimen-h lg:w-specimen-w'

export function SpecimenIllustration({ coverUrl, alt }: SpecimenIllustrationProps) {
  const t = useTranslations('ProjectDetail')

  if (coverUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- media.cover paths are content-authored, arbitrary aspect ratios
      <img
        src={coverUrl}
        alt={alt}
        data-testid="specimen-illustration-image"
        className={cn(SIZE_CLASSES, 'shrink-0 object-cover duotone-specimen')}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={t('specimen_placeholder_label')}
      data-testid="specimen-illustration-placeholder"
      className={cn(
        SIZE_CLASSES,
        'relative flex shrink-0 flex-col items-center justify-center gap-xs',
        'border-medium border-dashed border-ink-ghost',
        "before:absolute before:top-0 before:left-0 before:h-sm before:w-sm before:border-t-heavy before:border-l-heavy before:border-ink-ghost before:content-['']",
        "after:border-r-heavy after:absolute after:right-0 after:bottom-0 after:h-sm after:w-sm after:border-b-heavy after:border-ink-ghost after:content-['']"
      )}
    >
      <span className="text-center label text-micro text-ink-ghost">
        {t('specimen_placeholder_label')}
      </span>
      <span className="text-center label text-micro text-ink-ghost">
        {t('specimen_placeholder_hint')}
      </span>
    </div>
  )
}
