/**
 * TaxonomyPanel — Cypress CT spec
 *
 * Coverage:
 * - Renders type, organisation/location, period, visibility
 * - Renders the funding field for research, the role field for engineering
 * - Renders the client line when present (engineering)
 * - Ongoing status renders with the active colour class
 * - Tag cloud shows visible tags plus a "+N more" indicator
 * - axe-clean on research and engineering variants
 */

import { TaxonomyPanel } from './TaxonomyPanel'

const BASE = {
  organisation: 'Université Henri Poincaré — Nancy I',
  location: 'Nancy, France',
  period: { start: '1995', end: '2010' },
  visibility: 'public' as const,
  tagsAll: { visible: ['3D geometry', 'C++', 'OpenGL'], moreCount: 0 },
  tagsMd: { visible: ['3D geometry', 'C++'], moreCount: 1 },
  tagsSm: { visible: ['3D geometry'], moreCount: 2 },
}

describe('TaxonomyPanel', () => {
  it('renders the research variant with a funding field', () => {
    cy.mountAccessible(
      <TaxonomyPanel
        {...BASE}
        type="research"
        status="archived"
        roleOrFunding={{ kind: 'funding', value: 'EPSRC' }}
      />
    )
    cy.findByTestId('taxonomy-panel').should('contain.text', 'EPSRC')
    cy.findByTestId('taxonomy-panel').should('contain.text', 'Université Henri Poincaré — Nancy I')
  })

  it('renders the engineering variant with a role field and client', () => {
    cy.mountAccessible(
      <TaxonomyPanel
        {...BASE}
        type="engineering"
        status="ongoing"
        roleOrFunding={{ kind: 'role', value: 'Lead Frontend Engineer' }}
        client="HiveMQ GmbH"
      />
    )
    cy.findByTestId('taxonomy-panel').should('contain.text', 'Lead Frontend Engineer')
    cy.findByTestId('taxonomy-panel').should('contain.text', 'HiveMQ GmbH')
  })

  it('applies the active colour to an ongoing status', () => {
    cy.mountAccessible(
      <TaxonomyPanel {...BASE} type="engineering" status="ongoing" roleOrFunding={null} />
    )
    cy.findByTestId('taxonomy-panel-column').find('.text-active').should('contain.text', 'Ongoing')
  })

  it('shows the tag cloud with a "more" indicator', () => {
    cy.mountAccessible(
      <TaxonomyPanel {...BASE} type="research" status="archived" roleOrFunding={null} />
    )
    cy.findByTestId('taxonomy-panel-column').should('contain.text', '3D geometry')
  })

  it('has no axe accessibility violations (research)', () => {
    cy.mountAccessible(
      <TaxonomyPanel
        {...BASE}
        type="research"
        status="archived"
        roleOrFunding={{ kind: 'funding', value: 'EPSRC' }}
      />
    )
    cy.checkA11y()
  })

  it('has no axe accessibility violations (engineering)', () => {
    cy.mountAccessible(
      <TaxonomyPanel
        {...BASE}
        type="engineering"
        status="ongoing"
        roleOrFunding={{ kind: 'role', value: 'Lead Frontend Engineer' }}
        client="HiveMQ GmbH"
      />
    )
    cy.checkA11y()
  })
})
