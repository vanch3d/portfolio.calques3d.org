import { describe, it, expect } from 'vitest'
import { buildSprinkle, pickSprinkle } from './arc-sprinkles'
import type { ResearchProject } from '@/types/content'

// ─── Fixtures ────────────────────────────────────────────────────────────────

function makeProject(overrides: Partial<ResearchProject> = {}): ResearchProject {
  return {
    slug: 'test-project',
    title: 'Test Research Project',
    abbr: 'TRP',
    type: 'research',
    status: 'completed',
    visibility: 'public',
    featured: false,
    position: 'test-position',
    period: { start: '2010', end: '2014' },
    links: {},
    tags: ['tagA', 'tagB', 'tagC', 'tagD'],
    ...overrides,
  }
}

const PRESENT = 'present'
const CURRENT_YEAR = 2026

// ─── buildSprinkle ───────────────────────────────────────────────────────────

describe('buildSprinkle', () => {
  it('uses abbr when present', () => {
    const p = makeProject({ abbr: 'MyAbbr', period: { start: '2010', end: '2014' } })
    expect(buildSprinkle(p, PRESENT, CURRENT_YEAR).title).toBe('MyAbbr · 2010–2014')
  })

  it('falls back to title when abbr is absent', () => {
    const p = makeProject({
      abbr: undefined,
      title: 'Full Title',
      period: { start: '2010', end: '2014' },
    })
    expect(buildSprinkle(p, PRESENT, CURRENT_YEAR).title).toBe('Full Title · 2010–2014')
  })

  it('uses the presentLabel for an open-ended period', () => {
    const p = makeProject({ period: { start: '2023-04', end: null } })
    expect(buildSprinkle(p, "aujourd'hui", CURRENT_YEAR).title).toContain("aujourd'hui")
  })

  it('includes first three tags in subtitle', () => {
    const p = makeProject({ tags: ['Alpha', 'Beta', 'Gamma', 'Delta'] })
    expect(buildSprinkle(p, PRESENT, CURRENT_YEAR).subtitle).toBe('Alpha · Beta · Gamma')
  })

  it('subtitle is empty string when project has no tags', () => {
    const p = makeProject({ tags: [] })
    expect(buildSprinkle(p, PRESENT, CURRENT_YEAR).subtitle).toBe('')
  })

  it('subtitle uses all tags when fewer than three', () => {
    const p = makeProject({ tags: ['Only'] })
    expect(buildSprinkle(p, PRESENT, CURRENT_YEAR).subtitle).toBe('Only')
  })

  it('periodStartYear/periodEndYear are the numeric years of a closed period', () => {
    const p = makeProject({ period: { start: '2010', end: '2014' } })
    const result = buildSprinkle(p, PRESENT, CURRENT_YEAR)
    expect(result.periodStartYear).toBe(2010)
    expect(result.periodEndYear).toBe(2014)
  })

  it('periodEndYear falls back to currentYear for an ongoing project (period.end === null)', () => {
    const p = makeProject({ period: { start: '2023-04', end: null } })
    const result = buildSprinkle(p, PRESENT, CURRENT_YEAR)
    expect(result.periodStartYear).toBe(2023)
    expect(result.periodEndYear).toBe(CURRENT_YEAR)
  })
})

// ─── pickSprinkle ────────────────────────────────────────────────────────────

describe('pickSprinkle', () => {
  it('returns null when project list is empty', () => {
    expect(pickSprinkle([], '2010', PRESENT, CURRENT_YEAR)).toBeNull()
  })

  it('returns null when no project overlaps idealYear', () => {
    const p = makeProject({ period: { start: '2015', end: '2018' } })
    expect(pickSprinkle([p], '2010', PRESENT, CURRENT_YEAR)).toBeNull()
  })

  it('returns a sprinkle for a project whose period contains idealYear', () => {
    const p = makeProject({ period: { start: '2010', end: '2014' } })
    expect(pickSprinkle([p], '2012', PRESENT, CURRENT_YEAR)).not.toBeNull()
  })

  it('matches a project with idealYear equal to period.start', () => {
    const p = makeProject({ period: { start: '2010', end: '2014' } })
    expect(pickSprinkle([p], '2010', PRESENT, CURRENT_YEAR)).not.toBeNull()
  })

  it('matches a project with idealYear equal to period.end', () => {
    const p = makeProject({ period: { start: '2010', end: '2014' } })
    expect(pickSprinkle([p], '2014', PRESENT, CURRENT_YEAR)).not.toBeNull()
  })

  it('matches an ongoing project (null end) for any year after start', () => {
    const p = makeProject({ period: { start: '2023-04', end: null } })
    expect(pickSprinkle([p], '2025', PRESENT, CURRENT_YEAR)).not.toBeNull()
  })

  it('excludes a project that ends before idealYear', () => {
    const early = makeProject({ slug: 'early', period: { start: '2005', end: '2009' } })
    expect(pickSprinkle([early], '2010', PRESENT, CURRENT_YEAR)).toBeNull()
  })

  it('excludes a project that starts after idealYear', () => {
    const late = makeProject({ slug: 'late', period: { start: '2015', end: '2018' } })
    expect(pickSprinkle([late], '2010', PRESENT, CURRENT_YEAR)).toBeNull()
  })

  it('prefers a featured candidate over non-featured', () => {
    const plain = makeProject({
      slug: 'plain',
      abbr: 'PLN',
      featured: false,
      period: { start: '2010', end: '2014' },
    })
    const star = makeProject({
      slug: 'star',
      abbr: 'STR',
      featured: true,
      period: { start: '2010', end: '2014' },
    })
    // Run many times to ensure the featured project always wins
    const results = Array.from({ length: 20 }, () =>
      pickSprinkle([plain, star], '2012', PRESENT, CURRENT_YEAR)
    )
    expect(results.every((r) => r?.title.startsWith('STR'))).toBe(true)
  })

  it('picks randomly from non-featured pool when none are featured', () => {
    const a = makeProject({
      slug: 'a',
      abbr: 'AAA',
      featured: false,
      period: { start: '2010', end: '2014' },
    })
    const b = makeProject({
      slug: 'b',
      abbr: 'BBB',
      featured: false,
      period: { start: '2010', end: '2014' },
    })
    const seen = new Set<string>()
    for (let i = 0; i < 100; i++) {
      const r = pickSprinkle([a, b], '2012', PRESENT, CURRENT_YEAR)
      if (r) seen.add(r.title.substring(0, 3))
    }
    // With 100 tries, both should appear at least once
    expect(seen.has('AAA')).toBe(true)
    expect(seen.has('BBB')).toBe(true)
  })

  it('returns a result with the correct present label', () => {
    const p = makeProject({ period: { start: '2023', end: null } })
    const result = pickSprinkle([p], '2023', 'now', CURRENT_YEAR)
    expect(result?.title).toContain('now')
  })

  it('normalises a month-precision idealYear to its year component', () => {
    // "2012-04" should be treated as "2012" — matching a project spanning 2010–2014
    const p = makeProject({ period: { start: '2010', end: '2014' } })
    expect(pickSprinkle([p], '2012-04', PRESENT, CURRENT_YEAR)).not.toBeNull()
  })

  it('throws when idealYear is not a valid date string', () => {
    const p = makeProject({ period: { start: '2010', end: '2014' } })
    expect(() => pickSprinkle([p], 'not-a-year', PRESENT, CURRENT_YEAR)).toThrow()
  })
})
