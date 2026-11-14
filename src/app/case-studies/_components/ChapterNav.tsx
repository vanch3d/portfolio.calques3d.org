/**
 * ChapterNav — Client, owns CaseChapterNav.* strings
 *
 * Previous / next pager under a chapter. On the last chapter, "next" goes to
 * the hub's Closing when the case has one.
 */

'use client'

import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import Link from 'next/link'
import { caseStudyHref } from '@/lib/routes'
import type { CaseStudyChapter } from '@/types/content'

type ChapterNavProps = {
  project: string
  slug: string
  prev: CaseStudyChapter | null
  next: CaseStudyChapter | null
  hasClosing?: boolean
}

type PagerLinkProps = {
  href: string
  label: string
  title: string
  align?: 'start' | 'end'
}

function PagerLink({ href, label, title, align = 'start' }: PagerLinkProps) {
  return (
    <Link
      href={href as Route}
      className={`block border-b-ghost border-ink-ghost py-md text-ink nav-link ${
        align === 'end' ? 'sm:text-right' : ''
      }`}
    >
      <span className="inline-block label">{label}</span>
      <span className="block text-title leading-title font-medium">{title}</span>
    </Link>
  )
}

export function ChapterNav({ project, slug, prev, next, hasClosing = false }: ChapterNavProps) {
  const t = useTranslations('CaseChapterNav')
  return (
    <nav
      aria-label={t('aria')}
      className="mt-xl grid max-w-pager grid-cols-1 border-t-heavy border-ink sm:grid-cols-2 sm:gap-x-lg"
    >
      {prev ? (
        <PagerLink
          href={caseStudyHref(project, slug, prev.slug)}
          label={t('prev')}
          title={prev.title}
        />
      ) : (
        <span aria-hidden="true" />
      )}
      {next ? (
        <PagerLink
          href={caseStudyHref(project, slug, next.slug)}
          label={t('next')}
          title={next.title}
          align="end"
        />
      ) : hasClosing ? (
        <PagerLink
          href={`${caseStudyHref(project, slug)}#closing`}
          label={t('next')}
          title={t('closing')}
          align="end"
        />
      ) : null}
    </nav>
  )
}
