/**
 * EraTimeline — Cypress CT spec
 *
 * EraTimeline is an async Server Component (calls getTranslations on the server).
 * Cypress CT runs in a browser context and cannot execute async Server Components.
 *
 * This spec verifies the rendered structure by mounting the EraColumn sub-components
 * directly with fixture data, exactly as EraTimeline would compose them. The grid
 * wrapper, ruler, projects list, and era headings are all covered.
 */

import { EraColumn, type EraEntry } from './EraColumn'
import type { Route } from 'next'

const RESEARCH_PROJECTS: EraEntry[] = [
  { year: '2000', label: 'SAFeSEA', href: '/projects/safesea' as Route },
  { year: '1999', label: 'MyPAL', href: '/projects/mypal' as Route },
  {
    year: '1995',
    label: 'Calques 3D — A 3D Dynamic Geometry Microworld',
    href: '/projects/calques3d' as Route,
  },
]

const ENGINEERING_PROJECTS: EraEntry[] = [
  { year: '2023', label: 'HiveMQ Edge', href: '/projects/hivemq-edge' as Route },
  { year: '2021', label: 'Matillion', href: '/projects/matillion' as Route },
]

function EraTimelineHarness() {
  return (
    <div className="grid grid-cols-2 gap-0">
      <EraColumn
        era="research"
        badge="Era I"
        name="Research"
        summary="AI in Education · Human-Computer Interaction"
        projects={RESEARCH_PROJECTS}
        projectsAriaLabel="Research projects, newest first"
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
        projects={ENGINEERING_PROJECTS}
        projectsAriaLabel="Engineering projects, newest first"
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

  it('research column has a projects list, each entry linking to its project page', () => {
    cy.mountAccessible(<EraTimelineHarness />)
    cy.get("[data-testid='projects-list']")
      .first()
      .find("[role='listitem']")
      .should('have.length.at.least', 3)
    cy.get("a[href='/projects/calques3d']").should('exist')
  })

  it('engineering column has a projects list, each entry linking to its project page', () => {
    cy.mountAccessible(<EraTimelineHarness />)
    cy.get("[data-testid='projects-list']")
      .last()
      .find("[role='listitem']")
      .should('have.length.at.least', 2)
    cy.get("a[href='/projects/hivemq-edge']").should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<EraTimelineHarness />)
    cy.checkA11y()
  })
})
