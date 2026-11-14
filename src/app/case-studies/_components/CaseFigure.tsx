/**
 * CaseFigure — Client, owns CaseFigure.* strings
 *
 * One numbered plate: a framed image (or a "plate pending" frame for a
 * `[!NOTE]` placeholder) over a caption band. `images` is the page-level
 * resolved map (Piwigo API / public fallback, see case-study-images.ts); the
 * MDX title attribute is the caption, Piwigo's comment the fallback.
 */

'use client'

import { useTranslations } from 'next-intl'
import type { Plate } from '@/lib/case-study-blocks'
import type { CaseStudyImageMap } from '@/lib/content/case-study-images'

type CaseFigureProps = {
  plate: Plate
  images: CaseStudyImageMap
}

type PlateFrameProps = {
  no: number
  caption?: string
  children: React.ReactNode
}

function PlateFrame({ no, caption, children }: PlateFrameProps) {
  const t = useTranslations('CaseFigure')
  return (
    <figure className="border-heavy border-ink bg-ground" data-testid="case-plate">
      <div className="p-sm">{children}</div>
      <figcaption className="flex flex-col gap-xs border-t-medium border-ink p-sm text-caption leading-label sm:flex-row sm:items-baseline sm:gap-md lg:flex-col lg:gap-xs">
        <span className="flex-none label text-ink">{t('figure_no', { no })}</span>
        {caption ? <span className="leading-body text-ink">{caption}</span> : null}
      </figcaption>
    </figure>
  )
}

export function CaseFigure({ plate, images }: CaseFigureProps) {
  const t = useTranslations('CaseFigure')

  if (plate.kind === 'pending') {
    return (
      <PlateFrame no={plate.no}>
        <div
          className="grid aspect-4/3 place-items-center border-ghost border-ink-ghost text-center"
          data-testid="case-plate-pending"
        >
          <span className="label">{t('pending')}</span>
        </div>
      </PlateFrame>
    )
  }

  const image = plate.src ? images[plate.src] : undefined
  const caption = plate.title ?? image?.comment

  return (
    <PlateFrame no={plate.no} caption={caption}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote Piwigo URLs; next/image config is a separate decision
        <img
          src={image.src}
          alt={plate.alt ?? ''}
          width={image.width}
          height={image.height}
          loading="lazy"
          className="block h-auto w-full border-ghost border-ink-ghost"
        />
      ) : (
        <div
          role="img"
          aria-label={plate.alt || t('image_unavailable')}
          className="grid aspect-4/3 place-items-center border-ghost border-ink-ghost text-center"
          data-testid="case-plate-unavailable"
        >
          <span className="label">{t('image_unavailable')}</span>
        </div>
      )}
    </PlateFrame>
  )
}
