/** CaseTitleBlock — Client, owns CaseTitleBlock.* strings. Title, eyebrow meta, optional lead and tags. */

'use client'

import { useTranslations } from 'next-intl'
import { Tag } from '@/components/ui/Tag'
import type { CaseStudyStatus } from '@/types/content'
import { CaseStatusMark } from './CaseStatusMark'

type CaseTitleBlockProps = {
  title: string
  status: CaseStudyStatus
  /** 'chapter' drops the "Case study" eyebrow; the chapter label replaces it. */
  variant?: 'case' | 'chapter'
  chapterCount?: number
  /** Plain "Chapter n of N" label, shown when the chapter rail is off. */
  chapterPosition?: { number: number; total: number }
  tags?: string[]
  lead?: React.ReactNode
}

export function CaseTitleBlock({
  title,
  status,
  variant = 'case',
  chapterCount,
  chapterPosition,
  tags = [],
  lead,
}: CaseTitleBlockProps) {
  const t = useTranslations('CaseTitleBlock')
  return (
    <header className="mt-sm border-t-heavy border-ink pt-md" data-testid="case-title-block">
      <p className="mb-0 flex max-w-none flex-wrap gap-x-md label">
        {variant === 'case' ? <span>{t('eyebrow')}</span> : null}
        {chapterPosition ? (
          <span>
            {t('chapter_of', { number: chapterPosition.number, total: chapterPosition.total })}
          </span>
        ) : null}
        <CaseStatusMark status={status} />
        {chapterCount ? <span>{t('chapters_count', { count: chapterCount })}</span> : null}
      </p>
      <h1 className="mt-sm mb-md max-w-prose text-headline leading-headline">{title}</h1>
      {lead ? <div className="max-w-prose">{lead}</div> : null}
      {tags.length > 0 ? (
        <ul aria-label={t('tags_aria')} className="mt-md flex list-none flex-wrap gap-xs">
          {tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  )
}
