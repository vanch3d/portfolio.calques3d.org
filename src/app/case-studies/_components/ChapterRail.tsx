/**
 * ChapterRail — Client, owns ChapterRail.* strings
 *
 * Sticky ruled line of chapter nodes (one per chapter, plus an END node that
 * goes to the hub's Closing when the case has one). Each tick is centred over
 * its own numeral and the line runs tick-centre to tick-centre. The current
 * chapter's tick is the only red on the page. Rendered behind the
 * `chapterRail` flag (src/lib/flags.ts).
 */

'use client'

import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import Link from 'next/link'
import { caseStudyHref } from '@/lib/routes'
import type { CaseStudyChapter } from '@/types/content'
import { cn } from '@/lib/utils'

type ChapterRailProps = {
  project: string
  slug: string
  chapters: CaseStudyChapter[]
  currentSlug: string
  hasClosing: boolean
}

const NODE_BASE =
  'relative block min-h-11 pt-md pb-xs text-center label transition-colors before:absolute before:top-0 before:right-0 before:left-0 before:h-line-medium before:bg-ink-secondary before:content-[""] after:absolute after:top-0 after:left-1/2 after:w-line-medium after:-translate-x-1/2 after:-translate-y-1/2 after:content-[""]'
const NODE_IDLE =
  'text-ink-secondary after:h-tick-tall after:bg-ink-secondary hover:text-ink hover:underline hover:after:h-tick-project hover:after:w-line-heavy hover:after:bg-ink'
const NODE_CURRENT = 'text-ink after:h-tick-project after:w-line-heavy after:bg-active'

export function ChapterRail({
  project,
  slug,
  chapters,
  currentSlug,
  hasClosing,
}: ChapterRailProps) {
  const t = useTranslations('ChapterRail')
  const currentIndex = chapters.findIndex((c) => c.slug === currentSlug)
  const current = chapters[currentIndex]
  const nodeCount = chapters.length + (hasClosing ? 1 : 0)

  function nodeClass(index: number, isCurrent: boolean) {
    return cn(
      NODE_BASE,
      isCurrent ? NODE_CURRENT : NODE_IDLE,
      index === 0 && 'before:left-1/2',
      index === nodeCount - 1 && 'before:right-1/2'
    )
  }

  return (
    <nav
      aria-label={t('aria')}
      className="sticky top-0 z-rail grid grid-cols-1 border-b-medium border-ink-ghost bg-ground pt-sm md:grid-cols-rail md:items-end md:gap-x-lg"
      data-testid="chapter-rail"
    >
      <p className="mb-0 max-w-none overflow-hidden pb-sm label text-ellipsis whitespace-nowrap md:pb-md">
        <span className="text-ink">
          {t('label', { number: currentIndex + 1, total: chapters.length })}
        </span>
        {current ? <> · {current.title}</> : null}
      </p>
      <ol
        className="grid list-none"
        style={{ gridTemplateColumns: `repeat(${nodeCount}, minmax(0, 1fr))` }}
      >
        {chapters.map((chapter, i) => {
          const isCurrent = chapter.slug === currentSlug
          return (
            <li key={chapter.slug}>
              <Link
                href={caseStudyHref(project, slug, chapter.slug) as Route}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={t(isCurrent ? 'node_current_aria' : 'node_aria', {
                  number: i + 1,
                  title: chapter.title,
                })}
                className={nodeClass(i, isCurrent)}
              >
                {i + 1}
              </Link>
            </li>
          )
        })}
        {hasClosing ? (
          <li>
            <Link
              href={`${caseStudyHref(project, slug)}#closing` as Route}
              aria-label={t('closing_aria')}
              className={nodeClass(nodeCount - 1, false)}
            >
              {t('end')}
            </Link>
          </li>
        ) : null}
      </ol>
    </nav>
  )
}
