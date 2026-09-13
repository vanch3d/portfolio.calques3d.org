/**
 * Period utilities
 *
 * Pure functions for working with period date strings used across content types.
 * Period dates follow ISO conventions: "YYYY" (year only) or "YYYY-MM" (month precision).
 */

/**
 * Extracts the 4-digit year from a period date string.
 * Accepts "YYYY", "YYYY-MM", or "YYYY-MM-DD".
 *
 * @throws {Error} if the string does not start with a 4-digit year
 */
export function extractYear(dateString: string): string {
  const year = dateString.substring(0, 4)
  if (!/^\d{4}$/.test(year)) {
    throw new Error(`Invalid period date string: "${dateString}"`)
  }
  return year
}

/**
 * Formats a period as "YYYY–YYYY" or "YYYY–{presentLabel}".
 *
 * @param start       - period start string ("YYYY" or "YYYY-MM")
 * @param end         - period end string, or null for ongoing
 * @param presentLabel - localised label for an ongoing period, e.g. "present"
 */
export function formatPeriod(start: string, end: string | null, presentLabel: string): string {
  return `${extractYear(start)}–${end ? extractYear(end) : presentLabel}`
}

/**
 * Timeline constants shared by every "local timeline" implementation
 * (PeriodRuler, PeriodStrip, EraColumn) — see ADR 020 addendum / Track P plan.
 */

/** First year of the career — left boundary of the homepage/footer ruler domain. */
export const CAREER_START = 1995

/** Year the career pivoted from research to engineering. */
export const ERA_TRANSITION = 2018

/**
 * Near-collision threshold.
 * When two datums are within this % of domain width apart, their labels are
 * staggered above/below the baseline (see assignLabelPositions).
 */
export const MIN_RULER_GAP_PCT = 4

export type DatumRole =
  | 'default' // career boundary / generic — graphite
  | 'transition' // era transition (2018) — graphite
  | 'project-start' // project start — graphite unless active
  | 'project-end' // project end — active (red) if ongoing
  | 'present' // "PRESENT" label at right edge — active if ongoing

export type PeriodDatum = {
  year: number
  /** Label text. Defaults to String(year). Pass null to suppress entirely. */
  label?: string | null
  role?: DatumRole
  /** Override auto-stagger. When set, component respects this and skips auto-stagger for this datum. */
  labelPosition?: 'above' | 'below'
}

/**
 * Returns true if this datum should render in active (red) colour.
 * Only 'project-end' and 'present' roles are ever active — the One Red Rule
 * restricts the active mark to the current end of an ongoing project.
 */
export function isActiveDatum(datum: PeriodDatum, ongoing: boolean): boolean {
  return ongoing && (datum.role === 'project-end' || datum.role === 'present')
}

const ROLE_PRIORITY: Record<DatumRole, number> = {
  present: 5,
  'project-end': 4,
  'project-start': 3,
  transition: 2,
  default: 1,
}

/**
 * Merge datums that share the same year.
 * Priority order (highest first): present > project-end > project-start > transition > default
 * Labels: if identical → one; if different → winner label first, then others
 * labelPosition: preserved from any datum in the group that has it set
 * Colour: active wins (the winning role determines isActiveDatum's outcome)
 */
export function deduplicateDatums(datums: PeriodDatum[], ongoing: boolean): PeriodDatum[] {
  void ongoing

  const byYear = new Map<number, PeriodDatum[]>()
  for (const d of datums) {
    const group = byYear.get(d.year) ?? []
    group.push(d)
    byYear.set(d.year, group)
  }

  return Array.from(byYear.values()).map((group) => {
    if (group.length === 1) return group[0]

    const winner = group.reduce((a, b) =>
      ROLE_PRIORITY[b.role ?? 'default'] > ROLE_PRIORITY[a.role ?? 'default'] ? b : a
    )

    const winnerLabel = winner.label !== undefined ? winner.label : String(winner.year)
    const otherLabels = group
      .filter((d) => d !== winner)
      .map((d) => (d.label !== undefined ? d.label : String(d.year)))
      .filter((l): l is string => l !== null)
    const allLabels = [
      ...new Set([winnerLabel, ...otherLabels].filter((l): l is string => l !== null)),
    ]
    const mergedLabel = allLabels.join(' / ') || null

    const inheritedLabelPosition = group.find((d) => d.labelPosition !== undefined)?.labelPosition

    return {
      ...winner,
      label: mergedLabel,
      ...(inheritedLabelPosition !== undefined ? { labelPosition: inheritedLabelPosition } : {}),
    }
  })
}

/**
 * Assign above/below stagger to datums that are too close together.
 * Datums with a caller-supplied labelPosition are not touched.
 * Operates on already-deduped datums, sorted ascending by year.
 * When two datums collide: the earlier (lower year) goes above, the later goes below.
 */
export function assignLabelPositions(
  datums: PeriodDatum[],
  domain: { start: number; end: number },
  minGapPct: number
): PeriodDatum[] {
  const span = domain.end - domain.start
  const sorted = [...datums].sort((a, b) => a.year - b.year)

  const result: PeriodDatum[] = sorted.map((d) => ({ ...d }))
  const callerSupplied = new Set(
    sorted.map((d, i) => (d.labelPosition !== undefined ? i : -1)).filter((i) => i >= 0)
  )
  // Indices whose position was already fixed by a collision decision — once fixed,
  // a later collision must alternate off that fixed value rather than re-flip it,
  // otherwise a 3+ chain can re-collide with an earlier label (see ADR 021 review).
  const touched = new Set<number>()

  for (let i = 0; i < result.length; i++) {
    if (callerSupplied.has(i)) continue

    const prevIdx = i - 1
    if (prevIdx >= 0 && !callerSupplied.has(prevIdx)) {
      const prevPct = ((result[prevIdx].year - domain.start) / span) * 100
      const thisPct = ((result[i].year - domain.start) / span) * 100
      if (thisPct - prevPct < minGapPct) {
        if (!touched.has(prevIdx)) {
          result[prevIdx] = { ...result[prevIdx], labelPosition: 'above' }
          touched.add(prevIdx)
        }
        const prevPosition = result[prevIdx].labelPosition ?? 'below'
        result[i] = {
          ...result[i],
          labelPosition: prevPosition === 'above' ? 'below' : 'above',
        }
        touched.add(i)
        continue
      }
    }

    result[i] = { ...result[i], labelPosition: 'below' }
  }

  return result
}
