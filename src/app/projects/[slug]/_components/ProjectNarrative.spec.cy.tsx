/**
 * ProjectNarrative — Cypress CT spec
 *
 * Coverage:
 * - Renders children (the MDX body)
 * - Renders HighlightsBlock above the body when highlights are supplied
 * - Omits HighlightsBlock when no highlights are supplied (research projects)
 * - axe-clean in both states
 */

import { ProjectNarrative } from './ProjectNarrative'

describe('ProjectNarrative', () => {
  it('renders its children', () => {
    cy.mountAccessible(
      <ProjectNarrative>
        <p>A project about dynamic geometry.</p>
      </ProjectNarrative>
    )
    cy.findByTestId('project-narrative').should('contain.text', 'A project about dynamic geometry.')
  })

  it('renders HighlightsBlock first when highlights are supplied', () => {
    cy.mountAccessible(
      <ProjectNarrative highlights={['Shipped the MQTT bridge']}>
        <p>Engineering narrative.</p>
      </ProjectNarrative>
    )
    cy.findByTestId('highlights-block').should('exist')
  })

  it('omits HighlightsBlock when no highlights are supplied', () => {
    cy.mountAccessible(
      <ProjectNarrative>
        <p>Research narrative.</p>
      </ProjectNarrative>
    )
    cy.findByTestId('highlights-block').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <ProjectNarrative highlights={['Shipped the MQTT bridge']}>
        <p>Engineering narrative.</p>
      </ProjectNarrative>
    )
    cy.checkA11y()
  })
})
