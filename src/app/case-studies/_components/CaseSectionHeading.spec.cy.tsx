import { CaseSectionHeading } from './CaseSectionHeading'

describe('CaseSectionHeading', () => {
  it('renders the requested heading level with its title', () => {
    cy.mountAccessible(
      <CaseSectionHeading tag="h2" size="section" number="1">
        A cube on a flat screen
      </CaseSectionHeading>
    )
    cy.get('h2').should('contain.text', 'A cube on a flat screen')
  })

  it('hides the number from assistive technology', () => {
    cy.mountAccessible(
      <CaseSectionHeading tag="h2" size="subsection" number="3.1">
        The problem
      </CaseSectionHeading>
    )
    cy.contains('3.1').should('have.attr', 'aria-hidden', 'true')
  })

  it('can render a subsection as h3', () => {
    cy.mountAccessible(
      <CaseSectionHeading tag="h3" size="subsection" number="1.1">
        Detail
      </CaseSectionHeading>
    )
    cy.get('h3').should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <h1>Title</h1>
        <CaseSectionHeading tag="h2" size="section" number="1">
          Section
        </CaseSectionHeading>
      </div>
    )
    cy.checkA11y()
  })
})
