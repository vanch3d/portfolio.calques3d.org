/**
 * ProjectTitle — Cypress CT spec
 *
 * Coverage:
 * - Renders the title as an h1 and the subtitle
 * - Passes the cover image through to SpecimenIllustration when present
 * - Renders the placeholder illustration when no cover image is set
 * - axe on both states
 */

import { ProjectTitle } from './ProjectTitle'

describe('ProjectTitle', () => {
  it('renders the title as an h1', () => {
    cy.mountAccessible(
      <ProjectTitle
        title="HiveMQ Edge — Frontend Architecture for Industrial IoT"
        subtitle="Lead Frontend Engineer · HiveMQ"
      />
    )
    cy.get('h1').should('contain.text', 'HiveMQ Edge')
  })

  it('renders the subtitle', () => {
    cy.mountAccessible(
      <ProjectTitle title="HiveMQ Edge" subtitle="Lead Frontend Engineer · HiveMQ" />
    )
    cy.findByTestId('project-title').should('contain.text', 'Lead Frontend Engineer · HiveMQ')
  })

  it('renders the specimen placeholder when no cover image is set', () => {
    cy.mountAccessible(<ProjectTitle title="HiveMQ Edge" subtitle="Lead Frontend Engineer" />)
    cy.findByTestId('specimen-illustration-placeholder').should('exist')
  })

  it('renders the cover image when set', () => {
    cy.mountAccessible(
      <ProjectTitle
        title="HiveMQ Edge"
        subtitle="Lead Frontend Engineer"
        coverUrl="/covers/hivemq.png"
      />
    )
    cy.findByTestId('specimen-illustration-image').should('have.attr', 'alt', 'HiveMQ Edge')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <ProjectTitle
        title="HiveMQ Edge — Frontend Architecture for Industrial IoT"
        subtitle="Lead Frontend Engineer · HiveMQ · Landshut, Germany"
      />
    )
    cy.checkA11y()
  })
})
