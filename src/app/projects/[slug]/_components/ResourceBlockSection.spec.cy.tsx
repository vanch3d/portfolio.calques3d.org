/**
 * ResourceBlockSection — Cypress CT spec
 *
 * Coverage:
 * - Renders a <section> with the given testId and heading by default
 * - Renders a <div> when as="div" is given
 * - axe-clean
 */

import { ResourceBlockSection } from './ResourceBlockSection'

describe('ResourceBlockSection', () => {
  it('renders a section with the heading and testId', () => {
    cy.mountAccessible(
      <ResourceBlockSection testId="example-block" heading="Example heading">
        <p>Body content</p>
      </ResourceBlockSection>
    )
    cy.findByTestId('example-block').should('exist').and('contain.text', 'Example heading')
    cy.findByTestId('example-block').find('p').should('contain.text', 'Body content')
  })

  it('renders a div when as="div" is given', () => {
    cy.mountAccessible(
      <ResourceBlockSection as="div" testId="example-div-block" heading="Div heading">
        <p>Body</p>
      </ResourceBlockSection>
    )
    cy.findByTestId('example-div-block').should('exist')
    cy.get('div[data-testid="example-div-block"]').should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <ResourceBlockSection testId="example-block" heading="Example heading">
        <p>Body content</p>
      </ResourceBlockSection>
    )
    cy.checkA11y()
  })
})
