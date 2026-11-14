import { describe, it, expect } from 'vitest'
import {
  projectHref,
  caseStudyHref,
  eraHref,
  caseStudiesEraHref,
  caseStudiesEraAnchor,
} from './routes'

describe('projectHref', () => {
  it('builds the project detail path from a slug', () => {
    expect(projectHref('hivemq-edge')).toBe('/projects/hivemq-edge')
  })
})

describe('caseStudyHref', () => {
  it('builds the nested project/slug case-study path', () => {
    expect(caseStudyHref('hivemq-edge', 'design-retro')).toBe(
      '/case-studies/hivemq-edge/design-retro'
    )
  })

  it('appends the chapter slug when given', () => {
    expect(caseStudyHref('hivemq-edge', 'design-retro', 'workspace')).toBe(
      '/case-studies/hivemq-edge/design-retro/workspace'
    )
  })
})

describe('eraHref', () => {
  it('returns /research for research', () => {
    expect(eraHref('research')).toBe('/research')
  })

  it('returns /engineering for engineering', () => {
    expect(eraHref('engineering')).toBe('/engineering')
  })
})

describe('caseStudiesEraHref', () => {
  it('anchors the landing page at the era group', () => {
    expect(caseStudiesEraHref('engineering')).toBe('/case-studies#era-engineering')
    expect(caseStudiesEraHref('research')).toBe('/case-studies#era-research')
  })

  it('uses the same id the landing group heading carries', () => {
    expect(caseStudiesEraAnchor('research')).toBe('era-research')
  })
})
