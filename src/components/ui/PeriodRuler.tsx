/**
 * PeriodRuler — Client, needs i18n (useTranslations('PeriodRuler'))
 *
 * Full-width proportional ruler with a horizontal baseline and labelled ticks
 * at caller-supplied datum positions. Used by ProjectFooter (Pass 2) and
 * EraColumn (Pass 1).
 *
 * Optional `span` prop: renders a heavier bar floating above the baseline
 * between two years, marking a sub-range (e.g. project period) visually
 * distinct from the structural context ticks. Span boundary ticks are taller
 * (h-tick-project) than context ticks (h-tick-tall).
 *
 * i18n: owns its own aria-label and "present" copy via useTranslations —
 * callers pass only data (domain, datums, span, ongoing, contextLabel), never
 * pre-rendered strings. See .claude/rules/i18n.md (ColorSwatch pattern) and
 * the Track P plan's Decision 2 (this replaced a `rulerAriaLabel` string prop
 * in a scrapped prior attempt).
 *
 * Legitimate style={} uses (runtime-computed values that cannot be tokens):
 *   - Tick left position:      style={{ left: "N%" }}
 *   - Label left (mid-ruler):  style={{ left: "N%" }}
 *   - Span bar left + width:   style={{ left: "N%", width: "N%" }}
 *
 * All colour, size, and spacing values come from design tokens via className.
 * Accessibility: role="img" wrapper, all decorative children aria-hidden.
 */

'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import {
  deduplicateDatums,
  assignLabelPositions,
  isActiveDatum,
  MIN_RULER_GAP_PCT,
} from '@/lib/period'
import type { PeriodDatum } from '@/lib/period'

export type { PeriodDatum }

type PeriodRulerProps = {
  domain: { start: number; end: number }
  datums: PeriodDatum[]
  /** When set, renders a heavier bar above the baseline between these two years. */
  span?: { from: number; to: number }
  ongoing?: boolean
  /** Interpolated into the aria-label, e.g. "Research", "Engineering", a project title. */
  contextLabel?: string
}

function toPercent(year: number, domain: { start: number; end: number }): string {
  const domainSpan = domain.end - domain.start
  const pct = ((year - domain.start) / domainSpan) * 100
  return `${Math.max(0, Math.min(100, pct)).toFixed(2)}%`
}

export function PeriodRuler({
  domain,
  datums,
  span,
  ongoing = false,
  contextLabel,
}: PeriodRulerProps) {
  const t = useTranslations('PeriodRuler')

  const ariaLabel = contextLabel
    ? t('aria_label', { context: contextLabel, start: domain.start, end: domain.end })
    : t('aria_label_generic', { start: domain.start, end: domain.end })

  // Datums outside the domain would be clamped to the boundary by toPercent,
  // creating a phantom tick that visually collides with the boundary tick.
  const inDomain = datums.filter((d) => d.year >= domain.start && d.year <= domain.end)
  const deduped = deduplicateDatums(inDomain, ongoing)
  const positioned = assignLabelPositions(deduped, domain, MIN_RULER_GAP_PCT)

  // Span bar geometry (runtime-computed — must be style)
  const spanFromPct = span ? toPercent(span.from, domain) : null
  const spanWidthPct = span
    ? `${(((span.to - span.from) / (domain.end - domain.start)) * 100).toFixed(2)}%`
    : null
  const spanActive = ongoing

  return (
    <div role="img" aria-label={ariaLabel} data-testid="period-ruler" className="relative h-2xl">
      <div
        className="absolute inset-x-0 top-1/2 h-line-medium -translate-y-1/2 bg-ink-secondary"
        aria-hidden="true"
      />

      {span && spanFromPct && spanWidthPct && (
        <div
          className={cn('ruler-span-bar', spanActive ? 'bg-active' : 'bg-ink')}
          style={{ left: spanFromPct, width: spanWidthPct }}
          aria-hidden="true"
        />
      )}

      {positioned.map((datum) => {
        const active = isActiveDatum(datum, ongoing)
        const pct = toPercent(datum.year, domain)
        const isStart = datum.year === domain.start
        const isEnd = datum.year === domain.end
        const isSpanBoundary = span && (datum.year === span.from || datum.year === span.to)
        const labelText = datum.label !== undefined ? datum.label : String(datum.year)
        const above = datum.labelPosition === 'above'

        return (
          <div key={datum.year} aria-hidden="true">
            <div
              className={cn(
                'absolute top-1/2 w-line-medium -translate-y-1/2',
                isSpanBoundary ? 'h-tick-project' : 'h-tick-tall',
                active ? 'bg-active' : 'bg-ink-secondary'
              )}
              style={{ left: pct }}
            />
            {labelText !== null && (
              <span
                className={cn(
                  'absolute label text-micro whitespace-nowrap tabular',
                  active ? 'text-active' : 'text-ink-secondary',
                  above ? 'ruler-label-above' : 'ruler-label-below',
                  isEnd ? 'right-0' : isStart ? 'left-0' : '-translate-x-1/2'
                )}
                style={!isStart && !isEnd ? { left: pct } : undefined}
              >
                {labelText}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
