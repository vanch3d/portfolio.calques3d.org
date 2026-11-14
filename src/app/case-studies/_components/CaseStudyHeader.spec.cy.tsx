import { CaseStudyHeader } from './CaseStudyHeader'

describe('CaseStudyHeader', () => {
  it('shows the shared breadcrumb back to the home page and the collection', () => {
    cy.mountAccessible(
      <CaseStudyHeader
        project="calques3d"
        projectName="Calques 3D"
        slug="calques3d"
        current="Calques 3D: a case"
      />
    )
    cy.findByTestId('breadcrumb').within(() => {
      cy.get("a[href='/']").should('contain.text', 'Nicolas Van Labeke')
      cy.get("a[href='/case-studies']").should('contain.text', 'Case studies')
    })
    cy.findByTestId('breadcrumb-current').should('have.text', 'Calques 3D: a case')
  })

  it('links to the project page', () => {
    cy.mountAccessible(
      <CaseStudyHeader project="calques3d" projectName="Calques 3D" slug="calques3d" current="x" />
    )
    cy.get("a[href='/projects/calques3d']").should('contain.text', 'Project: Calques 3D')
  })

  it('adds the hub as a crumb, titled with the case, on chapter pages', () => {
    cy.mountAccessible(
      <CaseStudyHeader
        project="hivemq-edge"
        projectName="HiveMQ Edge"
        slug="design-retro"
        hubTitle="HiveMQ Edge: A Design Retrospective"
        current="The Problem Class"
      />
    )
    cy.findByTestId('breadcrumb')
      .find("a[href='/case-studies/hivemq-edge/design-retro']")
      .should('contain.text', 'HiveMQ Edge: A Design Retrospective')
    cy.findByTestId('breadcrumb-current').should('have.text', 'The Problem Class')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <CaseStudyHeader
          project="calques3d"
          projectName="Calques 3D"
          slug="calques3d"
          hubTitle="Hub"
          current="Chapter"
        />
      </div>
    )
    cy.checkA11y()
  })
})
