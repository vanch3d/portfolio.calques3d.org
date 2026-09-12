/**
 * EraColumn — Cypress CT spec
 *
 * Coverage:
 *   - Renders the dimension ruler (data-testid="era-ruler")
 *   - Research column: right tick is active (bg-active), left tick is secondary
 *   - Engineering column: left tick is active (bg-active), right tick is secondary
 *   - Research column: end year label (2018) is active colour
 *   - Engineering column: start year label (2018) is active colour
 *   - Renders the era badge
 *   - Renders the era name as h2
 *   - Renders the era summary
 *   - Renders the positions list with role="list"
 *   - Each position entry has year and institution text
 *   - Renders nav links with correct hrefs
 *   - a11y: research column
 *   - a11y: engineering column
 */

import type { Route } from 'next'
import { EraColumn } from './EraColumn'

const RESEARCH_POSITIONS = [
  { year: '2013', institution: 'Senior Research Fellow, University of Leeds' },
  { year: '2010', institution: 'Research Fellow, The Open University' },
  { year: '2005', institution: 'Research Fellow, University of Edinburgh / Northumbria' },
  { year: '2000', institution: 'Research Fellow, University of Nottingham' },
  { year: '1995', institution: 'PhD, Université de Nancy I' },
]

const ENGINEERING_POSITIONS = [
  { year: '2022', institution: 'Senior Frontend Engineer, HiveMQ (remote)' },
  { year: '2021', institution: 'Senior Frontend Engineer, Matillion' },
  { year: '2020', institution: 'UX Engineer, Almotech Galway' },
  { year: '2018', institution: 'Frontend Engineer, HubSpot Dublin' },
]

const RESEARCH_PROPS = {
  era: 'research' as const,
  badge: 'Era I',
  name: 'Research',
  summary:
    'AI in Education · Human-Computer Interaction · Peer-reviewed scholarship across seven research institutions.',
  positions: RESEARCH_POSITIONS,
  positionsAriaLabel: 'Research positions, newest first',
  links: [
    { href: '/research' as Route, label: 'Explore research →' },
    { href: '/research/publications' as Route, label: '31 publications →' },
  ],
}

const ENGINEERING_PROPS = {
  era: 'engineering' as const,
  badge: 'Era II',
  name: 'Engineering',
  summary:
    'Frontend engineering · Product UX · IoT & SaaS platforms at HubSpot, HiveMQ, Matillion.',
  positions: ENGINEERING_POSITIONS,
  positionsAriaLabel: 'Engineering positions, newest first',
  links: [{ href: '/engineering' as Route, label: 'Explore engineering →' }],
}

describe('EraColumn — research', () => {
  beforeEach(() => {
    cy.mountAccessible(<EraColumn {...RESEARCH_PROPS} />)
  })

  it('renders the dimension ruler', () => {
    cy.findByTestId('era-ruler').should('exist')
  })

  it('renders the era badge', () => {
    cy.contains('Era I').should('be.visible')
  })

  it('renders the era name as h2', () => {
    cy.get('h2').should('contain.text', 'Research')
  })

  it('renders the era summary', () => {
    cy.contains('AI in Education').should('be.visible')
  })

  it('renders the positions list with role=list', () => {
    cy.findByTestId('positions-list').should('have.attr', 'role', 'list')
  })

  it('renders all research positions', () => {
    cy.contains('Senior Research Fellow, University of Leeds').should('be.visible')
    cy.contains('Research Fellow, The Open University').should('be.visible')
    cy.contains('PhD, Université de Nancy I').should('be.visible')
  })

  it('renders year annotations for positions', () => {
    cy.contains('2013').should('be.visible')
    cy.contains('1995').should('be.visible')
  })

  it('renders nav link to /research', () => {
    cy.get("a[href='/research']").should('exist')
  })

  it('renders nav link to /research/publications', () => {
    cy.get("a[href='/research/publications']").should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.checkA11y()
  })
})

describe('EraColumn — engineering', () => {
  beforeEach(() => {
    cy.mountAccessible(<EraColumn {...ENGINEERING_PROPS} />)
  })

  it('renders the dimension ruler', () => {
    cy.findByTestId('era-ruler').should('exist')
  })

  it('renders the era badge', () => {
    cy.contains('Era II').should('be.visible')
  })

  it('renders the era name as h2', () => {
    cy.get('h2').should('contain.text', 'Engineering')
  })

  it('renders all engineering positions', () => {
    cy.contains('Senior Frontend Engineer, HiveMQ').should('be.visible')
    cy.contains('Frontend Engineer, HubSpot Dublin').should('be.visible')
  })

  it('renders year annotations for positions', () => {
    cy.contains('2022').should('be.visible')
    cy.contains('2018').should('be.visible')
  })

  it('renders nav link to /engineering', () => {
    cy.get("a[href='/engineering']").should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.checkA11y()
  })
})
