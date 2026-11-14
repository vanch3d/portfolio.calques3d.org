import { CaseWip } from './CaseWip'

describe('CaseWip', () => {
  it('renders the label and the passage text in a dashed note', () => {
    cy.mountAccessible(<CaseWip text="The comparison goes here." />)
    cy.findByTestId('case-wip')
      .should('have.attr', 'role', 'note')
      .and('have.class', 'border-dashed')
    cy.contains('Work in progress')
    cy.contains('The comparison goes here.')
  })

  it('renders only the label when there is no text', () => {
    cy.mountAccessible(<CaseWip text="" />)
    cy.findByTestId('case-wip').find('p').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<CaseWip text="Unfinished." />)
    cy.checkA11y()
  })
})
