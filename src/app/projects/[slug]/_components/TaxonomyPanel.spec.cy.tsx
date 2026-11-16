/**
 * TaxonomyPanel — Cypress CT spec
 *
 * Coverage:
 * - Renders type, organisation/location, period, visibility
 * - Renders the funding field for research, the role field for engineering
 * - Renders the client line when present (engineering)
 * - Ongoing status renders with the active colour class
 * - Slices the full tag list internally, with a "+N more" indicator when
 *   the list exceeds a breakpoint's limit
 * - axe-clean on research and engineering variants
 */

import { TaxonomyPanel } from './TaxonomyPanel'

const BASE = {
  organisation: 'Université Henri Poincaré — Nancy I',
  location: 'Nancy, France',
  period: { start: '1995', end: '2010' },
  visibility: 'public' as const,
  tags: ['3D geometry', 'C++', 'OpenGL'],
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

  it('exposes the metadata as a definition list with a term per field', () => {
    cy.mountAccessible(
      <TaxonomyPanel
        {...BASE}
        type="research"
        status="archived"
        roleOrFunding={{ kind: 'funding', value: 'EPSRC' }}
      />
    )
    cy.findByTestId('taxonomy-panel').find('dl > div > dt').should('have.length.at.least', 6)
    cy.findByTestId('taxonomy-panel')
      .contains('dt', 'Funding')
      .siblings('dd')
      .should('contain.text', 'EPSRC')
    cy.findByTestId('taxonomy-panel').find('p').should('not.exist')
  })

  it('shows visibility, location and client at a narrow viewport', () => {
    cy.viewport(375, 800)
    cy.mountAccessible(
      <TaxonomyPanel
        {...BASE}
        type="engineering"
        status="ongoing"
        visibility="proprietary"
        roleOrFunding={null}
        client="HiveMQ GmbH"
      />
    )
    cy.contains('dt', 'Visibility').should('be.visible')
    cy.contains('dd', 'Proprietary').should('be.visible')
    cy.findByTestId('taxonomy-panel').contains('Nancy, France').should('be.visible')
    cy.findByTestId('taxonomy-panel').contains('HiveMQ GmbH').should('be.visible')
  })

  it('exposes tags as a list inside a definition', () => {
    cy.mountAccessible(
      <TaxonomyPanel {...BASE} type="research" status="archived" roleOrFunding={null} />
    )
    cy.findByTestId('taxonomy-panel').find('dd ul li').should('contain.text', '3D geometry')
  })

  it('applies the active colour to an ongoing status', () => {
    cy.mountAccessible(
      <TaxonomyPanel {...BASE} type="engineering" status="ongoing" roleOrFunding={null} />
    )
    cy.findByTestId('taxonomy-panel').find('.text-active').should('contain.text', 'Ongoing')
  })

  it('renders every tag with no "more" indicator when under every breakpoint limit', () => {
    cy.mountAccessible(
      <TaxonomyPanel {...BASE} type="research" status="archived" roleOrFunding={null} />
    )
    cy.findByTestId('taxonomy-panel').should('contain.text', '3D geometry')
    cy.findByTestId('taxonomy-panel').should('not.contain.text', 'more')
  })

  it('shows a "+N more" indicator once the tag list exceeds a breakpoint limit', () => {
    const manyTags = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    cy.mountAccessible(
      <TaxonomyPanel
        {...BASE}
        tags={manyTags}
        type="research"
        status="archived"
        roleOrFunding={null}
      />
    )
    // 7 tags: sm limit 3 -> +4 more, md limit 5 -> +2 more, lg shows all 7.
    cy.findByTestId('taxonomy-panel').should('contain.text', '+4 more')
    cy.findByTestId('taxonomy-panel').should('contain.text', '+2 more')
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
