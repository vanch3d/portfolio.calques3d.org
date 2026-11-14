import { CaseStudyProjectLink } from './CaseStudyProjectLink'

describe('CaseStudyProjectLink', () => {
  it('links to the project page', () => {
    cy.mountAccessible(<CaseStudyProjectLink project="calques3d" projectName="Calques 3D" />)
    cy.get("a[href='/projects/calques3d']").should('contain.text', 'Project: Calques 3D')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <CaseStudyProjectLink project="hivemq-edge" projectName="HiveMQ Edge" />
      </div>
    )
    cy.checkA11y()
  })
})
