/**
 * EraColumn — a single era column in the below-fold timeline.
 *
 * Structure (from approved comp homepage-comp-v4b-r2.html):
 *   Dimension ruler (aria-hidden): span line + start tick + end tick + year labels
 *   Era badge (label class, ink-secondary)
 *   Era name (STIX italic, text-headline)
 *   Era summary (Spectral, text-caption)
 *   Position list (role="list"): year col (6ch, tabular, ink-ghost) + institution
 *   One or more NavLink atoms
 *
 * The ruler end tick for research (right side) and start tick for engineering
 * (left side) are both styled active — they mark the shared 2018 inflection.
 *
 * Position data is hardcoded for now (deferred D-03: wire to src/content/positions/).
 *
 * i18n: all strings from HomePage namespace, resolved by the parent server component.
 */

import type { ReactNode } from 'react'
import type { Route } from 'next'
import { cn } from '@/lib/utils'
import { NavLink } from '@/components/ui/NavLink'
import type { ProjectType } from '@/types/content'

export type EraEntry = {
  year: string
  institution: string
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
  positions: EraEntry[]
  positionsAriaLabel: string
  links: EraLink[]
}

function RulerTick({ side, active }: { side: 'start' | 'end'; active: boolean }) {
  return (
    <span
      className={cn(
        'absolute top-1/2 -translate-y-1/2',
        'h-2.25 w-line-heavy',
        side === 'start' ? 'left-0' : 'right-0',
        active ? 'bg-active' : 'bg-ink-secondary'
      )}
    />
  )
}

function RulerYear({
  side,
  active,
  children,
}: {
  side: 'start' | 'end'
  active: boolean
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'absolute label',
        side === 'start' ? 'left-0' : 'right-0 text-right',
        active ? 'text-active' : 'text-ink-secondary'
      )}
      style={{ top: 'calc(50% - 1.5rem)' }}
    >
      {children}
    </span>
  )
}

export function EraColumn({
  era,
  badge,
  name,
  summary,
  positions,
  positionsAriaLabel,
  links,
}: EraColumnProps) {
  const isResearch = era === 'research'

  return (
    <div
      className={cn(
        'relative pb-xl',
        isResearch
          ? 'border-r-ghost border-ink-ghost pr-lg max-md:order-2 max-md:border-t-ghost max-md:border-r-0 max-md:pt-lg max-md:pr-0'
          : 'pl-lg max-md:order-1 max-md:pl-0'
      )}
    >
      <div
        className="relative mb-md h-lg before:absolute before:top-1/2 before:right-0 before:left-0 before:h-line-medium before:-translate-y-1/2 before:bg-ink-secondary before:content-['']"
        aria-hidden="true"
        data-testid="era-ruler"
      >
        {isResearch ? (
          <>
            <RulerTick side="start" active={false} />
            <RulerTick side="end" active={true} />
            <RulerYear side="start" active={false}>
              1995
            </RulerYear>
            <RulerYear side="end" active={true}>
              2018
            </RulerYear>
          </>
        ) : (
          <>
            <RulerTick side="start" active={true} />
            <RulerTick side="end" active={false} />
            <RulerYear side="start" active={true}>
              2018
            </RulerYear>
            <RulerYear side="end" active={false}>
              2026
            </RulerYear>
          </>
        )}
      </div>

      <p className="mb-sm label text-ink-secondary">{badge}</p>

      <h2 className="mb-sm font-display text-headline leading-headline text-ink italic">{name}</h2>

      <p className="mb-md max-w-era-summary font-body text-caption leading-body text-ink-secondary">
        {summary}
      </p>

      <div
        role="list"
        aria-label={positionsAriaLabel}
        className="mb-md flex flex-col"
        data-testid="positions-list"
      >
        {positions.map((pos, i) => (
          <div
            key={`${pos.year}-${pos.institution}`}
            role="listitem"
            className={cn(
              'grid items-baseline gap-x-sm py-sm',
              'grid-cols-[6ch_1fr]',
              i > 0 ? 'border-t-ghost border-ink-ghost' : ''
            )}
          >
            <span className="pt-xs label text-ink-ghost tabular">{pos.year}</span>
            <span className="font-body text-caption leading-body text-ink-secondary">
              {pos.institution}
            </span>
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
