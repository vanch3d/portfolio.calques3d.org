import { describe, it, expect } from 'vitest'
import {
  extractYear,
  formatPeriod,
  isActiveDatum,
  deduplicateDatums,
  assignLabelPositions,
} from './period'
import type { PeriodDatum } from './period'

describe('extractYear', () => {
  it('extracts year from YYYY string', () => {
    expect(extractYear('1995')).toBe('1995')
  })

  it('extracts year from YYYY-MM string', () => {
    expect(extractYear('2023-04')).toBe('2023')
  })

  it('extracts year from YYYY-MM-DD string', () => {
    expect(extractYear('2010-09-01')).toBe('2010')
  })

  it('throws for an empty string', () => {
    expect(() => extractYear('')).toThrow('Invalid period date string: ""')
  })

  it('throws when the string does not start with four digits', () => {
    expect(() => extractYear('abc-04')).toThrow('Invalid period date string: "abc-04"')
  })
})

describe('formatPeriod', () => {
  it('formats a closed period as YYYY–YYYY', () => {
    expect(formatPeriod('1995', '2010', 'present')).toBe('1995–2010')
  })

  it('formats a closed period with YYYY-MM start and end', () => {
    expect(formatPeriod('2023-04', '2024-12', 'present')).toBe('2023–2024')
  })

  it('formats an open-ended period using the presentLabel', () => {
    expect(formatPeriod('2023-04', null, 'present')).toBe('2023–present')
  })

  it('uses the supplied presentLabel verbatim', () => {
    expect(formatPeriod('2018', null, "aujourd'hui")).toBe("2018–aujourd'hui")
  })

  it('throws when start is invalid', () => {
    expect(() => formatPeriod('not-a-date', null, 'present')).toThrow()
  })

  it('throws when end is invalid', () => {
    expect(() => formatPeriod('2020', 'bad', 'present')).toThrow()
  })
})

describe('isActiveDatum', () => {
  it('returns false for any role when ongoing is false', () => {
    expect(isActiveDatum({ year: 2020, role: 'project-end' }, false)).toBe(false)
    expect(isActiveDatum({ year: 2020, role: 'present' }, false)).toBe(false)
  })

  it('returns true for project-end when ongoing', () => {
    expect(isActiveDatum({ year: 2020, role: 'project-end' }, true)).toBe(true)
  })

  it('returns true for present when ongoing', () => {
    expect(isActiveDatum({ year: 2020, role: 'present' }, true)).toBe(true)
  })

  it('returns false for project-start when ongoing', () => {
    expect(isActiveDatum({ year: 2020, role: 'project-start' }, true)).toBe(false)
  })

  it('returns false for default role when ongoing', () => {
    expect(isActiveDatum({ year: 1995, role: 'default' }, true)).toBe(false)
  })

  it('returns false for transition role when ongoing', () => {
    expect(isActiveDatum({ year: 2018, role: 'transition' }, true)).toBe(false)
  })
})

describe('deduplicateDatums', () => {
  it('returns a single datum unchanged', () => {
    const datums: PeriodDatum[] = [{ year: 1995, role: 'default' }]
    const result = deduplicateDatums(datums, false)
    expect(result).toHaveLength(1)
    expect(result[0].year).toBe(1995)
    expect(result[0].role).toBe('default')
  })

  it('returns two datums at different years unchanged', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 2018, role: 'transition' },
    ]
    const result = deduplicateDatums(datums, false)
    expect(result).toHaveLength(2)
  })

  it('merges two datums at the same year — higher-priority role wins', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 1995, role: 'project-start' },
    ]
    const result = deduplicateDatums(datums, false)
    expect(result).toHaveLength(1)
    expect(result[0].role).toBe('project-start')
  })

  it('merges labels when they are different', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, label: '1995', role: 'default' },
      { year: 1995, label: 'Start', role: 'project-start' },
    ]
    const result = deduplicateDatums(datums, false)
    expect(result).toHaveLength(1)
    expect(result[0].label).toBe('Start / 1995')
  })

  it('deduplicates identical labels — does not produce "1995 / 1995"', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 1995, role: 'project-start' },
    ]
    const result = deduplicateDatums(datums, false)
    expect(result).toHaveLength(1)
    expect(result[0].label).toBe('1995')
  })

  it('priority order: present > project-end > project-start > transition > default', () => {
    const datums: PeriodDatum[] = [
      { year: 2024, role: 'project-end' },
      { year: 2024, role: 'present' },
    ]
    const result = deduplicateDatums(datums, true)
    expect(result[0].role).toBe('present')
  })

  it('preserves caller-supplied labelPosition from the winning datum', () => {
    const datums: PeriodDatum[] = [
      { year: 2018, role: 'default', labelPosition: 'above' },
      { year: 2018, role: 'transition' },
    ]
    const result = deduplicateDatums(datums, false)
    expect(result[0].labelPosition).toBe('above')
  })

  it('handles null label — filters it from merge', () => {
    const datums: PeriodDatum[] = [
      { year: 2018, role: 'default', label: null },
      { year: 2018, role: 'transition', label: '2018' },
    ]
    const result = deduplicateDatums(datums, false)
    expect(result[0].label).toBe('2018')
  })
})

describe('assignLabelPositions', () => {
  const domain = { start: 1995, end: 2026 }

  it('assigns below to all datums when they are far apart', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 2018, role: 'transition' },
      { year: 2026, role: 'default' },
    ]
    const result = assignLabelPositions(datums, domain, 4)
    expect(result.every((d) => d.labelPosition === 'below')).toBe(true)
  })

  it('staggers near-collision datums above/below', () => {
    const datums: PeriodDatum[] = [
      { year: 1996, role: 'default' },
      { year: 1997, role: 'project-start' },
    ]
    const result = assignLabelPositions(datums, domain, 4)
    const sorted = [...result].sort((a, b) => a.year - b.year)
    expect(sorted[0].labelPosition).toBe('above')
    expect(sorted[1].labelPosition).toBe('below')
  })

  it('respects caller-supplied labelPosition and does not override it', () => {
    const datums: PeriodDatum[] = [
      { year: 1996, role: 'default', labelPosition: 'above' },
      { year: 1997, role: 'project-start' },
    ]
    const result = assignLabelPositions(datums, domain, 4)
    const first = result.find((d) => d.year === 1996)
    expect(first?.labelPosition).toBe('above')
  })

  it('sorts datums by year ascending', () => {
    const datums: PeriodDatum[] = [
      { year: 2018, role: 'transition' },
      { year: 1995, role: 'default' },
    ]
    const result = assignLabelPositions(datums, domain, 4)
    expect(result[0].year).toBe(1995)
    expect(result[1].year).toBe(2018)
  })

  it('does not stagger datums that are exactly at minGapPct apart', () => {
    const wideDomain = { start: 1995, end: 1995 + 100 }
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 1999, role: 'project-start' },
    ]
    const result = assignLabelPositions(datums, wideDomain, 4)
    expect(result.every((d) => d.labelPosition === 'below')).toBe(true)
  })
})
