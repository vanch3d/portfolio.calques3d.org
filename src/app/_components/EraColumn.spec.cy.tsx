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
import type { ComponentProps } from 'react'
import { EraColumn } from './EraColumn'
import type { EraEntry } from './EraColumn'

type EraColumnSpecProps = ComponentProps<typeof EraColumn>

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
  { year: '2018', label: 'HubSpot', href: '/projects/hubspot' as Route },
]

const RESEARCH_PROPS: EraColumnSpecProps = {
  era: 'research',
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

const ENGINEERING_PROPS: EraColumnSpecProps = {
  era: 'engineering',
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

describe('EraColumn — case studies', () => {
  const WITH_CASE_STUDY: EraColumnSpecProps = {
    ...ENGINEERING_PROPS,
    projects: [{ ...ENGINEERING_PROJECTS[0], caseStudyCount: 2 }, ...ENGINEERING_PROJECTS.slice(1)],
    links: [
      ...ENGINEERING_PROPS.links,
      { href: '/case-studies#era-engineering' as Route, label: 'Case studies →' },
    ],
  }

  it('marks only the projects that have a case study, passively', () => {
    cy.mountAccessible(<EraColumn {...WITH_CASE_STUDY} />)
    cy.findAllByTestId('case-study-marker').should('have.length', 1)
    cy.findAllByTestId('case-study-marker').first().should('contain.text', 'Case studies')
    cy.findAllByTestId('case-study-count').first().should('have.text', '2')
    cy.get('a[href^="/projects"]').filter(':contains("Case studies")').should('not.exist')
  })

  it('keeps each row to a single link to its project page', () => {
    cy.mountAccessible(<EraColumn {...WITH_CASE_STUDY} />)
    cy.findByTestId('case-study-marker')
      .closest('[role=listitem]')
      .find('a')
      .should('have.length', 1)
      .and('have.attr', 'href', '/projects/hivemq-edge')
  })

  it('keeps the marker on the first line of a title that wraps, like the year', () => {
    const LONG_TITLE: EraColumnSpecProps = {
      ...WITH_CASE_STUDY,
      projects: [
        {
          ...ENGINEERING_PROJECTS[0],
          label: 'A project title long enough to wrap onto several lines in a narrow column',
          caseStudyCount: 1,
        },
      ],
    }
    cy.viewport(360, 800)
    cy.mountAccessible(<EraColumn {...LONG_TITLE} />)
    cy.findByTestId('case-study-marker').then(($marker) => {
      cy.get('[data-testid="projects-list"] a').then(($link) => {
        const link = $link[0].getBoundingClientRect()
        const lineHeight = parseFloat(getComputedStyle($link[0]).lineHeight)
        const marker = $marker[0].getBoundingClientRect()
        const markerCentre = marker.top + marker.height / 2
        const firstLineCentre = link.top + lineHeight / 2
        expect(link.height).to.be.greaterThan(lineHeight * 1.5)
        expect(Math.abs(markerCentre - firstLineCentre)).to.be.lessThan(1)
      })
    })
  })

  it('renders the era Case studies link to the era group on the landing page', () => {
    cy.mountAccessible(<EraColumn {...WITH_CASE_STUDY} />)
    cy.get("a[href='/case-studies#era-engineering']").should('contain.text', 'Case studies')
  })

  it('renders no marker when no project has a case study', () => {
    cy.mountAccessible(<EraColumn {...ENGINEERING_PROPS} />)
    cy.findByTestId('case-study-marker').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<EraColumn {...WITH_CASE_STUDY} />)
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
