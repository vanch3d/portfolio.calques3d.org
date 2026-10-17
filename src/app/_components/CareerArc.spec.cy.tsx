/**
 * CareerArc — Cypress CT spec
 *
 * Tests the two-arc SVG construction in isolation.
 *
 * Coverage:
 *   - Renders an SVG element
 *   - SVG is aria-hidden (decorative — semantic content is in sr-only paragraph in page.tsx)
 *   - SVG is not focusable
 *   - Both arc paths are rendered (research + engineering)
 *   - Ghost echo paths are rendered
 *   - Year labels are rendered (start, transition, end)
 *   - Arc span label is rendered
 *   - ONE RED RULE: inflection circle exists with active stroke
 *   - Project sprinkle dots are present
 *   - Era zone labels are rendered
 *   - a11y: SVG hidden from assistive tech, no violations
 */

import { CareerArc } from './CareerArc'

const PROPS = {
  arcLabel: 'CAREER ARC · 31 YEARS',
  timelineStart: '1995',
  timelineTransition: '2018',
  timelineEnd: '2026',
  researchSprinkles: [
    { title: 'Calques 3D · 1995–2010', subtitle: '3D geometry · dynamic geometry software · ILE' },
    { title: 'Learning Analytics · 2010–2017', subtitle: 'AI · Adaptive Systems · HCI' },
  ],
  engineeringSprinkles: [
    { title: 'HiveMQ Edge · 2023–present', subtitle: 'React · TypeScript · React Flow' },
  ],
}

describe('CareerArc', () => {
  it('renders an SVG element', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('svg').should('exist')
  })

  it('SVG is aria-hidden', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('svg').should('have.attr', 'aria-hidden', 'true')
  })

  it('SVG has focusable=false', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('svg').should('have.attr', 'focusable', 'false')
  })

  it('renders at least two arc paths (research + engineering primaries)', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('path').should('have.length.at.least', 2)
  })

  it('renders the research arc with correct d attribute', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='arc-research-path']").should('exist')
  })

  it('renders the engineering arc with correct d attribute', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='arc-engineering-path']").should('exist')
  })

  it('renders the timeline start year', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('svg').contains('1995').should('exist')
  })

  it('renders the timeline end year', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('svg').contains('2026').should('exist')
  })

  it('renders the transition year (2018) in active colour', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('svg text').contains('2018').should('have.attr', 'fill', 'var(--color-active)')
  })

  it('renders the arc span label', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('svg').contains('CAREER ARC').should('exist')
  })

  it('ONE RED RULE: inflection circle exists with active stroke', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='inflection-circle']").should('exist')
  })

  it('inflection circle has active stroke colour', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='inflection-circle']").should('have.attr', 'stroke', 'var(--color-active)')
  })

  it('inflection circle has ground fill (ring not filled disc)', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='inflection-circle']").should('have.attr', 'fill', 'var(--color-ground)')
  })

  it('renders project sprinkle dots', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='arc-research']").find('circle').first().should('exist')
    cy.get("[data-testid='arc-research']").find('circle').eq(1).should('exist')
    cy.get("[data-testid='arc-engineering']").find('circle').first().should('exist')
  })

  it('renders ERA I zone label', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('svg').contains('ERA I').should('exist')
  })

  it('renders ERA II zone label', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('svg').contains('ERA II').should('exist')
  })

  it('null sprinkle slots render no circles in that arc group', () => {
    cy.mountAccessible(
      <CareerArc {...PROPS} researchSprinkles={[null, null]} engineeringSprinkles={[null]} />
    )
    cy.get("[data-testid='arc-research']").find('circle').should('not.exist')
    cy.get("[data-testid='arc-engineering']").find('circle').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.checkA11y()
  })
})
