import { describe, it, expect } from 'vitest'
import { pickChronologicalNeighbours, sliceTags } from './project-utils'
import type { ProjectResolution } from '@/lib/content/projects'
import type { EngineeringProject } from '@/types/content'

function makeProject(slug: string, start: string): ProjectResolution {
  const project: EngineeringProject = {
    slug,
    title: slug,
    type: 'engineering',
    status: 'completed',
    visibility: 'public',
    featured: false,
    position: 'pos',
    period: { start, end: null },
    links: {},
    tags: [],
  }
  return { project, type: 'engineering' }
}

describe('pickChronologicalNeighbours', () => {
  const three = [makeProject('a', '2018'), makeProject('b', '2020'), makeProject('c', '2022')]

  it('returns null prev and the next project for the first project', () => {
    const result = pickChronologicalNeighbours(three, 'a')
    expect(result.prev).toBeNull()
    expect(result.next?.project.slug).toBe('b')
  })

  it('returns both prev and next for a middle project', () => {
    const result = pickChronologicalNeighbours(three, 'b')
    expect(result.prev?.project.slug).toBe('a')
    expect(result.next?.project.slug).toBe('c')
  })

  it('returns null next for the last project', () => {
    const result = pickChronologicalNeighbours(three, 'c')
    expect(result.next).toBeNull()
    expect(result.prev?.project.slug).toBe('b')
  })

  it('returns null prev and next when the project is the only one', () => {
    const single = [makeProject('solo', '2023')]
    const result = pickChronologicalNeighbours(single, 'solo')
    expect(result).toEqual({ prev: null, next: null })
  })

  it('returns nulls when the current slug is not found', () => {
    const result = pickChronologicalNeighbours(three, 'does-not-exist')
    expect(result).toEqual({ prev: null, next: null })
  })
})

describe('sliceTags', () => {
  it('returns all tags unchanged with moreCount 0 when under the limit', () => {
    expect(sliceTags(['a', 'b'], 5)).toEqual({ visible: ['a', 'b'], moreCount: 0 })
  })

  it('returns all tags unchanged with moreCount 0 when exactly at the limit', () => {
    expect(sliceTags(['a', 'b', 'c'], 3)).toEqual({ visible: ['a', 'b', 'c'], moreCount: 0 })
  })

  it('slices and reports the remainder when over the limit', () => {
    expect(sliceTags(['a', 'b', 'c', 'd', 'e'], 3)).toEqual({
      visible: ['a', 'b', 'c'],
      moreCount: 2,
    })
  })

  it('handles an empty tag list', () => {
    expect(sliceTags([], 3)).toEqual({ visible: [], moreCount: 0 })
  })
})
