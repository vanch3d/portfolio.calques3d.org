import { CaseStudyOutro } from './CaseStudyOutro'

describe('CaseStudyOutro', () => {
  it('renders the closing block with its hash target id and label', () => {
    cy.mountAccessible(
      <CaseStudyOutro>
        <p>None of this started at HiveMQ.</p>
      </CaseStudyOutro>
    )
    cy.get('#closing').should('exist')
    cy.findByTestId('case-outro').should('contain.text', 'Closing')
    cy.contains('None of this started at HiveMQ.')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <CaseStudyOutro>
          <p>Body.</p>
        </CaseStudyOutro>
      </div>
    )
    cy.checkA11y()
  })
})
