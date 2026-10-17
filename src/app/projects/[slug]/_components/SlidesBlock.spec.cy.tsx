/**
 * SlidesBlock — Cypress CT spec
 *
 * Coverage:
 * - Renders a link to the Speakerdeck URL when present
 * - Renders nothing when absent
 * - axe-clean
 */

import { SlidesBlock } from './SlidesBlock'

describe('SlidesBlock', () => {
  it('renders a link to the slides URL', () => {
    cy.mountAccessible(<SlidesBlock slidesUrl="https://speakerdeck.com/nvl/hivemq-edge" />)
    cy.get("a[href='https://speakerdeck.com/nvl/hivemq-edge']").should('exist')
  })

  it('renders nothing when there is no slides URL', () => {
    cy.mountAccessible(<SlidesBlock />)
    cy.findByTestId('slides-block').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<SlidesBlock slidesUrl="https://speakerdeck.com/nvl/hivemq-edge" />)
    cy.checkA11y()
  })
})
