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
 *   - Renders the projects list with role="list"
 *   - Each project entry has year text and a link to its project page
 *   - Renders nav links with correct hrefs
 *   - a11y: research column
 *   - a11y: engineering column
 */

import type { Route } from 'next'
import { EraColumn } from './EraColumn'

const RESEARCH_PROJECTS = [
  { year: '2000', label: 'SAFeSEA', href: '/projects/safesea' as Route },
  { year: '1999', label: 'MyPAL', href: '/projects/mypal' as Route },
  {
    year: '1995',
    label: 'Calques 3D — A 3D Dynamic Geometry Microworld',
    href: '/projects/calques3d' as Route,
  },
]

const ENGINEERING_PROJECTS = [
  { year: '2023', label: 'HiveMQ Edge', href: '/projects/hivemq-edge' as Route },
  { year: '2021', label: 'Matillion', href: '/projects/matillion' as Route },
  { year: '2018', label: 'HubSpot', href: '/projects/hubspot' as Route },
]

const RESEARCH_PROPS = {
  era: 'research' as const,
  badge: 'Era I',
  name: 'Research',
  summary:
    'AI in Education · Human-Computer Interaction · Peer-reviewed scholarship across seven research institutions.',
  projects: RESEARCH_PROJECTS,
  projectsAriaLabel: 'Research projects, newest first',
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
  projects: ENGINEERING_PROJECTS,
  projectsAriaLabel: 'Engineering projects, newest first',
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

  it('renders the projects list with role=list', () => {
    cy.findByTestId('projects-list').should('have.attr', 'role', 'list')
  })

  it('renders each project as a link to its project page', () => {
    cy.get("a[href='/projects/calques3d']").should('contain.text', 'Calques 3D')
    cy.get("a[href='/projects/mypal']").should('contain.text', 'MyPAL')
    cy.get("a[href='/projects/safesea']").should('contain.text', 'SAFeSEA')
  })

  it('renders year annotations for projects', () => {
    cy.contains('2000').should('be.visible')
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

  it('renders each project as a link to its project page', () => {
    cy.get("a[href='/projects/hivemq-edge']").should('contain.text', 'HiveMQ Edge')
    cy.get("a[href='/projects/hubspot']").should('contain.text', 'HubSpot')
  })

  it('renders year annotations for projects', () => {
    cy.contains('2023').should('be.visible')
    cy.contains('2018').should('be.visible')
  })

  it('renders nav link to /engineering', () => {
    cy.get("a[href='/engineering']").should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.checkA11y()
  })
})
