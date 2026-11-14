/** CaseStudyEntry — Client, owns CaseStudiesIndex.* strings. One numbered, whole-row-link entry of the landing list. */

'use client'

import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import Link from 'next/link'
import type { CaseStudyListItem } from '@/lib/content/case-study-groups'
import { CaseStatusMark } from './CaseStatusMark'

type CaseStudyEntryProps = {
  item: CaseStudyListItem
}

export function CaseStudyEntry({ item }: CaseStudyEntryProps) {
  const t = useTranslations('CaseStudiesIndex')
  const { caseStudy, projectName, chapterCount, href, number } = item

  return (
    <li
      className="relative flex border-b-ghost border-ink-ghost py-md"
      data-testid="case-study-entry"
    >
      <span className="w-xl shrink-0 pt-xs label">{number}</span>
      <div className="min-w-0">
        <h3 className="text-title leading-title font-medium break-words">
          <Link
            href={href as Route}
            className="text-ink after:absolute after:inset-0 after:content-[''] hover:underline"
          >
            {caseStudy.title}
          </Link>
        </h3>
        {caseStudy.summary ? (
          <p className="mt-xs mb-0 text-caption leading-label text-ink-secondary">
            {caseStudy.summary}
          </p>
        ) : null}
        <p className="mt-xs mb-0 flex max-w-none flex-wrap gap-x-md label">
          <span>{projectName}</span>
          {chapterCount > 0 ? <span>{t('chaptered_count', { count: chapterCount })}</span> : null}
          <CaseStatusMark status={caseStudy.status} />
        </p>
      </div>
    </li>
  )
}
