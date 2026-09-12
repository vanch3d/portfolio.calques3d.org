/**
 * PeriodStrip — Cypress CT spec
 *
 * Coverage:
 * - Archived: start and end labels both render in graphite (text-ink-secondary)
 * - Ongoing: end label renders the "present" copy in active (text-active), start label stays graphite
 * - Archived: end tick uses graphite colour class
 * - Ongoing: end tick uses active colour class
 * - aria-label is generated internally from contextLabel + domain (own i18n)
 * - aria-label falls back to a generic form when contextLabel is omitted
 * - cy.checkA11y() on archived state and ongoing state
 */

import { PeriodStrip } from './PeriodStrip'

describe('PeriodStrip', () => {
  it('renders start and end year labels when archived', () => {
    cy.mountAccessible(
      <PeriodStrip domain={{ start: 1995, end: 2010 }} contextLabel="Calques 3D" />
    )
    cy.findByTestId('period-start').should('contain.text', '1995')
    cy.findByTestId('period-end').should('contain.text', '2010')
  })

  it('archived: start label has graphite colour', () => {
    cy.mountAccessible(
      <PeriodStrip domain={{ start: 1995, end: 2010 }} contextLabel="Calques 3D" />
    )
    cy.findByTestId('period-start').should('have.class', 'text-ink-secondary')
  })

  it('archived: end label has graphite colour', () => {
    cy.mountAccessible(
      <PeriodStrip domain={{ start: 1995, end: 2010 }} contextLabel="Calques 3D" />
    )
    cy.findByTestId('period-end').should('have.class', 'text-ink-secondary')
  })

  it('ongoing: end label has active (red) colour', () => {
    cy.mountAccessible(
      <PeriodStrip domain={{ start: 2023, end: 2026 }} ongoing={true} contextLabel="HiveMQ Edge" />
    )
    cy.findByTestId('period-end').should('have.class', 'text-active')
  })

  it('ongoing: start label remains graphite', () => {
    cy.mountAccessible(
      <PeriodStrip domain={{ start: 2023, end: 2026 }} ongoing={true} contextLabel="HiveMQ Edge" />
    )
    cy.findByTestId('period-start').should('have.class', 'text-ink-secondary')
  })

  it('ongoing: renders the localised present label as the end label', () => {
    cy.mountAccessible(
      <PeriodStrip domain={{ start: 2023, end: 2026 }} ongoing={true} contextLabel="HiveMQ Edge" />
    )
    cy.findByTestId('period-end').should('contain.text', 'Present')
  })

  it('generates an aria-label from contextLabel and domain', () => {
    cy.mountAccessible(
      <PeriodStrip domain={{ start: 1995, end: 2010 }} contextLabel="Calques 3D" />
    )
    cy.findByTestId('period-strip')
      .should('have.attr', 'role', 'img')
      .and('have.attr', 'aria-label', 'Calques 3D period, 1995 to 2010')
  })

  it('falls back to a generic aria-label when contextLabel is omitted', () => {
    cy.mountAccessible(<PeriodStrip domain={{ start: 1995, end: 2010 }} />)
    cy.findByTestId('period-strip').should('have.attr', 'aria-label', 'Period, 1995 to 2010')
  })

  it('has no axe accessibility violations (archived state)', () => {
    cy.mountAccessible(
      <PeriodStrip domain={{ start: 1995, end: 2010 }} contextLabel="Calques 3D" />
    )
    cy.checkA11y()
  })

  it('has no axe accessibility violations (ongoing state)', () => {
    cy.mountAccessible(
      <PeriodStrip domain={{ start: 2023, end: 2026 }} ongoing={true} contextLabel="HiveMQ Edge" />
    )
    cy.checkA11y()
  })
})
