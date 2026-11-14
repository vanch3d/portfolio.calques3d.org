/** CaseStudyProjectLink — Client, owns CaseStudyHeader.project_link. Link from a case-study page to its project page. */

'use client'

import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import { NavLink } from '@/components/ui/NavLink'
import { projectHref } from '@/lib/routes'

type CaseStudyProjectLinkProps = {
  project: string
  projectName: string
}

export function CaseStudyProjectLink({ project, projectName }: CaseStudyProjectLinkProps) {
  const t = useTranslations('CaseStudyHeader')

  return (
    <NavLink href={projectHref(project) as Route} className="mb-md inline-block">
      {t('project_link', { project: projectName })}
    </NavLink>
  )
}
