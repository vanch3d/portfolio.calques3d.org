import { describe, it, expect, beforeEach, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import { getCachedPublications } from './publications'

// getCachedPublications wraps its work in unstable_cache, which throws
// ("Invariant: incrementalCache missing") outside a real Next.js request
// context. Vitest runs in plain Node, so the cache wrapper is replaced with
// a pass-through — behaviour under test is the wrapped function, not Next's
// caching machinery (that's Next's own concern, not ours to unit-test here).
vi.mock('next/cache', () => ({
  unstable_cache:
    (fn: (...args: unknown[]) => unknown) =>
    (...args: unknown[]) =>
      fn(...args),
}))

describe('getCachedPublications', () => {
  beforeEach(() => {
    vi.stubEnv('ZOTERO_USER_ID', '99999')
    vi.stubEnv('ZOTERO_API_KEY', 'test-api-key')
    vi.stubEnv('ZOTERO_COLLECTION_ID', 'TESTCOLL')
  })

  it('returns the full mapped Publication[] with formated citations populated (happy path)', async () => {
    const pubs = await getCachedPublications()

    expect(pubs.length).toBeGreaterThan(0)
    for (const pub of pubs) {
      expect(pub.formated).toBeTruthy()
      expect(typeof pub.formated).toBe('string')
    }
  })

  it('scopes to a project tag via getPublicationsByProject when a tag is passed', async () => {
    const pubs = await getCachedPublications('safesea')

    expect(pubs.length).toBeGreaterThan(0)
    for (const pub of pubs) {
      expect(pub.tags).toContain('safesea')
      expect(pub.formated).toBeTruthy()
    }
  })

  it('resolves to an empty array when the Zotero API fails, instead of throwing', async () => {
    server.use(
      http.get(
        'https://api.zotero.org/users/:userId/collections/:collectionId/items/top',
        () => new HttpResponse(null, { status: 500 })
      )
    )

    await expect(getCachedPublications()).resolves.toEqual([])
  })
})
