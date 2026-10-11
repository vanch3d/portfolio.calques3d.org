/**
 * Client Component — needs ProjectDetail.* translations.
 *
 * coverUrl absent still renders the placeholder, never null.
 */

'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

type SpecimenIllustrationProps = {
  coverUrl?: string
  alt: string
  specimenIndex?: number
  specimenTotal?: number
}

const IMAGE_SIZE_CLASSES = 'md:h-specimen-h-md md:w-specimen-w-md lg:h-specimen-h lg:w-specimen-w'

const MOUNT_CLASSES = cn(
  'relative hidden shrink-0 border-heavy border-ink p-xs md:block',
  "before:absolute before:top-0 before:left-0 before:h-sm before:w-sm before:border-t-heavy before:border-l-heavy before:border-ink-ghost before:content-['']",
  "after:absolute after:right-0 after:bottom-0 after:h-sm after:w-sm after:border-r-heavy after:border-b-heavy after:border-ink-ghost after:content-['']"
)

type SpecimenImageProps = {
  coverUrl: string
  alt: string
}

function SpecimenImage({ coverUrl, alt }: SpecimenImageProps) {
  const isOutOfWorldRaster = !/\.svg$/i.test(coverUrl)
  return (
    // eslint-disable-next-line @next/next/no-img-element -- media.cover paths are content-authored, arbitrary aspect ratios
    <img
      src={coverUrl}
      alt={alt}
      data-testid="specimen-illustration-image"
      className={cn(IMAGE_SIZE_CLASSES, 'object-contain', isOutOfWorldRaster && 'duotone-specimen')}
    />
  )
}

function SpecimenPlaceholder() {
  const t = useTranslations('ProjectDetail')
  return (
    <div
      role="img"
      aria-label={t('specimen_placeholder_label')}
      data-testid="specimen-illustration-placeholder"
      className={cn(IMAGE_SIZE_CLASSES, 'flex flex-col items-center justify-center gap-sm')}
    >
      <span className="w-full text-center label text-micro text-ink-secondary">
        {t('specimen_placeholder_label')}
      </span>
      <span className="w-full text-center label text-micro text-ink-secondary">
        {t('specimen_placeholder_hint')}
      </span>
    </div>
  )
}

type SpecimenMountBandProps = {
  index: number
  total: number
}

function SpecimenMountBand({ index, total }: SpecimenMountBandProps) {
  const t = useTranslations('ProjectDetail')
  return (
    <p
      data-testid="specimen-mount-band"
      className="mt-xs border-t-medium border-ink-ghost pt-xs text-center label"
    >
      {t('specimen_mount_index', { index, total })}
    </p>
  )
}

export function SpecimenIllustration({
  coverUrl,
  alt,
  specimenIndex,
  specimenTotal,
}: SpecimenIllustrationProps) {
  return (
    <div data-testid="specimen-mount" className={MOUNT_CLASSES}>
      {coverUrl ? <SpecimenImage coverUrl={coverUrl} alt={alt} /> : <SpecimenPlaceholder />}
      {specimenIndex !== undefined && specimenTotal !== undefined && (
        <SpecimenMountBand index={specimenIndex} total={specimenTotal} />
      )}
    </div>
  )
}
