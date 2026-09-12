/**
 * SiblingNav — Client, needs ProjectDetail.* strings
 *
 * Other projects at the same position, plus a link back to the era
 * overview. P-FIX-2: the era-overview link always renders, even when this
 * project is the only one at its position (previously the whole nav was
 * hidden when `others.length === 0`, which incorrectly hid the overview
 * link too).
 */

'use client'

import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import { NavLink } from '@/components/ui/NavLink'
import { projectHref, eraHref } from '@/lib/routes'
import { pickSiblings } from '../_utils/project-utils'
import type { ProjectResolution } from '@/lib/content/projects'
import type { ProjectType } from '@/types/content'

type SiblingNavProps = {
  currentSlug: string
  positionProjects: ProjectResolution[]
  type: ProjectType
}

export function SiblingNav({ currentSlug, positionProjects, type }: SiblingNavProps) {
  const t = useTranslations('ProjectDetail')
  const { prev, next, total } = pickSiblings(positionProjects, currentSlug)

  return (
    <nav
      aria-label={t('sibling_nav_aria')}
      data-testid="sibling-nav"
      className="flex flex-col gap-sm border-t-medium border-ink-ghost pt-md sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex gap-lg">
        {prev && (
          <NavLink href={projectHref(prev.project.slug) as Route}>
            {t('sibling_prev', { title: prev.project.title })}
          </NavLink>
        )}
        {next && (
          <NavLink href={projectHref(next.project.slug) as Route}>
            {t('sibling_next', { title: next.project.title })}
          </NavLink>
        )}
      </div>

      <div className="flex items-center gap-sm">
        {total > 1 && <span className="label text-ink-ghost">{t('sibling_count', { total })}</span>}
        <NavLink href={eraHref(type) as Route}>{t('sibling_era_overview')}</NavLink>
      </div>
    </nav>
  )
}
