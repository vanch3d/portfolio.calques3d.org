import { describe, it, expect } from 'vitest'
import { getProjectBySlug, getAllProjectSlugs } from './projects'
import { getResearchSlugs } from './research'
import { getEngineeringSlugs } from './engineering'

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
