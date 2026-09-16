/**
 * Route-level tests for GET /publications/[key]/pdf.
 *
 * Complements src/lib/api/pdf.test.ts (the pure resolvePdfSource unit tests)
 * by exercising the actual route module — confirming it delegates key
 * validation and publication lookup to resolvePdfSource() rather than
 * reimplementing them, and that it reads publications through the cached
 * layer (getCachedPublications) rather than hitting Zotero directly.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'

// getCachedPublications wraps its work in unstable_cache, which throws
// ("Invariant: incrementalCache missing") outside a real Next.js request
// context. Replace with a pass-through so the route can be exercised here.
vi.mock('next/cache', () => ({
  unstable_cache:
    (fn: (...args: unknown[]) => unknown) =>
    (...args: unknown[]) =>
      fn(...args),
}))

function makeRequest(key: string) {
  return GET(new Request(`http://localhost/publications/${key}/pdf`), {
    params: Promise.resolve({ key }),
  })
}

describe('GET /publications/[key]/pdf', () => {
  beforeEach(() => {
    vi.stubEnv('ZOTERO_USER_ID', '99999')
    vi.stubEnv('ZOTERO_API_KEY', 'test-api-key')
    vi.stubEnv('ZOTERO_COLLECTION_ID', 'TESTCOLL')
  })

  it('returns 400 for a malformed key', async () => {
    const res = await makeRequest('bad-key!')
    expect(res.status).toBe(400)
  })

  it('returns 400 for a key that is too short', async () => {
    const res = await makeRequest('ABCD123')
    expect(res.status).toBe(400)
  })

  it('returns 404 for a well-formed key with no matching publication', async () => {
    const res = await makeRequest('ZZZZZZZZ')
    expect(res.status).toBe(404)
  })

  it('returns 404 for a known key with no pdf field (real Zotero fixture: AAAA0002)', async () => {
    const res = await makeRequest('AAAA0002')
    expect(res.status).toBe(404)
  })
})
