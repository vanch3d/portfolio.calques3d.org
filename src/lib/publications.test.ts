import { describe, it, expect } from 'vitest'
import { groupByYear } from './publications'
import type { Publication } from '@/types/content'

const make = (key: string, year: number): Publication => ({
  key,
  type: 'conferencePaper',
  title: `Publication ${key}`,
  authors: ['Van Labeke, Nicolas'],
  year,
  tags: [],
})

describe('groupByYear', () => {
  it('returns an empty array for no publications', () => {
    expect(groupByYear([])).toEqual([])
  })

  it('groups publications by year', () => {
    const pubs = [make('A', 2016), make('B', 2016), make('C', 2014)]
    const result = groupByYear(pubs)
    expect(result).toHaveLength(2)
    expect(result[0][0]).toBe(2016)
    expect(result[0][1]).toHaveLength(2)
    expect(result[1][0]).toBe(2014)
    expect(result[1][1]).toHaveLength(1)
  })

  it('sorts years descending', () => {
    const pubs = [make('A', 2010), make('B', 2016), make('C', 2008)]
    const years = groupByYear(pubs).map(([y]) => y)
    expect(years).toEqual([2016, 2010, 2008])
  })

  it('preserves original order within a year', () => {
    const pubs = [make('A', 2016), make('B', 2016), make('C', 2016)]
    const [, group] = groupByYear(pubs)[0]
    expect(group.map((p) => p.key)).toEqual(['A', 'B', 'C'])
  })
})
