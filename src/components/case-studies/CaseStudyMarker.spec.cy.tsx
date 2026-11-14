import { CaseStudyMarker } from './CaseStudyMarker'

describe('CaseStudyMarker', () => {
  it('renders the title with the number of case studies as a badge, not a link', () => {
    cy.mountAccessible(<CaseStudyMarker count={2} />)
    cy.findByTestId('case-study-marker').should('contain.text', 'Case studies')
    cy.findByTestId('case-study-count').should('have.text', '2')
    cy.get('a').should('not.exist')
  })

  it('shows the number even for a single case study', () => {
    cy.mountAccessible(<CaseStudyMarker count={1} />)
    cy.findByTestId('case-study-count').should('have.text', '1')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<CaseStudyMarker count={3} />)
    cy.checkA11y()
  })
})
