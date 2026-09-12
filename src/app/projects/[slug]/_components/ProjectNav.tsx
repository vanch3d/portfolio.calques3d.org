/**
 * ProjectNav — Client, needs ProjectDetail.* strings
 *
 * Career-timeline navigation: previous/next project in the GLOBAL
 * chronological project list (getAllProjectsChronological), not scoped to
 * the current project's position — this follows the tracker on the footer
 * timeline, not "other projects here". See ADR 021 / Track P design
 * correction: this replaces the earlier SiblingNav, which incorrectly
 * scoped prev/next to the current position (a misreading of the comp that
 * was also wrong in the scrapped prior attempt).
 *
 * Three fixed grid columns (1fr / auto / 1fr) keep the middle "{position} ·
 * N projects" zone truly centred regardless of whether prev/next exist or
 * how long their titles are — a flex `justify-between` would drift the
 * middle off-centre whenever one side is empty or the titles are uneven
 * lengths. The middle zone is deliberately plain text, not a link — what it
 * should do (if anything) beyond stating the count is an open design
 * question, not resolved here.
 *
 * Only the small "← Previous project" / "Next project →" line is the link
 * (matching the arrow-in-copy convention used elsewhere, e.g. AppNav's
 * "← Return home", HomePage's "Explore research →"). The project title
 * renders as separate, smaller, non-link text below it — this keeps the
 * click target and underline confined to the short label instead of a
 * multi-line title stretching the hover/underline area.
 */

'use client'

import { useTranslations } from 'next-intl'
import type { Route } from 'next'
import { NavLink } from '@/components/ui/NavLink'
import { projectHref } from '@/lib/routes'
import type { ProjectResolution } from '@/lib/content/projects'

type ProjectNavProps = {
  prev: ProjectResolution | null
  next: ProjectResolution | null
  positionLabel: string
  positionCount: number
}

export function ProjectNav({ prev, next, positionLabel, positionCount }: ProjectNavProps) {
  const t = useTranslations('ProjectDetail')

  return (
    <nav
      aria-label={t('project_nav_aria')}
      data-testid="project-nav"
      className="grid grid-cols-[1fr_minmax(10rem,auto)_1fr] items-start gap-md border-t-medium border-ink-ghost pt-md"
    >
      <div className="min-w-0">
        {prev && (
          <div className="gap-2xs flex flex-col">
            <NavLink href={projectHref(prev.project.slug) as Route}>
              {t('project_nav_prev_label')}
            </NavLink>
            <p className="label text-micro text-ink-secondary">{prev.project.title}</p>
          </div>
        )}
      </div>

      <p className="text-center label text-ink-ghost" data-testid="project-nav-position">
        {positionLabel} · {t('project_nav_position_count', { count: positionCount })}
      </p>

      <div className="min-w-0 text-right">
        {next && (
          <div className="gap-2xs flex flex-col items-end">
            <NavLink href={projectHref(next.project.slug) as Route}>
              {t('project_nav_next_label')}
            </NavLink>
            <p className="label text-micro text-ink-secondary">{next.project.title}</p>
          </div>
        )}
      </div>
    </nav>
  )
}
