import { CaseStudiesLead } from './CaseStudiesLead'

describe('CaseStudiesLead', () => {
  it('frames its children under a heavy rule with the collection label', () => {
    cy.mountAccessible(
      <CaseStudiesLead>
        <h1>Design by building</h1>
      </CaseStudiesLead>
    )
    cy.findByTestId('case-studies-lead').should('contain.text', 'Case studies')
    cy.get('h1').should('contain.text', 'Design by building')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <CaseStudiesLead>
          <h1>Design by building</h1>
          <p>Lead text.</p>
        </CaseStudiesLead>
      </div>
    )
    cy.checkA11y()
  })
})
