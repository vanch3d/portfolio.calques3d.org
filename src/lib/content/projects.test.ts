import { describe, it, expect } from 'vitest'
import {
  getProjectBySlug,
  getAllProjectSlugs,
  getProjectsByPosition,
  getAllProjectsChronological,
} from './projects'
import { getResearchSlugs } from './research'
import { getEngineeringSlugs } from './engineering'
import { getPositionMap } from './positions'

const RESEARCH_POSITION_TYPES = new Set(['academic', 'phd'])
const ENGINEERING_POSITION_TYPES = new Set(['employment', 'contract', 'freelance', 'voluntary'])

describe('getProjectBySlug', () => {
  it('resolves a research project with type "research"', () => {
    const result = getProjectBySlug('calques3d')
    expect(result).not.toBeNull()
    expect(result?.type).toBe('research')
    expect(result?.project.slug).toBe('calques3d')
  })

  it('resolves an engineering project with type "engineering"', () => {
    const result = getProjectBySlug('hivemq-edge')
    expect(result).not.toBeNull()
    expect(result?.type).toBe('engineering')
    expect(result?.project.slug).toBe('hivemq-edge')
  })

  it('returns null for a slug that exists in neither directory', () => {
    expect(getProjectBySlug('does-not-exist-xyz')).toBeNull()
  })

  it('narrows to ResearchProject fields when type is research', () => {
    const result = getProjectBySlug('calques3d')
    if (result?.type === 'research') {
      // funding/coordinates are research-only fields — this is a compile-time
      // narrowing check as much as a runtime one.
      expect(result.project.type).toBe('research')
    } else {
      throw new Error('expected a research project')
    }
  })

  it('narrows to EngineeringProject fields when type is engineering', () => {
    const result = getProjectBySlug('hivemq-edge')
    if (result?.type === 'engineering') {
      expect(result.project.type).toBe('engineering')
    } else {
      throw new Error('expected an engineering project')
    }
  })
})

describe('getAllProjectSlugs', () => {
  it('returns the combined count of research and engineering slugs', () => {
    expect(getAllProjectSlugs().length).toBe(
      getResearchSlugs().length + getEngineeringSlugs().length
    )
  })

  it('includes a known research slug and a known engineering slug', () => {
    const slugs = getAllProjectSlugs()
    expect(slugs).toContain('calques3d')
    expect(slugs).toContain('hivemq-edge')
  })

  it('contains no duplicate slugs', () => {
    const slugs = getAllProjectSlugs()
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('getProjectsByPosition', () => {
  it('returns every project for a position with multiple projects, sorted by period.start', () => {
    const results = getProjectsByPosition('nancy')
    expect(results.map((r) => r.project.slug)).toEqual(['calques3d', 'ilp'])
  })

  it('returns a single-element array for a position with one project', () => {
    const results = getProjectsByPosition('hivemq')
    expect(results).toHaveLength(1)
    expect(results[0].project.slug).toBe('hivemq-edge')
  })

  it('returns an empty array for a position with no projects', () => {
    expect(getProjectsByPosition('does-not-exist-xyz')).toEqual([])
  })
})

describe('getAllProjectsChronological', () => {
  it('includes every project exactly once, in ascending period.start order', () => {
    const all = getAllProjectsChronological()
    expect(all).toHaveLength(getAllProjectSlugs().length)

    const starts = all.map((r) => r.project.period.start)
    const sorted = [...starts].sort((a, b) => a.localeCompare(b))
    expect(starts).toEqual(sorted)
  })

  it('breaks a tied start date by title when neither project is primary', () => {
    // calques3d and ilp both start in 1995; neither is flagged `primary` in
    // content today, so the tie falls through to title alphabetical order.
    const all = getAllProjectsChronological()
    const calques3dIndex = all.findIndex((r) => r.project.slug === 'calques3d')
    const ilpIndex = all.findIndex((r) => r.project.slug === 'ilp')
    expect(calques3dIndex).toBeLessThan(ilpIndex)

    // auditorygames and makingstuff both start in 2008 — same rule applies.
    const auditoryIndex = all.findIndex((r) => r.project.slug === 'auditorygames')
    const makingStuffIndex = all.findIndex((r) => r.project.slug === 'makingstuff')
    expect(auditoryIndex).toBeLessThan(makingStuffIndex)
  })

  it('every project type agrees with its position era (catches a mistyped project.type/directory placement)', () => {
    // EraTimeline filters homepage columns on the directory-derived resolution
    // type, not this frontmatter field — so a mistyped project.type wouldn't
    // misplace a homepage row. But it would silently desync from the
    // position it's filed under, which every other consumer of `position`
    // assumes is consistent. This guards that assumption directly.
    const positions = getPositionMap()
    const all = getAllProjectsChronological()

    for (const { project, type } of all) {
      const position = positions.get(project.position)
      if (!position) continue

      const expectedTypes =
        type === 'research' ? RESEARCH_POSITION_TYPES : ENGINEERING_POSITION_TYPES
      expect(
        expectedTypes.has(position.type),
        `project "${project.slug}" (type: ${type}) is filed under position "${position.slug}" (type: ${position.type}), which belongs to the other era`
      ).toBe(true)
    }
  })
})
