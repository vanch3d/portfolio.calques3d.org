import { describe, it, expect } from 'vitest'
import { projectHref, caseStudyHref, eraHref } from './routes'

describe('projectHref', () => {
  it('builds the project detail path from a slug', () => {
    expect(projectHref('hivemq-edge')).toBe('/projects/hivemq-edge')
  })
})

describe('caseStudyHref', () => {
  it('builds the flat project--slug case-study path', () => {
    expect(caseStudyHref('hivemq-edge', 'design-retro')).toBe(
      '/case-studies/hivemq-edge--design-retro'
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
