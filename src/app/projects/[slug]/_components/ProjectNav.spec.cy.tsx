/**
 * ProjectNav — Cypress CT spec
 *
 * Coverage:
 * - Renders prev/next links (the short "← Previous project" / "Next project
 *   →" line) pointing at their project pages, with the arrow glyph
 * - Renders the project title as separate text outside the link
 * - Renders the position label + count as plain text, not a link
 * - Hides the prev/next slot when there is no neighbour on that side
 *   (first/last project on the career timeline)
 * - axe-clean
 */

import { ProjectNav } from './ProjectNav'
import type { ProjectResolution } from '@/lib/content/projects'
import type { EngineeringProject } from '@/types/content'

function makeProject(slug: string, title: string): ProjectResolution {
  const project: EngineeringProject = {
    slug,
    title,
    type: 'engineering',
    status: 'completed',
    visibility: 'public',
    featured: false,
    position: 'hivemq',
    period: { start: '2018', end: null },
    links: {},
    tags: [],
  }
  return { project, type: 'engineering' }
}

const PREV = makeProject('audiles', 'Audiles')
const NEXT = makeProject('leactivemath', 'LeActiveMath')

describe('ProjectNav', () => {
  it('renders the prev/next links with directional arrows, and the titles outside the links', () => {
    cy.mountAccessible(
      <ProjectNav prev={PREV} next={NEXT} positionLabel="LORIA" positionCount={4} />
    )
    cy.get("a[href='/projects/audiles']").should('have.text', '← Previous project')
    cy.get("a[href='/projects/leactivemath']").should('have.text', 'Next project →')
    cy.get("a[href='/projects/audiles']").should('not.contain.text', 'Audiles')
    cy.get("a[href='/projects/leactivemath']").should('not.contain.text', 'LeActiveMath')
    cy.contains('p', 'Audiles').should('exist')
    cy.contains('p', 'LeActiveMath').should('exist')
  })

  it('renders the position label and count as plain text', () => {
    cy.mountAccessible(
      <ProjectNav prev={PREV} next={NEXT} positionLabel="LORIA" positionCount={4} />
    )
    cy.findByTestId('project-nav-position').should('contain.text', 'LORIA')
    cy.findByTestId('project-nav-position').should('contain.text', '4 projects')
    cy.findByTestId('project-nav-position').find('a').should('not.exist')
  })

  it('hides the prev slot when there is no previous project', () => {
    cy.mountAccessible(
      <ProjectNav prev={null} next={NEXT} positionLabel="HiveMQ" positionCount={1} />
    )
    cy.get("a[href='/projects/audiles']").should('not.exist')
    cy.get("a[href='/projects/leactivemath']").should('exist')
  })

  it('hides the next slot when there is no next project', () => {
    cy.mountAccessible(
      <ProjectNav prev={PREV} next={null} positionLabel="HiveMQ" positionCount={1} />
    )
    cy.get("a[href='/projects/leactivemath']").should('not.exist')
    cy.get("a[href='/projects/audiles']").should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <ProjectNav prev={PREV} next={NEXT} positionLabel="LORIA" positionCount={4} />
    )
    cy.checkA11y()
  })
})
