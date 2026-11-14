import { describe, expect, it } from 'vitest'
import type { CaseStudy } from '@/types/content'
import { getCaseStudiesForProject } from './case-studies'
import {
  countCaseStudiesByProject,
  getCaseStudyCountsByProject,
  getCaseStudyGroups,
  getFeaturedCaseStudyItems,
  groupCaseStudiesByEra,
  type ProjectRef,
} from './case-study-groups'

function cs(overrides: Partial<CaseStudy> & Pick<CaseStudy, 'slug' | 'project'>): CaseStudy {
  return { title: overrides.slug, status: 'draft', featured: false, tags: [], ...overrides }
}

const PROJECTS: Record<string, ProjectRef> = {
  edge: { title: 'HiveMQ Edge', type: 'engineering' },
  alpha: { title: 'Alpha', type: 'research' },
  beta: { title: 'Beta', type: 'research' },
}
const resolve = (slug: string) => PROJECTS[slug] ?? null

describe('groupCaseStudiesByEra', () => {
  it('puts Engineering before Research and numbers across groups', () => {
    const groups = groupCaseStudiesByEra(
      [
        cs({ slug: 'a', project: 'alpha', order: 2 }),
        cs({ slug: 'e', project: 'edge', order: 1 }),
        cs({ slug: 'b', project: 'beta', order: 3 }),
      ],
      resolve
    )
    expect(groups.map((g) => g.era)).toEqual(['engineering', 'research'])
    expect(groups.flatMap((g) => g.items.map((i) => [i.caseStudy.slug, i.number]))).toEqual([
      ['e', 1],
      ['a', 2],
      ['b', 3],
    ])
  })

  it('omits an empty group and restarts numbering at 1', () => {
    const groups = groupCaseStudiesByEra([cs({ slug: 'a', project: 'alpha' })], resolve)
    expect(groups).toHaveLength(1)
    expect(groups[0].era).toBe('research')
    expect(groups[0].items[0].number).toBe(1)
  })

  it('returns no groups for no case studies', () => {
    expect(groupCaseStudiesByEra([], resolve)).toEqual([])
  })

  it('orders by `order` ascending, unordered last by title', () => {
    const groups = groupCaseStudiesByEra(
      [
        cs({ slug: 'z', project: 'alpha', title: 'Zed' }),
        cs({ slug: 'y', project: 'alpha', title: 'Why', order: 2 }),
        cs({ slug: 'x', project: 'alpha', title: 'Ex', order: 1 }),
        cs({ slug: 'a', project: 'alpha', title: 'Aye' }),
      ],
      resolve
    )
    expect(groups[0].items.map((i) => i.caseStudy.slug)).toEqual(['x', 'y', 'a', 'z'])
  })

  it('looks up the project display name, chapter count and href', () => {
    const [group] = groupCaseStudiesByEra(
      [
        cs({
          slug: 'design-retro',
          project: 'edge',
          chapters: [{ file: 'f', slug: 'one', title: 'One' }],
        }),
      ],
      resolve
    )
    expect(group.items[0]).toMatchObject({
      projectName: 'HiveMQ Edge',
      chapterCount: 1,
      href: '/case-studies/edge/design-retro',
    })
  })

  it('throws for an unknown project', () => {
    expect(() => groupCaseStudiesByEra([cs({ slug: 'a', project: 'nope' })], resolve)).toThrow(
      /unknown project/
    )
  })
})

describe('content-bound helpers', () => {
  it('groups every real case study under a resolvable project', () => {
    const groups = getCaseStudyGroups()
    expect(groups.map((g) => g.era)).toEqual(['engineering', 'research'])
    const all = groups.flatMap((g) => g.items)
    expect(all.length).toBeGreaterThanOrEqual(5)
    expect(all.every((i) => i.projectName.length > 0)).toBe(true)
  })

  it('features HiveMQ Edge', () => {
    expect(getFeaturedCaseStudyItems().map((i) => i.caseStudy.project)).toContain('hivemq-edge')
  })

  it('counts the case studies of the real projects', () => {
    const edge = getCaseStudiesForProject('hivemq-edge').length
    expect(edge).toBeGreaterThan(0)
    expect(getCaseStudyCountsByProject().get('hivemq-edge')).toBe(edge)
  })
})

describe('countCaseStudiesByProject', () => {
  it('counts per project and leaves out projects without a case study', () => {
    const counts = countCaseStudiesByProject([
      cs({ slug: 'a', project: 'alpha' }),
      cs({ slug: 'b', project: 'alpha' }),
      cs({ slug: 'e', project: 'edge' }),
    ])
    expect(counts.get('alpha')).toBe(2)
    expect(counts.get('edge')).toBe(1)
    expect(counts.has('beta')).toBe(false)
  })

  it('is empty without case studies', () => {
    expect(countCaseStudiesByProject([]).size).toBe(0)
  })
})
