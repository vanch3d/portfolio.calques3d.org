/**
 * ExternalLinksBlock — Cypress CT spec
 *
 * Coverage:
 * - Renders the live-deployment link first when present
 * - Renders each external link
 * - Renders nothing when there is neither a live link nor external links
 * - axe-clean
 */

import { ExternalLinksBlock } from './ExternalLinksBlock'

describe('ExternalLinksBlock', () => {
  it('renders the live link when present', () => {
    cy.mountAccessible(<ExternalLinksBlock links={[]} live="https://hivemq.com/edge" />)
    cy.get("a[href='https://hivemq.com/edge']").should('exist')
  })

  it('renders each external link', () => {
    cy.mountAccessible(<ExternalLinksBlock links={['https://nvl.calques3d.org/']} />)
    cy.get("a[href='https://nvl.calques3d.org/']").should('exist')
  })

  it('renders nothing when there is nothing to show', () => {
    cy.mountAccessible(<ExternalLinksBlock links={[]} />)
    cy.findByTestId('external-links-block').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <ExternalLinksBlock links={['https://nvl.calques3d.org/']} live="https://hivemq.com/edge" />
    )
    cy.checkA11y()
  })
})
