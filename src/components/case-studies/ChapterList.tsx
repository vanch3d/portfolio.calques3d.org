/**
 * ChapterList — Client, owns CaseChapterList.* strings
 *
 * Numbered, ruled list of a chaptered case's chapters. Each row is one link
 * (its anchor stretches over the whole row) to the chapter's own route.
 * Rendered by the hub page from the `chapters` frontmatter.
 */

'use client'

import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import Link from 'next/link'
import { caseStudyHref } from '@/lib/routes'
import type { CaseStudyChapter } from '@/types/content'

type ChapterListProps = {
  project: string
  slug: string
  chapters: CaseStudyChapter[]
}

export function ChapterList({ project, slug, chapters }: ChapterListProps) {
  const t = useTranslations('CaseChapterList')
  return (
    <nav aria-label={t('aria')} className="mt-xl max-w-prose">
      <h2 className="sr-only">{t('heading')}</h2>
      <ol className="list-none border-t-heavy border-ink">
        {chapters.map((chapter, i) => (
          <li
            key={chapter.slug}
            className="relative flex border-b-ghost border-ink-ghost py-md"
            data-testid="chapter-list-item"
          >
            <span className="w-xl shrink-0 pt-xs label">{i + 1}</span>
            <div>
              <h3 className="text-title leading-title font-medium">
                <Link
                  href={caseStudyHref(project, slug, chapter.slug) as Route}
                  className="text-ink after:absolute after:inset-0 after:content-[''] hover:underline"
                >
                  {chapter.title}
                </Link>
              </h3>
              {chapter.teaser ? (
                <p className="mt-xs mb-0 text-caption leading-label text-ink-secondary">
                  {chapter.teaser}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
