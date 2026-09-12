/**
 * RestrictedBlock — Cypress CT spec
 *
 * Coverage:
 * - Always renders the restricted heading and explanation
 * - axe-clean
 */

import { RestrictedBlock } from './RestrictedBlock'

describe('RestrictedBlock', () => {
  it('renders the restricted heading and explanation', () => {
    cy.mountAccessible(<RestrictedBlock />)
    cy.findByTestId('restricted-block').should('contain.text', 'Restricted')
    cy.findByTestId('restricted-block').should('contain.text', 'NDA')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<RestrictedBlock />)
    cy.checkA11y()
  })
})
