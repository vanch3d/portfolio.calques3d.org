/**
 * ClassificationHeader — Cypress CT spec
 *
 * Coverage:
 * - Research vs engineering era/type labels
 * - Primary suffix shown only when primary=true
 * - Ongoing: status stamp and type-appropriate active styling
 * - Archived/completed: status stamp graphite
 * - axe on ongoing and archived states
 */

import { ClassificationHeader } from './ClassificationHeader'

describe('ClassificationHeader', () => {
  it('renders the research era and type labels', () => {
    cy.mountAccessible(
      <ClassificationHeader
        type="research"
        status="archived"
        period={{ start: 1995, end: 2010 }}
        contextLabel="Calques 3D"
      />
    )
    cy.findByTestId('classification-header').contains('Era I').should('exist')
    cy.findByTestId('type-line').should('contain.text', 'Research project')
  })

  it('renders the engineering era and type labels', () => {
    cy.mountAccessible(
      <ClassificationHeader
        type="engineering"
        status="ongoing"
        period={{ start: 2023, end: 2026 }}
        contextLabel="HiveMQ Edge"
      />
    )
    cy.findByTestId('classification-header').contains('Era II').should('exist')
    cy.findByTestId('type-line').should('contain.text', 'Engineering project')
  })

  it('appends the primary suffix only when primary is true', () => {
    cy.mountAccessible(
      <ClassificationHeader
        type="engineering"
        status="ongoing"
        primary={true}
        period={{ start: 2023, end: 2026 }}
        contextLabel="HiveMQ Edge"
      />
    )
    cy.findByTestId('type-line').should('contain.text', 'Primary')
  })

  it('does not show the primary suffix by default', () => {
    cy.mountAccessible(
      <ClassificationHeader
        type="engineering"
        status="ongoing"
        period={{ start: 2023, end: 2026 }}
        contextLabel="HiveMQ Edge"
      />
    )
    cy.findByTestId('type-line').should('not.contain.text', 'Primary')
  })

  it('ongoing: status stamp reads Ongoing with active colour', () => {
    cy.mountAccessible(
      <ClassificationHeader
        type="engineering"
        status="ongoing"
        period={{ start: 2023, end: 2026 }}
        contextLabel="HiveMQ Edge"
      />
    )
    cy.findByTestId('status-stamp')
      .should('contain.text', 'Ongoing')
      .and('have.class', 'text-active')
  })

  it('archived: status stamp reads Archived with graphite colour', () => {
    cy.mountAccessible(
      <ClassificationHeader
        type="research"
        status="archived"
        period={{ start: 1995, end: 2010 }}
        contextLabel="Calques 3D"
      />
    )
    cy.findByTestId('status-stamp')
      .should('contain.text', 'Archived')
      .and('have.class', 'text-ink-ghost')
  })

  it('has no axe accessibility violations (ongoing state)', () => {
    cy.mountAccessible(
      <ClassificationHeader
        type="engineering"
        status="ongoing"
        primary={true}
        period={{ start: 2023, end: 2026 }}
        contextLabel="HiveMQ Edge"
      />
    )
    cy.checkA11y()
  })

  it('has no axe accessibility violations (archived state)', () => {
    cy.mountAccessible(
      <ClassificationHeader
        type="research"
        status="archived"
        period={{ start: 1995, end: 2010 }}
        contextLabel="Calques 3D"
      />
    )
    cy.checkA11y()
  })
})
