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

  it('labels the section with an h2 heading', () => {
    cy.mountAccessible(
      <ResourceBlockSection testId="example-block" heading="Example heading">
        <p>Body content</p>
      </ResourceBlockSection>
    )
    cy.findByRole('region', { name: 'Example heading' }).should(
      'have.attr',
      'data-testid',
      'example-block'
    )
    cy.contains('h2', 'Example heading').should('exist')
  })

  it('renders the heading as an h2 even with an action', () => {
    cy.mountAccessible(
      <ResourceBlockSection
        testId="example-block"
        heading="Example heading"
        action={<a href="/x">All</a>}
      >
        <p>Body</p>
      </ResourceBlockSection>
    )
    cy.contains('h2', 'Example heading').should('exist')
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

  it('renders an action at the end of the heading rule when given', () => {
    cy.mountAccessible(
      <ResourceBlockSection
        testId="example-block"
        heading="Example heading"
        action={<a href="/somewhere">See all</a>}
      >
        <p>Body</p>
      </ResourceBlockSection>
    )
    cy.findByTestId('example-block').contains('a', 'See all').should('exist')
    cy.findByTestId('example-block').should('contain.text', 'Example heading')
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
