/**
 * CaseBeat — plain sync Server Component
 *
 * A paragraph grouped with the plates that trail it (and, for the first beat of
 * a hub, an optional margin note). On lg the plates open into the margin column
 * beside the paragraph, top-aligned; below lg they follow it inline.
 */

import type { Plate } from '@/lib/case-study-blocks'
import type { CaseStudyImageMap } from '@/lib/content/case-study-images'
import { cn } from '@/lib/utils'
import { CaseFigure } from './CaseFigure'

type CaseBeatProps = {
  children: React.ReactNode
  plates: Plate[]
  images: CaseStudyImageMap
  aside?: React.ReactNode
}

export function CaseBeat({ children, plates, images, aside }: CaseBeatProps) {
  const hasMargin = plates.length > 0 || Boolean(aside)

  return (
    <div
      className={cn(
        'max-w-prose',
        hasMargin && 'lg:grid lg:max-w-none lg:grid-cols-beat lg:gap-x-lg'
      )}
      data-testid="case-beat"
    >
      <p className="lg:col-start-1">{children}</p>
      {hasMargin ? (
        <div
          className="mb-md flex flex-col gap-md lg:col-start-2 lg:row-start-1 lg:mb-0"
          data-testid="case-beat-margin"
        >
          {aside}
          {plates.map((plate) => (
            <CaseFigure key={plate.no} plate={plate} images={images} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
