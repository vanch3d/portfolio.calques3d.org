import { describe, it, expect } from 'vitest'
import {
  getAllEngineeringProjects,
  getEngineeringProjectBySlug,
  getEngineeringSlugs,
} from './engineering'

describe('getAllEngineeringProjects', () => {
  it('returns at least one project', () => {
    expect(getAllEngineeringProjects().length).toBeGreaterThan(0)
  })

  it('featured projects come before non-featured', () => {
    const projects = getAllEngineeringProjects()
    let seenNonFeatured = false
    for (const p of projects) {
      if (!p.featured) seenNonFeatured = true
      if (seenNonFeatured) expect(p.featured).toBe(false)
    }
  })

  it('slugs never contain the .mdx extension', () => {
    for (const p of getAllEngineeringProjects()) {
      expect(p.slug).not.toMatch(/\.mdx$/)
    }
  })

  it('every project has required fields', () => {
    for (const p of getAllEngineeringProjects()) {
      expect(p.slug).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.period.start).toBeTruthy()
      expect(p.type).toBe('engineering')
      expect(['completed', 'ongoing', 'archived']).toContain(p.status)
      expect(['public', 'proprietary', 'redacted']).toContain(p.visibility)
    }
  })
})

describe('getEngineeringProjectBySlug', () => {
  it('returns the correct project for a known slug', () => {
    const slugs = getEngineeringSlugs()
    const first = slugs[0]
    const project = getEngineeringProjectBySlug(first)
    expect(project).not.toBeNull()
    expect(project?.slug).toBe(first)
    expect(project?.type).toBe('engineering')
  })

  it('returns null for an unknown slug', () => {
    expect(getEngineeringProjectBySlug('does-not-exist-xyz')).toBeNull()
  })
})

describe('getEngineeringSlugs', () => {
  it('returns at least one slug', () => {
    expect(getEngineeringSlugs().length).toBeGreaterThan(0)
  })

  it('slugs have no .mdx extension', () => {
    for (const slug of getEngineeringSlugs()) {
      expect(slug).not.toMatch(/\.mdx$/)
    }
  })

  it('slug count matches getAllEngineeringProjects count', () => {
    expect(getEngineeringSlugs().length).toBe(getAllEngineeringProjects().length)
  })
})
