/**
 * SpecimenIllustration — Cypress CT spec
 *
 * Coverage:
 * - Renders the ghost placeholder when coverUrl is absent (never hidden)
 * - Renders an <img> with the duotone filter class for raster (out-of-world) covers
 * - Renders an <img> WITHOUT the duotone filter class for SVG (Content Layer, ADR 027) covers
 * - Placeholder carries role=img + aria-label so it reads as content, not decoration
 * - The Specimen Mount frame (border-heavy wrapper) renders identically in both states
 * - The mat band shows "Specimen No. {index} of {total}" when both props are present
 * - The mat band is omitted gracefully when the props are absent
 * - The placeholder's two label lines render as distinct text nodes, not one run-on string
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

  it('renders an image with the duotone filter class for a raster (out-of-world) cover', () => {
    cy.mountAccessible(<SpecimenIllustration coverUrl="/covers/hivemq.png" alt="HiveMQ Edge" />)
    cy.findByTestId('specimen-illustration-image')
      .should('have.attr', 'src', '/covers/hivemq.png')
      .and('have.attr', 'alt', 'HiveMQ Edge')
      .and('have.class', 'duotone-specimen')
  })

  it('renders an image WITHOUT the duotone filter class for an SVG (Content Layer) cover', () => {
    cy.mountAccessible(<SpecimenIllustration coverUrl="/covers/hivemq.svg" alt="HiveMQ Edge" />)
    cy.findByTestId('specimen-illustration-image')
      .should('have.attr', 'src', '/covers/hivemq.svg')
      .and('have.attr', 'alt', 'HiveMQ Edge')
      .and('not.have.class', 'duotone-specimen')
  })

  it('renders the Specimen Mount frame around the placeholder state', () => {
    cy.mountAccessible(<SpecimenIllustration alt="HiveMQ Edge" />)
    cy.findByTestId('specimen-mount')
      .should('have.class', 'border-heavy')
      .and('have.class', 'border-ink')
    cy.findByTestId('specimen-mount').findByTestId('specimen-illustration-placeholder')
  })

  it('renders the Specimen Mount frame around the filled image state', () => {
    cy.mountAccessible(<SpecimenIllustration coverUrl="/covers/hivemq.png" alt="HiveMQ Edge" />)
    cy.findByTestId('specimen-mount')
      .should('have.class', 'border-heavy')
      .and('have.class', 'border-ink')
    cy.findByTestId('specimen-mount').findByTestId('specimen-illustration-image')
  })

  it('shows the mat band with the specimen index when both props are present', () => {
    cy.mountAccessible(
      <SpecimenIllustration
        coverUrl="/covers/hivemq.png"
        alt="HiveMQ Edge"
        specimenIndex={7}
        specimenTotal={24}
      />
    )
    cy.findByTestId('specimen-mount-band').should('contain.text', '7').and('contain.text', '24')
  })

  it('omits the mat band gracefully when the specimen index props are absent', () => {
    cy.mountAccessible(<SpecimenIllustration coverUrl="/covers/hivemq.png" alt="HiveMQ Edge" />)
    cy.findByTestId('specimen-mount-band').should('not.exist')
  })

  it("renders the placeholder's two label lines as distinct text nodes, not concatenated", () => {
    cy.mountAccessible(<SpecimenIllustration alt="HiveMQ Edge" />)
    cy.findByTestId('specimen-illustration-placeholder')
      .find('span')
      .should('have.length', 2)
      .then(($spans) => {
        expect($spans.eq(0).text().trim()).to.equal('Specimen illustration')
        expect($spans.eq(1).text().trim()).to.equal('Illustration pending')
      })
  })

  it('has no axe accessibility violations (placeholder state)', () => {
    cy.mountAccessible(<SpecimenIllustration alt="HiveMQ Edge" />)
    cy.checkA11y()
  })

  it('has no axe accessibility violations (image state, with mat band)', () => {
    cy.mountAccessible(
      <SpecimenIllustration
        coverUrl="/covers/hivemq.png"
        alt="HiveMQ Edge"
        specimenIndex={7}
        specimenTotal={24}
      />
    )
    cy.checkA11y()
  })
})
