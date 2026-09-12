/**
 * SiblingNav — Cypress CT spec
 *
 * Coverage:
 * - Renders prev/next links for a middle project at a multi-project position
 * - P-FIX-2: the position-overview link always renders, even when this
 *   project is the only one at its position (no prev/next, no count)
 * - axe-clean on both states
 */

import { SiblingNav } from './SiblingNav'
import type { ProjectResolution } from '@/lib/content/projects'
import type { EngineeringProject } from '@/types/content'

function makeProject(slug: string, title: string, start: string): ProjectResolution {
  const project: EngineeringProject = {
    slug,
    title,
    type: 'engineering',
    status: 'completed',
    visibility: 'public',
    featured: false,
    position: 'hivemq',
    period: { start, end: null },
    links: {},
    tags: [],
  }
  return { project, type: 'engineering' }
}

const THREE = [
  makeProject('a', 'Project A', '2018'),
  makeProject('b', 'Project B', '2020'),
  makeProject('c', 'Project C', '2022'),
]

describe('SiblingNav', () => {
  it('renders prev and next links for a middle project', () => {
    cy.mountAccessible(<SiblingNav currentSlug="b" positionProjects={THREE} type="engineering" />)
    cy.get("a[href='/projects/a']").should('exist')
    cy.get("a[href='/projects/c']").should('exist')
    cy.findByTestId('sibling-nav').should('contain.text', '3 projects at this position')
  })

  it('always renders the position-overview link, even alone at a position', () => {
    const solo = [makeProject('solo', 'Solo Project', '2023')]
    cy.mountAccessible(<SiblingNav currentSlug="solo" positionProjects={solo} type="engineering" />)
    cy.get("a[href='/engineering']").should('contain.text', 'Position overview')
    cy.findByTestId('sibling-nav').should('not.contain.text', 'projects at this position')
  })

  it('has no axe accessibility violations (multi-project state)', () => {
    cy.mountAccessible(<SiblingNav currentSlug="b" positionProjects={THREE} type="engineering" />)
    cy.checkA11y()
  })

  it('has no axe accessibility violations (solo state)', () => {
    const solo = [makeProject('solo', 'Solo Project', '2023')]
    cy.mountAccessible(<SiblingNav currentSlug="solo" positionProjects={solo} type="engineering" />)
    cy.checkA11y()
  })
})
