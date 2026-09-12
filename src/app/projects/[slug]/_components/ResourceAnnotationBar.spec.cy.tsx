/**
 * ResourceAnnotationBar — Cypress CT spec
 *
 * Coverage:
 * - Shows only non-zero resource counts, correctly pluralised
 * - Renders nothing when every count is zero
 * - axe-clean
 */

import { ResourceAnnotationBar } from './ResourceAnnotationBar'

const ZERO_COUNTS = {
  publications: 0,
  repositories: 0,
  caseStudies: 0,
  external: 0,
  slides: 0,
  gallery: 0,
}

describe('ResourceAnnotationBar', () => {
  it('shows only the non-zero counts, pluralised correctly', () => {
    cy.mountAccessible(
      <ResourceAnnotationBar counts={{ ...ZERO_COUNTS, publications: 1, repositories: 2 }} />
    )
    cy.findByTestId('resource-annotation-bar').should('contain.text', '1 publication')
    cy.findByTestId('resource-annotation-bar').should('contain.text', '2 repositories')
    cy.findByTestId('resource-annotation-bar').should('not.contain.text', 'case stud')
  })

  it('renders nothing when every count is zero', () => {
    cy.mountAccessible(<ResourceAnnotationBar counts={ZERO_COUNTS} />)
    cy.findByTestId('resource-annotation-bar').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <ResourceAnnotationBar counts={{ ...ZERO_COUNTS, publications: 3, caseStudies: 1 }} />
    )
    cy.checkA11y()
  })
})
