/**
 * PublicationHeader — Cypress CT spec
 *
 * Coverage:
 * - Renders the record count and "as of" year
 * - Renders the min/max year labels on the dimension line
 * - Renders the page heading
 * - A variant with a different count and year range
 * - axe-clean
 */

import { PublicationHeader } from './PublicationHeader'

describe('PublicationHeader', () => {
  it('renders the record count and as-of year', () => {
    cy.mountAccessible(<PublicationHeader pubCount={42} minYear={1995} maxYear={2016} />)
    cy.findByTestId('counter-records').should('contain.text', '42')
    cy.findByTestId('counter-as-of').should('contain.text', '2016')
  })

  it('renders the min and max year labels on the dimension line', () => {
    cy.mountAccessible(<PublicationHeader pubCount={42} minYear={1995} maxYear={2016} />)
    cy.findByTestId('dimension-line').should('contain.text', '1995')
    cy.findByTestId('dimension-line').should('contain.text', '2016')
  })

  it('renders the page heading', () => {
    cy.mountAccessible(<PublicationHeader pubCount={42} minYear={1995} maxYear={2016} />)
    cy.get('h1').should('contain.text', 'Publications')
  })

  it('renders a different count and year range correctly (variant)', () => {
    cy.mountAccessible(<PublicationHeader pubCount={5} minYear={2001} maxYear={2010} />)
    cy.findByTestId('counter-records').should('contain.text', '5')
    cy.findByTestId('dimension-line').should('contain.text', '2001')
    cy.findByTestId('dimension-line').should('contain.text', '2010')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<PublicationHeader pubCount={42} minYear={1995} maxYear={2016} />)
    cy.checkA11y()
  })
})
