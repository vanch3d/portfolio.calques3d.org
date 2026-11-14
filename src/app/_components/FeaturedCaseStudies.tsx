/**
 * FeaturedCaseStudies — Client, owns FeaturedCaseStudies.* strings
 *
 * Full-width band between the home hero and the timeline. Renders nothing
 * without featured case studies; works for one or several. No draft mark here
 * (it stays on the /case-studies landing rows).
 */

'use client'

import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import Link from 'next/link'
import { NavLink } from '@/components/ui/NavLink'
import { CASE_STUDIES_HREF } from '@/lib/routes'

export type FeaturedItem = {
  title: string
  projectName: string
  chapterCount: number
  href: string
}

type FeaturedCaseStudiesProps = {
  items: FeaturedItem[]
}

export function FeaturedCaseStudies({ items }: FeaturedCaseStudiesProps) {
  const t = useTranslations('FeaturedCaseStudies')
  if (items.length === 0) return null

  return (
    <section
      aria-labelledby="featured-case-studies-heading"
      className="mb-xl"
      data-testid="featured-case-studies"
    >
      <div className="flex items-baseline justify-between gap-md border-t-heavy border-ink pt-sm">
        <h2 id="featured-case-studies-heading" className="label not-italic">
          {t(items.length === 1 ? 'heading_one' : 'heading_other')}
        </h2>
        <NavLink href={CASE_STUDIES_HREF as Route}>{t('all_link')}</NavLink>
      </div>
      <ol className="mt-md flex list-none flex-wrap gap-lg">
        {items.map((item) => (
          <li
            key={item.href}
            className="relative min-w-0 basis-full border-t-medium border-ink-ghost pt-sm md:max-w-featured-cell md:flex-1 md:basis-0"
            data-testid="featured-case-study"
          >
            <h3 className="text-title leading-title font-medium">
              <Link
                href={item.href as Route}
                className="text-ink after:absolute after:inset-0 after:content-[''] hover:underline"
              >
                {item.title}
              </Link>
            </h3>
            <p className="mt-xs mb-0 flex max-w-none flex-wrap gap-x-md label">
              <span>{item.projectName}</span>
              {item.chapterCount > 0 ? (
                <span>{t('chaptered_count', { count: item.chapterCount })}</span>
              ) : null}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
