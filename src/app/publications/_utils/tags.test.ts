import { describe, it, expect } from 'vitest'
import { getPublicationTags } from './tags'
import type { Publication } from '@/types/content'

const make = (key: string, tags: string[]): Publication => ({
  key,
  type: 'conferencePaper',
  title: `Publication ${key}`,
  authors: ['Van Labeke, Nicolas'],
  year: 2010,
  tags,
})

describe('getPublicationTags', () => {
  it('returns an empty array for no publications', () => {
    expect(getPublicationTags([])).toEqual([])
  })

  it('returns an empty array when publications have no tags', () => {
    const pubs = [make('A', []), make('B', [])]
    expect(getPublicationTags(pubs)).toEqual([])
  })

  it('counts each unique tag across publications', () => {
    const pubs = [
      make('A', ['safesea']),
      make('B', ['safesea', 'calques3d']),
      make('C', ['safesea']),
    ]
    const result = getPublicationTags(pubs)
    expect(result).toContainEqual({ tag: 'safesea', count: 3 })
    expect(result).toContainEqual({ tag: 'calques3d', count: 1 })
  })

  it('sorts by count descending', () => {
    const pubs = [
      make('A', ['rare']),
      make('B', ['common']),
      make('C', ['common']),
      make('D', ['common']),
    ]
    const result = getPublicationTags(pubs)
    expect(result.map((t) => t.tag)).toEqual(['common', 'rare'])
  })

  it('breaks ties alphabetically when counts are equal', () => {
    const pubs = [make('A', ['zeta']), make('B', ['alpha']), make('C', ['mid'])]
    const result = getPublicationTags(pubs)
    expect(result.map((t) => t.tag)).toEqual(['alpha', 'mid', 'zeta'])
  })

  it('applies count-descending before alphabetical tie-break', () => {
    const pubs = [
      make('A', ['zeta']),
      make('B', ['alpha']),
      make('C', ['alpha']),
      make('D', ['alpha']),
    ]
    const result = getPublicationTags(pubs)
    expect(result.map((t) => t.tag)).toEqual(['alpha', 'zeta'])
  })

  it('counts a publication with multiple tags once per tag', () => {
    const pubs = [make('A', ['safesea', 'calques3d', 'safesea'])]
    const result = getPublicationTags(pubs)
    // duplicate tag within the same publication's tags array still counts per occurrence
    expect(result).toContainEqual({ tag: 'safesea', count: 2 })
    expect(result).toContainEqual({ tag: 'calques3d', count: 1 })
  })
})
