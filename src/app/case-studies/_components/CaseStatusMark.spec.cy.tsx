import { CaseStatusMark } from './CaseStatusMark'

describe('CaseStatusMark', () => {
  it('renders the draft mark for a draft case', () => {
    cy.mountAccessible(<CaseStatusMark status="draft" />)
    cy.contains('Draft').should('be.visible')
  })

  it('uses the shared Tag frame', () => {
    cy.mountAccessible(<CaseStatusMark status="draft" />)
    cy.findByTestId('case-status-mark').should('have.class', 'border-ghost')
  })

  it('renders nothing for a published case', () => {
    cy.mountAccessible(
      <div data-testid="host">
        <CaseStatusMark status="published" />
      </div>
    )
    cy.findByTestId('host').should('be.empty')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<CaseStatusMark status="draft" />)
    cy.checkA11y()
  })
})
