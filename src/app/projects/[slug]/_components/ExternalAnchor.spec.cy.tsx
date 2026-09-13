/**
 * ExternalAnchor — Cypress CT spec
 *
 * Coverage:
 * - Renders an anchor with the given href and children
 * - Always sets target="_blank" and rel="noopener noreferrer"
 * - Merges a caller-supplied colour class alongside the shared classes
 * - axe-clean
 */

import { ExternalAnchor } from './ExternalAnchor'

describe('ExternalAnchor', () => {
  it('renders an anchor with the given href and text', () => {
    cy.mountAccessible(<ExternalAnchor href="https://example.com">Visit</ExternalAnchor>)
    cy.get("a[href='https://example.com']").should('contain.text', 'Visit')
  })

  it('always sets target and rel for external safety', () => {
    cy.mountAccessible(<ExternalAnchor href="https://example.com">Visit</ExternalAnchor>)
    cy.get('a')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noopener noreferrer')
  })

  it('merges a caller-supplied colour class', () => {
    cy.mountAccessible(
      <ExternalAnchor href="https://example.com" className="text-active">
        Visit
      </ExternalAnchor>
    )
    cy.get('a').should('have.class', 'text-active').and('have.class', 'nav-link')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<ExternalAnchor href="https://example.com">Visit</ExternalAnchor>)
    cy.checkA11y()
  })
})
