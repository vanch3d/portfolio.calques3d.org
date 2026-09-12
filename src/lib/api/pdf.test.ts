import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { resolvePdfSource, ZOTERO_KEY_PATTERN } from './pdf'
import type { Publication } from '@/types/content'

const ENV: Record<string, string> = {
  OWNCLOUD_API: 'https://assets.example.org/remote.php/webdav/',
  OWNCLOUD_USERNAME: 'testuser',
  OWNCLOUD_TOKEN: 'testtoken',
  OWNCLOUD_COLLECTION: '/portfolio/',
}

beforeEach(() => {
  for (const [k, v] of Object.entries(ENV)) process.env[k] = v
})

afterEach(() => {
  for (const k of Object.keys(ENV)) delete process.env[k]
})

const base: Omit<Publication, 'key' | 'pdf'> = {
  type: 'conferencePaper',
  title: 'Test Paper',
  authors: ['Van Labeke, Nicolas'],
  year: 2005,
  tags: ['safesea'],
}

const publications: Publication[] = [
  { ...base, key: 'ABCD1234', pdf: 'test-paper.pdf' },
  { ...base, key: 'EFGH5678', pdf: undefined },
  { ...base, key: 'IJKL9012' },
]

describe('ZOTERO_KEY_PATTERN', () => {
  it('accepts 8-character alphanumeric keys', () => {
    expect(ZOTERO_KEY_PATTERN.test('ABCD1234')).toBe(true)
    expect(ZOTERO_KEY_PATTERN.test('abcd1234')).toBe(true)
  })

  it('rejects keys that are too short, too long, or contain invalid chars', () => {
    expect(ZOTERO_KEY_PATTERN.test('ABCD123')).toBe(false) // 7 chars
    expect(ZOTERO_KEY_PATTERN.test('ABCD12345')).toBe(false) // 9 chars
    expect(ZOTERO_KEY_PATTERN.test('ABCD-234')).toBe(false) // hyphen
  })
})

describe('resolvePdfSource', () => {
  it('returns 400 for a malformed key', () => {
    const result = resolvePdfSource('bad-key!', publications)
    expect(result).toEqual({ ok: false, status: 400 })
  })

  it('returns 400 for an empty string', () => {
    const result = resolvePdfSource('', publications)
    expect(result).toEqual({ ok: false, status: 400 })
  })

  it('returns 404 for a valid key not in the publication list', () => {
    const result = resolvePdfSource('ZZZZZZZZ', publications)
    expect(result).toEqual({ ok: false, status: 404 })
  })

  it('returns 404 for a known key with no pdf field', () => {
    const result = resolvePdfSource('EFGH5678', publications)
    expect(result).toEqual({ ok: false, status: 404 })
  })

  it('returns the ownCloud URL and auth header for a valid key with pdf', () => {
    const result = resolvePdfSource('ABCD1234', publications)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.url).toContain('test-paper.pdf')
    expect(result.authHeader).toMatch(/^Basic /)
    expect(result.filename).toBe('test-paper.pdf')
  })
})
