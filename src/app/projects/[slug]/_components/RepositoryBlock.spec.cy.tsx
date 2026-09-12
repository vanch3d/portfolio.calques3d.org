/**
 * RepositoryBlock — Cypress CT spec
 *
 * Coverage:
 * - Renders a GitHub link per repo
 * - Renders nothing when there are no repos
 * - axe-clean
 */

import { RepositoryBlock } from './RepositoryBlock'

describe('RepositoryBlock', () => {
  it('renders a link for each repo', () => {
    cy.mountAccessible(<RepositoryBlock repos={['hivemq/hivemq-edge']} />)
    cy.get("a[href='https://github.com/hivemq/hivemq-edge']").should(
      'contain.text',
      'hivemq/hivemq-edge'
    )
  })

  it('renders nothing when there are no repos', () => {
    cy.mountAccessible(<RepositoryBlock repos={[]} />)
    cy.findByTestId('repository-block').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<RepositoryBlock repos={['hivemq/hivemq-edge', 'vanch3d/portfolio']} />)
    cy.checkA11y()
  })
})
