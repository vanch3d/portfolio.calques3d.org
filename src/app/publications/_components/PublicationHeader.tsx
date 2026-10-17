'use client'

import { useTranslations } from 'next-intl'

type PublicationHeaderProps = {
  pubCount: number
  minYear: number
  maxYear: number
}

export function PublicationHeader({ pubCount, minYear, maxYear }: PublicationHeaderProps) {
  const t = useTranslations('Publications')

  return (
    <>
      <div className="grid grid-cols-centred-header items-center gap-lg border-t-heavy border-b-heavy border-ink py-md">
        <div />
        <h1 className="text-center font-display text-title leading-title whitespace-nowrap text-ink italic">
          {t('publications_heading')}
        </h1>

        {/* Right: counters */}
        <div className="text-right label leading-body">
          <span className="block" data-testid="counter-records">
            {t('publications_count', { count: pubCount })}
          </span>
          <span className="block" data-testid="counter-as-of">
            {t('as_of', { date: maxYear })}
          </span>
        </div>
      </div>

      <div
        className="relative my-md flex h-lg items-center"
        aria-hidden="true"
        data-testid="dimension-line"
      >
        <div className="absolute inset-x-0 top-1/2 border-t-ghost border-ink-ghost" />

        <div className="absolute top-1/2 left-0 flex -translate-y-1/2 flex-col items-center">
          <div className="h-sm border-l-medium border-ink-ghost" />
          <span className="mt-xs label text-ink-secondary">{minYear}</span>
        </div>

        <div className="absolute top-1/2 right-0 flex -translate-y-1/2 flex-col items-center">
          <div className="h-sm border-l-medium border-ink-ghost" />
          <span className="mt-xs label text-ink-secondary">{maxYear}</span>
        </div>
      </div>
    </>
  )
}
