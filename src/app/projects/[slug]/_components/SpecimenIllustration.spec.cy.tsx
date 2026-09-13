/**
 * SpecimenIllustration — Cypress CT spec
 *
 * Coverage:
 * - Renders the ghost placeholder when coverUrl is absent (never hidden)
 * - Renders an <img> with the duotone filter class when coverUrl is present
 * - Placeholder carries role=img + aria-label so it reads as content, not decoration
 * - axe on both states
 */

import { SpecimenIllustration } from './SpecimenIllustration'

describe('SpecimenIllustration', () => {
  it('renders the ghost placeholder when no cover image is set', () => {
    cy.mountAccessible(<SpecimenIllustration alt="HiveMQ Edge" />)
    cy.findByTestId('specimen-illustration-placeholder').should('exist')
    cy.findByTestId('specimen-illustration-image').should('not.exist')
  })

  it('placeholder has role=img and an aria-label', () => {
    cy.mountAccessible(<SpecimenIllustration alt="HiveMQ Edge" />)
    cy.findByTestId('specimen-illustration-placeholder')
      .should('have.attr', 'role', 'img')
      .and('have.attr', 'aria-label', 'Specimen illustration')
  })

  it('renders an image with the duotone filter class when coverUrl is set', () => {
    cy.mountAccessible(<SpecimenIllustration coverUrl="/covers/hivemq.png" alt="HiveMQ Edge" />)
    cy.findByTestId('specimen-illustration-image')
      .should('have.attr', 'src', '/covers/hivemq.png')
      .and('have.attr', 'alt', 'HiveMQ Edge')
      .and('have.class', 'duotone-specimen')
  })

  it('has no axe accessibility violations (placeholder state)', () => {
    cy.mountAccessible(<SpecimenIllustration alt="HiveMQ Edge" />)
    cy.checkA11y()
  })

  it('has no axe accessibility violations (image state)', () => {
    cy.mountAccessible(<SpecimenIllustration coverUrl="/covers/hivemq.png" alt="HiveMQ Edge" />)
    cy.checkA11y()
  })
})
