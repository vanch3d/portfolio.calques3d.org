import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  getAllCaseStudies,
  getCaseStudyBySlug,
  getCaseStudyDir,
  getCaseStudiesForProject,
  getCaseStudyParams,
  getChapterParams,
  getChapterBySlug,
  getAdjacentChapters,
  readCaseStudySource,
  readCollectionIntro,
} from './case-studies'

describe('getAllCaseStudies', () => {
  it('returns the five core case studies', () => {
    expect(getAllCaseStudies().length).toBeGreaterThanOrEqual(5)
  })

  it('featured case studies come before non-featured', () => {
    let seenNonFeatured = false
    for (const cs of getAllCaseStudies()) {
      if (!cs.featured) seenNonFeatured = true
      if (seenNonFeatured) expect(cs.featured).toBe(false)
    }
  })

  it('every case study has required fields', () => {
    for (const cs of getAllCaseStudies()) {
      expect(cs.slug).toBeTruthy()
      expect(cs.project).toBeTruthy()
      expect(cs.title).toBeTruthy()
      expect(['draft', 'published']).toContain(cs.status)
      expect(typeof cs.featured).toBe('boolean')
      expect(Array.isArray(cs.tags)).toBe(true)
    }
  })

  it('project/slug pairs are unique (they form the URL)', () => {
    const keys = getAllCaseStudies().map((cs) => `${cs.project}/${cs.slug}`)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

describe('getCaseStudyBySlug', () => {
  it('finds a case by frontmatter project + slug, not by folder name', () => {
    // folder is "auditorygames--intrinsic-motivation"
    const cs = getCaseStudyBySlug('auditorygames', 'auditory-games')
    expect(cs?.title).toBeTruthy()
    expect(getCaseStudyDir('auditorygames', 'auditory-games')).toBe(
      'auditorygames--intrinsic-motivation'
    )
  })

  it('returns null for an unknown project/slug combination', () => {
    expect(getCaseStudyBySlug('does-not-exist', 'also-missing')).toBeNull()
    expect(getCaseStudyDir('does-not-exist', 'also-missing')).toBeNull()
  })
})

describe('getCaseStudiesForProject', () => {
  it('returns case studies matching the given project slug', () => {
    const results = getCaseStudiesForProject('hivemq-edge')
    expect(results.length).toBeGreaterThan(0)
    for (const cs of results) expect(cs.project).toBe('hivemq-edge')
  })

  it('returns an empty array for a project with no case studies', () => {
    expect(getCaseStudiesForProject('project-with-no-case-studies')).toHaveLength(0)
  })
})

describe('getCaseStudyParams', () => {
  it('has one param set per case study, each with project and slug', () => {
    const params = getCaseStudyParams()
    expect(params.length).toBe(getAllCaseStudies().length)
    for (const p of params) {
      expect(p.project).toBeTruthy()
      expect(p.slug).toBeTruthy()
    }
  })
})

describe('chaptered case (hivemq-edge/design-retro)', () => {
  const cs = getCaseStudyBySlug('hivemq-edge', 'design-retro')!
  const dir = getCaseStudyDir('hivemq-edge', 'design-retro')!

  it('declares chapters, intro and outro', () => {
    expect(cs.chapters?.length).toBeGreaterThan(0)
    expect(cs.intro).toBeTruthy()
    expect(cs.outro).toBeTruthy()
  })

  it('every declared file exists next to index.mdx', () => {
    const files = [...(cs.chapters ?? []).map((c) => c.file), cs.intro!, cs.outro!]
    for (const f of files) {
      expect(existsSync(join(process.cwd(), 'src/content/case-studies', dir, `${f}.md`))).toBe(true)
    }
  })

  it('chapter slugs are unique and yield one param triple each', () => {
    const slugs = (cs.chapters ?? []).map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    const triples = getChapterParams().filter(
      (p) => p.project === 'hivemq-edge' && p.slug === 'design-retro'
    )
    expect(triples.map((t) => t.chapter)).toEqual(slugs)
  })

  it('looks chapters up by slug', () => {
    expect(getChapterBySlug(cs, 'workspace')?.file).toBe('Portfolio_02_Workspace')
    expect(getChapterBySlug(cs, 'nope')).toBeNull()
  })

  it('computes adjacent chapters, null at both ends', () => {
    const slugs = cs.chapters!.map((c) => c.slug)
    expect(getAdjacentChapters(cs, slugs[0]).prev).toBeNull()
    expect(getAdjacentChapters(cs, slugs[0]).next?.slug).toBe(slugs[1])
    expect(getAdjacentChapters(cs, slugs.at(-1)!).next).toBeNull()
    expect(getAdjacentChapters(cs, 'nope')).toEqual({ prev: null, next: null })
  })
})

describe('flat cases', () => {
  it('have no chapters and contribute no chapter params', () => {
    const cs = getCaseStudyBySlug('calques3d', 'calques3d')!
    expect(cs.chapters).toBeUndefined()
    expect(getChapterParams().some((p) => p.project === 'calques3d')).toBe(false)
  })
})

describe('source readers', () => {
  it('reads index.mdx source without frontmatter', () => {
    const src = readCaseStudySource('calques3d--wireframe-geometry')
    expect(src.startsWith('---')).toBe(false)
    expect(src).toContain('![')
  })

  it('reads a chapter file by name', () => {
    expect(readCaseStudySource('hivemq-edge--design-retro', 'Portfolio_00_Thesis')).toContain('#')
  })

  it('throws for a missing file', () => {
    expect(() => readCaseStudySource('hivemq-edge--design-retro', 'Nope')).toThrow()
  })

  it('reads the collection intro', () => {
    expect(readCollectionIntro()).toContain('Design by building')
  })
})
