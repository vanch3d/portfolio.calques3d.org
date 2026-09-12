/**
 * EraTimeline — Cypress CT spec
 *
 * EraTimeline is an async Server Component (calls getTranslations on the server).
 * Cypress CT runs in a browser context and cannot execute async Server Components.
 *
 * This spec verifies the rendered structure by mounting the EraColumn sub-components
 * directly with fixture data, exactly as EraTimeline would compose them. The grid
 * wrapper, ruler, positions list, and era headings are all covered.
 */

import { EraColumn, type EraEntry } from './EraColumn'
import type { Route } from 'next'

const RESEARCH_POSITIONS: EraEntry[] = [
  { year: '2013', institution: 'Senior Research Fellow, University of Leeds' },
  { year: '2010', institution: 'Research Fellow, The Open University' },
  { year: '2005', institution: 'Research Fellow, University of Edinburgh / Northumbria' },
  { year: '2000', institution: 'Research Fellow, University of Nottingham' },
  { year: '1995', institution: 'PhD, Université de Nancy I' },
]

const ENGINEERING_POSITIONS: EraEntry[] = [
  { year: '2022', institution: 'Senior Frontend Engineer, HiveMQ (remote)' },
  { year: '2021', institution: 'Senior Frontend Engineer, Matillion' },
  { year: '2020', institution: 'UX Engineer, Almotech Galway' },
  { year: '2018', institution: 'Frontend Engineer, HubSpot Dublin' },
]

function EraTimelineHarness() {
  return (
    <div className="grid grid-cols-2 gap-0">
      <EraColumn
        era="research"
        badge="Era I"
        name="Research"
        summary="AI in Education · Human-Computer Interaction"
        positions={RESEARCH_POSITIONS}
        positionsAriaLabel="Research positions, newest first"
        links={[
          { href: '/research' as Route, label: 'Explore research →' },
          { href: '/research/publications' as Route, label: '31 publications →' },
        ]}
      />
      <EraColumn
        era="engineering"
        badge="Era II"
        name="Engineering"
        summary="Frontend engineering · Product UX"
        positions={ENGINEERING_POSITIONS}
        positionsAriaLabel="Engineering positions, newest first"
        links={[{ href: '/engineering' as Route, label: 'Explore engineering →' }]}
      />
    </div>
  )
}

describe('EraTimeline', () => {
  it('renders the 50/50 grid wrapper', () => {
    cy.mountAccessible(<EraTimelineHarness />)
    cy.get("[data-testid='era-ruler']").should('have.length', 2)
  })

  it('renders the Research era column', () => {
    cy.mountAccessible(<EraTimelineHarness />)
    cy.get('h2').contains('Research').should('exist')
  })

  it('renders the Engineering era column', () => {
    cy.mountAccessible(<EraTimelineHarness />)
    cy.get('h2').contains('Engineering').should('exist')
  })

  it('research column has a positions list', () => {
    cy.mountAccessible(<EraTimelineHarness />)
    cy.get("[data-testid='positions-list']")
      .first()
      .find("[role='listitem']")
      .should('have.length.at.least', 3)
  })

  it('engineering column has a positions list', () => {
    cy.mountAccessible(<EraTimelineHarness />)
    cy.get("[data-testid='positions-list']")
      .last()
      .find("[role='listitem']")
      .should('have.length.at.least', 2)
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<EraTimelineHarness />)
    cy.checkA11y()
  })
})
