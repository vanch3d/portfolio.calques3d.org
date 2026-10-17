/**
 * HighlightsBlock — Cypress CT spec
 *
 * Coverage:
 * - Renders each highlight as a list item
 * - Renders nothing when the highlights array is empty
 * - axe-clean
 */

import { HighlightsBlock } from './HighlightsBlock'

describe('HighlightsBlock', () => {
  it('renders each highlight', () => {
    cy.mountAccessible(
      <HighlightsBlock highlights={['Cut build time by 40%', 'Led the design system migration']} />
    )
    cy.findByTestId('highlights-block').find('li').should('have.length', 2)
    cy.findByTestId('highlights-block').should('contain.text', 'Cut build time by 40%')
  })

  it('renders nothing when there are no highlights', () => {
    cy.mountAccessible(<HighlightsBlock highlights={[]} />)
    cy.findByTestId('highlights-block').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<HighlightsBlock highlights={['Cut build time by 40%']} />)
    cy.checkA11y()
  })
})
