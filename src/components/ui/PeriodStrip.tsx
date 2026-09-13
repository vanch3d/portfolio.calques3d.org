/**
 * PeriodStrip — Client, needs i18n (useTranslations('PeriodStrip'))
 *
 * Compact inline measurement strip used in ClassificationHeader (Pass 2).
 *
 * Structure:
 *   [startYear]  |──────────────────|  [endYear or "present"]
 *
 * The start label and ticks are always graphite. The end tick and end label
 * follow the One Red Rule: active (red) when ongoing, graphite when archived.
 *
 * i18n: owns its own aria-label and "present" copy via useTranslations —
 * callers pass only data (domain, ongoing, contextLabel), never pre-rendered
 * strings. See .claude/rules/i18n.md (ColorSwatch pattern) and the Track P
 * plan's Decision 2 (this replaced a startYear/endYear/aria-label string API
 * in a scrapped prior attempt).
 *
 * Accessibility: role="img" wrapper with the component's own aria-label.
 * Decorative tick and span elements are aria-hidden.
 */

'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { isActiveDatum } from '@/lib/period'

type PeriodStripProps = {
  domain: { start: number; end: number }
  ongoing?: boolean
  /** Interpolated into the aria-label, e.g. "Research", "Engineering", a project title. */
  contextLabel?: string
}

export function PeriodStrip({ domain, ongoing = false, contextLabel }: PeriodStripProps) {
  const t = useTranslations('PeriodStrip')

  const ariaLabel = contextLabel
    ? t('aria_label', { context: contextLabel, start: domain.start, end: domain.end })
    : t('aria_label_generic', { start: domain.start, end: domain.end })

  // End tick/label follow the One Red Rule via the shared isActiveDatum —
  // modelled as a single 'present' datum (this strip has no role concept of
  // its own) so the active-colour rule stays centralised in period.ts (ADR 021).
  const active = isActiveDatum({ year: domain.end, role: 'present' }, ongoing)
  const endLabel = ongoing ? t('present_label') : String(domain.end)
  const endColour = active ? 'text-active' : 'text-ink-secondary'
  const endTickColour = active ? 'bg-active' : 'bg-ink-secondary'

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      data-testid="period-strip"
      className="flex items-center gap-sm"
    >
      {/* Below md: single label line, no witness lines/ticks (direction contract). */}
      <span className={cn('label tabular md:hidden', endColour)} data-testid="period-collapsed">
        {domain.start}–{endLabel}
      </span>

      <span
        className="hidden label text-ink-secondary tabular md:inline"
        data-testid="period-start"
      >
        {domain.start}
      </span>

      <div className="hidden items-center gap-0 md:flex" aria-hidden="true">
        <div className="period-tick bg-ink-secondary" />
        <div className="period-span bg-ink-secondary" />
        <div className={cn('period-tick', endTickColour)} />
      </div>

      <span className={cn('hidden label tabular md:inline', endColour)} data-testid="period-end">
        {endLabel}
      </span>
    </div>
  )
}
