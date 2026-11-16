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
  it('renders the prev/next links with directional arrows', () => {
    cy.mountAccessible(
      <ProjectNav prev={PREV} next={NEXT} positionLabel="LORIA" positionCount={4} />
    )
    cy.get("a[href='/projects/audiles']").should('contain.text', '← Previous project')
    cy.get("a[href='/projects/leactivemath']").should('contain.text', 'Next project →')
  })

  it('names each link with the project title for assistive tech, and hides the visible duplicate', () => {
    cy.mountAccessible(
      <ProjectNav prev={PREV} next={NEXT} positionLabel="LORIA" positionCount={4} />
    )
    cy.findByRole('link', { name: /Previous project\s*:\s*Audiles/ }).should(
      'have.attr',
      'href',
      '/projects/audiles'
    )
    cy.findByRole('link', { name: /Next project.*\s*:\s*LeActiveMath/ }).should(
      'have.attr',
      'href',
      '/projects/leactivemath'
    )
    // The visible title beside the link is decorative: the link already carries it.
    cy.get("[aria-hidden='true']").contains('Audiles').should('exist')
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
