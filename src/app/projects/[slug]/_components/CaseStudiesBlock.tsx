/**
 * CaseStudiesBlock — Client, needs ProjectDetail.* strings
 *
 * Preview cards for case studies linked to this project. Hidden when none.
 * 2-column grid on lg, single column below (direction contract).
 */

'use client'

import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import { NavLink } from '@/components/ui/NavLink'
import { caseStudyHref } from '@/lib/routes'
import type { CaseStudy } from '@/types/content'
import { ResourceBlockSection } from './ResourceBlockSection'

type CaseStudiesBlockProps = {
  projectSlug: string
  caseStudies: CaseStudy[]
}

export function CaseStudiesBlock({ projectSlug, caseStudies }: CaseStudiesBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (caseStudies.length === 0) return null

  return (
    <ResourceBlockSection testId="case-studies-block" heading={t('case_studies_heading')}>
      <div className="grid gap-md lg:grid-cols-2">
        {caseStudies.map((study) => (
          <article
            key={study.slug}
            className="border-medium border-ink-ghost p-md"
            data-testid="case-study-card"
          >
            <h3 className="font-display text-title leading-title text-ink italic">{study.title}</h3>
            <NavLink
              href={caseStudyHref(projectSlug, study.slug) as Route}
              className="mt-sm inline-block"
            >
              {t('view_case_study')}
            </NavLink>
          </article>
        ))}
      </div>
    </ResourceBlockSection>
  )
}
