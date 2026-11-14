/** CaseStudyHeader — Client, owns CaseStudyHeader.* strings. Shared breadcrumb (Home / Case studies / case) plus the link to the project page. */

'use client'

import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { NavLink } from '@/components/ui/NavLink'
import { CASE_STUDIES_HREF, caseStudyHref, projectHref } from '@/lib/routes'

type CaseStudyHeaderProps = {
  project: string
  projectName: string
  slug: string
  /** Label of the page itself (the case title, or the chapter title on chapter pages). */
  current: string
  /** Set on chapter pages: adds the hub as a crumb, titled with the case. */
  hubTitle?: string
}

export function CaseStudyHeader({
  project,
  projectName,
  slug,
  current,
  hubTitle,
}: CaseStudyHeaderProps) {
  const t = useTranslations('CaseStudyHeader')
  const items = [
    { label: t('home'), href: '/' as Route },
    { label: t('list'), href: CASE_STUDIES_HREF as Route },
    ...(hubTitle ? [{ label: hubTitle, href: caseStudyHref(project, slug) as Route }] : []),
  ]

  return (
    <>
      <Breadcrumb items={items} current={current} />
      <NavLink href={projectHref(project) as Route} className="mb-md inline-block">
        {t('project_link', { project: projectName })}
      </NavLink>
    </>
  )
}
