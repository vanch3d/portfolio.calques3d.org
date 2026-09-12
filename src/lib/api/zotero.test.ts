import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getAllPublications, getPublicationsByProject } from './zotero'

// Env vars are required by getConfig() — stub them for all tests in this file
beforeEach(() => {
  vi.stubEnv('ZOTERO_USER_ID', '99999')
  vi.stubEnv('ZOTERO_API_KEY', 'test-api-key')
  vi.stubEnv('ZOTERO_COLLECTION_ID', 'TESTCOLL')
})

describe('getAllPublications', () => {
  it('returns an array of publications', async () => {
    const pubs = await getAllPublications()
    expect(Array.isArray(pubs)).toBe(true)
    expect(pubs.length).toBeGreaterThan(0)
  })

  it('transforms items to the Publication shape', async () => {
    const pubs = await getAllPublications()
    for (const pub of pubs) {
      expect(pub.key).toBeTruthy()
      expect(pub.title).toBeTruthy()
      expect(Array.isArray(pub.authors)).toBe(true)
      expect(typeof pub.year).toBe('number')
      expect(pub.year).toBeGreaterThan(0)
      expect([
        'conferencePaper',
        'journalArticle',
        'bookChapter',
        'thesis',
        'report',
        'patent',
      ]).toContain(pub.type)
    }
  })

  it('sorts by year descending', async () => {
    const pubs = await getAllPublications()
    for (let i = 0; i < pubs.length - 1; i++) {
      expect(pubs[i].year).toBeGreaterThanOrEqual(pubs[i + 1].year)
    }
  })

  it('strips nvl. prefix from project tags', async () => {
    const pubs = await getAllPublications()
    for (const pub of pubs) {
      for (const tag of pub.tags) {
        expect(tag).not.toMatch(/^nvl\./)
      }
    }
  })
})

describe('pdf field', () => {
  it('maps archiveLocation to a pdf filename', async () => {
    const pubs = await getAllPublications()
    const pub = pubs.find((p) => p.key === 'AAAA0001')
    expect(pub?.pdf).toBe('2016.LAK.AdaptiveFeedback.pdf')
  })

  it('returns undefined pdf when archiveLocation is absent', async () => {
    const pubs = await getAllPublications()
    const pub = pubs.find((p) => p.key === 'AAAA0002')
    expect(pub?.pdf).toBeUndefined()
  })
})

describe('getPublicationsByProject', () => {
  it('returns only publications tagged for the given project', async () => {
    const pubs = await getPublicationsByProject('safesea')
    expect(pubs.length).toBeGreaterThan(0)
    for (const pub of pubs) {
      expect(pub.tags).toContain('safesea')
    }
  })

  it('returns empty array for a project with no publications', async () => {
    const pubs = await getPublicationsByProject('no-such-project-xyz')
    expect(pubs).toEqual([])
  })
})
