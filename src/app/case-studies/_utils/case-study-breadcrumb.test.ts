import { describe, expect, it } from 'vitest'
import { buildCaseStudyBreadcrumb } from './case-study-breadcrumb'

const labels = { home: 'Nicolas Van Labeke', list: 'Case studies' }

describe('buildCaseStudyBreadcrumb', () => {
  it('links back to the home page and the collection on a case page', () => {
    const trail = buildCaseStudyBreadcrumb({
      project: 'calques3d',
      slug: 'calques3d',
      current: 'Calques 3D: a case',
      labels,
    })

    expect(trail.items).toEqual([
      { label: 'Nicolas Van Labeke', href: '/' },
      { label: 'Case studies', href: '/case-studies' },
    ])
    expect(trail.current).toBe('Calques 3D: a case')
  })

  it('adds the hub as a crumb, titled with the case, on chapter pages', () => {
    const trail = buildCaseStudyBreadcrumb({
      project: 'hivemq-edge',
      slug: 'design-retro',
      current: 'The Problem Class',
      hubTitle: 'HiveMQ Edge: A Design Retrospective',
      labels,
    })

    expect(trail.items).toHaveLength(3)
    expect(trail.items[2]).toEqual({
      label: 'HiveMQ Edge: A Design Retrospective',
      href: '/case-studies/hivemq-edge/design-retro',
    })
    expect(trail.current).toBe('The Problem Class')
  })
})
