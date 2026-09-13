/**
 * RepositoryBlock — Cypress CT spec
 *
 * Coverage:
 * - Renders a GitHub link per repo when public
 * - Renders nothing when public with no repos
 * - Renders RestrictedBlock instead of the list when proprietary — even if
 *   repos happen to be present
 * - axe-clean on the public and proprietary states
 */

import { RepositoryBlock } from './RepositoryBlock'

describe('RepositoryBlock', () => {
  it('renders a link for each repo when public', () => {
    cy.mountAccessible(<RepositoryBlock repos={['hivemq/hivemq-edge']} visibility="public" />)
    cy.get("a[href='https://github.com/hivemq/hivemq-edge']").should(
      'contain.text',
      'hivemq/hivemq-edge'
    )
  })

  it('renders nothing when public with no repos', () => {
    cy.mountAccessible(<RepositoryBlock repos={[]} visibility="public" />)
    cy.findByTestId('repository-block').should('not.exist')
    cy.findByTestId('restricted-block').should('not.exist')
  })

  it('renders RestrictedBlock instead of the repo list when proprietary', () => {
    cy.mountAccessible(<RepositoryBlock repos={['hivemq/hivemq-edge']} visibility="proprietary" />)
    cy.findByTestId('restricted-block').should('exist')
    cy.findByTestId('repository-block').should('not.exist')
  })

  it('has no axe accessibility violations (public state)', () => {
    cy.mountAccessible(
      <RepositoryBlock repos={['hivemq/hivemq-edge', 'vanch3d/portfolio']} visibility="public" />
    )
    cy.checkA11y()
  })

  it('has no axe accessibility violations (proprietary state)', () => {
    cy.mountAccessible(<RepositoryBlock repos={[]} visibility="proprietary" />)
    cy.checkA11y()
  })
})
