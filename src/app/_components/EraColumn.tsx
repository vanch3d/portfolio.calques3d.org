/**
 * EraColumn — a single era column in the below-fold timeline.
 *
 * Structure (from approved comp homepage-comp-v4b-r2.html, amended 2026-09-12
 * — see IA note below):
 *   Dimension ruler: PeriodRuler molecule (shared with ProjectFooter, Pass 2)
 *   Era badge (label class, ink-secondary)
 *   Era name (STIX italic, text-headline)
 *   Era summary (Spectral, text-caption)
 *   Project list (role="list"): year col (6ch, tabular, ink-ghost) + project
 *     title, each row a direct link to /projects/[slug]
 *   One or more NavLink atoms
 *
 * IA amendment (2026-09-12): this column originally listed POSITIONS (era →
 * position → project → case study), which put the actual reading focus
 * (projects, case studies) two clicks from the homepage despite having far
 * more content than positions/eras. Interim fix, pending full design review:
 * list PROJECTS directly (chronological, newest first, one row per project —
 * positions with several projects get several rows), each row linking
 * straight to its /projects/[slug] page. Every project is included — even
 * visibility:"redacted" ones like Intrica — since they already have a real
 * detail page and are already linked from ProjectNav.
 *
 * The ruler end tick for research (right side) and start tick for engineering
 * (left side) are both styled active — they mark the shared 2018 inflection.
 *
 * i18n: all strings from HomePage namespace, resolved by the parent server component,
 * except the ruler itself — PeriodRuler owns its own aria-label copy (PeriodRuler
 * namespace) per Decision 1/2 of the Track P plan.
 */

import type { Route } from 'next'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { NavLink } from '@/components/ui/NavLink'
import { PeriodRuler } from '@/components/ui/PeriodRuler'
import { CAREER_START, ERA_TRANSITION } from '@/lib/period'
import type { PeriodDatum } from '@/lib/period'
import type { ProjectType } from '@/types/content'

export type EraEntry = {
  year: string
  label: string
  href: Route
}

type EraLink = {
  href: Route
  label: string
}

type EraColumnProps = {
  era: ProjectType
  badge: string
  name: string
  summary: string
  projects: EraEntry[]
  projectsAriaLabel: string
  links: EraLink[]
}

export function EraColumn({
  era,
  badge,
  name,
  summary,
  projects,
  projectsAriaLabel,
  links,
}: EraColumnProps) {
  const isResearch = era === 'research'
  const currentYear = new Date().getFullYear()

  // The 2018 era transition is the shared inflection point: it renders active
  // (red) at the end of the research ruler and the start of the engineering
  // ruler. ongoing=true unlocks the 'project-end' active colour on that tick;
  // the other boundary stays role 'default' (always graphite).
  const researchDatums: PeriodDatum[] = [
    { year: CAREER_START, role: 'default' },
    { year: ERA_TRANSITION, role: 'project-end' },
  ]
  const engineeringDatums: PeriodDatum[] = [
    { year: ERA_TRANSITION, role: 'project-end' },
    { year: currentYear, role: 'default' },
  ]

  return (
    <div
      className={cn(
        'relative pb-xl',
        isResearch
          ? 'border-r-ghost border-ink-ghost pr-lg max-md:order-2 max-md:border-t-ghost max-md:border-r-0 max-md:pt-lg max-md:pr-0'
          : 'pl-lg max-md:order-1 max-md:pl-0'
      )}
    >
      <div className="mb-md" data-testid="era-ruler">
        {isResearch ? (
          <PeriodRuler
            domain={{ start: CAREER_START, end: ERA_TRANSITION }}
            datums={researchDatums}
            ongoing={true}
            contextLabel={badge}
          />
        ) : (
          <PeriodRuler
            domain={{ start: ERA_TRANSITION, end: currentYear }}
            datums={engineeringDatums}
            ongoing={true}
            contextLabel={badge}
          />
        )}
      </div>

      <p className="mb-sm label text-ink-secondary">{badge}</p>

      <h2 className="mb-sm font-display text-headline leading-headline text-ink italic">{name}</h2>

      <p className="mb-md max-w-era-summary font-body text-caption leading-body text-ink-secondary">
        {summary}
      </p>

      <div
        role="list"
        aria-label={projectsAriaLabel}
        className="mb-md flex flex-col"
        data-testid="projects-list"
      >
        {projects.map((entry, i) => (
          <div
            key={`${entry.year}-${entry.href}`}
            role="listitem"
            className={cn(
              'grid items-baseline gap-x-sm py-sm',
              'grid-cols-[6ch_1fr]',
              i > 0 ? 'border-t-ghost border-ink-ghost' : ''
            )}
          >
            <span className="pt-xs label text-ink-ghost tabular">{entry.year}</span>
            <Link
              href={entry.href}
              className="font-body text-caption leading-body text-ink-secondary nav-link hover:text-ink"
            >
              {entry.label}
            </Link>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-md">
        {links.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            className="mb-xs inline-block border-b-medium border-ink pb-xs hover:border-active hover:text-active"
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
