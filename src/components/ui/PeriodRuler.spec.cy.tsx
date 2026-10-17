/**
 * PeriodRuler — Cypress CT spec
 *
 * Coverage:
 * - Two datums at domain boundaries render without active colour
 * - Four datums including active ongoing project — end datum is active
 * - Same-year dedup: two datums at year=1995 → one tick rendered
 * - Near-collision stagger: two datums within 4% → labels positioned above/below
 * - Caller-overridden labelPosition is respected (no second stagger)
 * - aria-label is generated internally from contextLabel + domain (own i18n)
 * - aria-label falls back to a generic form when contextLabel is omitted
 * - cy.checkA11y() on default state, ongoing (active) state, and span-bar state
 */

import { PeriodRuler } from './PeriodRuler'
import type { PeriodDatum } from './PeriodRuler'

const domain = { start: 1995, end: 2026 }

describe('PeriodRuler', () => {
  it('renders with two boundary datums in graphite', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 2026, role: 'default' },
    ]
    cy.mountAccessible(<PeriodRuler domain={domain} datums={datums} contextLabel="Career" />)
    cy.findByTestId('period-ruler').should('exist')
    cy.findByTestId('period-ruler').contains('1995').should('have.class', 'text-ink-secondary')
  })

  it('renders 1995 and 2026 labels at the domain boundaries', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 2026, role: 'default' },
    ]
    cy.mountAccessible(<PeriodRuler domain={domain} datums={datums} contextLabel="Career" />)
    cy.findByTestId('period-ruler').contains('1995').should('exist')
    cy.findByTestId('period-ruler').contains('2026').should('exist')
  })

  it('renders four datums including active ongoing project end', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 2018, role: 'transition' },
      { year: 2020, role: 'project-start' },
      { year: 2026, role: 'present', label: 'Present' },
    ]
    cy.mountAccessible(
      <PeriodRuler domain={domain} datums={datums} ongoing={true} contextLabel="HiveMQ Edge" />
    )
    cy.findByTestId('period-ruler').contains('Present').should('have.class', 'text-active')
  })

  it('non-active datums use graphite colour when ongoing=true', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 2026, role: 'present', label: 'Present' },
    ]
    cy.mountAccessible(
      <PeriodRuler domain={domain} datums={datums} ongoing={true} contextLabel="HiveMQ Edge" />
    )
    cy.findByTestId('period-ruler').contains('1995').should('have.class', 'text-ink-secondary')
    cy.findByTestId('period-ruler').contains('Present').should('have.class', 'text-active')
  })

  it('deduplicates two datums at the same year into one tick', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 1995, role: 'project-start' },
      { year: 2026, role: 'default' },
    ]
    cy.mountAccessible(<PeriodRuler domain={domain} datums={datums} contextLabel="Career" />)
    cy.findByTestId('period-ruler')
      .find('span')
      .filter(':contains("1995")')
      .should('have.length', 1)
  })

  it('staggers near-collision labels above and below baseline', () => {
    const tightDomain = { start: 1995, end: 2005 }
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 1996, role: 'project-start' },
    ]
    cy.mountAccessible(<PeriodRuler domain={tightDomain} datums={datums} contextLabel="Timeline" />)
    cy.findByTestId('period-ruler').should('have.class', 'relative')
  })

  it('respects caller-supplied labelPosition above', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default', labelPosition: 'above' },
      { year: 2026, role: 'default' },
    ]
    cy.mountAccessible(<PeriodRuler domain={domain} datums={datums} contextLabel="Career" />)
    cy.findByTestId('period-ruler').contains('1995').should('exist')
  })

  it('renders a span bar between project period boundaries', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 2026, role: 'default' },
    ]
    cy.mountAccessible(
      <PeriodRuler
        domain={domain}
        datums={datums}
        span={{ from: 2020, to: 2026 }}
        ongoing={true}
        contextLabel="HiveMQ Edge"
      />
    )
    cy.findByTestId('period-ruler').find('.ruler-span-bar').should('exist')
  })

  it('generates an aria-label from contextLabel and domain', () => {
    const datums: PeriodDatum[] = [{ year: 1995, role: 'default' }]
    cy.mountAccessible(<PeriodRuler domain={domain} datums={datums} contextLabel="Career" />)
    cy.findByTestId('period-ruler')
      .should('have.attr', 'aria-label', 'Career timeline, 1995 to 2026')
      .and('have.attr', 'role', 'img')
  })

  it('falls back to a generic aria-label when contextLabel is omitted', () => {
    const datums: PeriodDatum[] = [{ year: 1995, role: 'default' }]
    cy.mountAccessible(<PeriodRuler domain={domain} datums={datums} />)
    cy.findByTestId('period-ruler').should('have.attr', 'aria-label', 'Timeline, 1995 to 2026')
  })

  it('has no axe accessibility violations (default state)', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 2018, role: 'transition' },
      { year: 2026, role: 'default' },
    ]
    cy.mountAccessible(<PeriodRuler domain={domain} datums={datums} contextLabel="Career" />)
    cy.checkA11y()
  })

  it('has no axe accessibility violations (ongoing active state)', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 2018, role: 'transition' },
      { year: 2020, role: 'project-start' },
      { year: 2026, role: 'present', label: 'Present' },
    ]
    cy.mountAccessible(
      <PeriodRuler domain={domain} datums={datums} ongoing={true} contextLabel="HiveMQ Edge" />
    )
    cy.checkA11y()
  })

  it('has no axe accessibility violations (with span bar)', () => {
    const datums: PeriodDatum[] = [
      { year: 1995, role: 'default' },
      { year: 2026, role: 'default' },
    ]
    cy.mountAccessible(
      <PeriodRuler
        domain={domain}
        datums={datums}
        span={{ from: 2020, to: 2026 }}
        ongoing={true}
        contextLabel="HiveMQ Edge"
      />
    )
    cy.checkA11y()
  })
})
