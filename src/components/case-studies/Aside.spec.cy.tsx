import { Aside } from './Aside'

describe('Aside', () => {
  it('renders a labelled note with its content', () => {
    cy.mountAccessible(<Aside label="Reading guide">Six sections.</Aside>)
    cy.findByTestId('aside')
      .should('have.attr', 'role', 'note')
      .and('have.attr', 'aria-label', 'Reading guide')
      .and('contain.text', 'Six sections.')
  })

  it('renders without a label', () => {
    cy.mountAccessible(<Aside>Plain note.</Aside>)
    cy.findByTestId('aside').should('not.have.attr', 'aria-label')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <Aside label="Note">Text.</Aside>
      </div>
    )
    cy.checkA11y()
  })
})
