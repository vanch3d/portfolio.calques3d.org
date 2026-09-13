/**
 * CaseStudiesBlock — Cypress CT spec
 *
 * Coverage:
 * - Renders a preview card per case study with a working link
 * - Renders nothing when there are no case studies
 * - axe-clean
 */

import { CaseStudiesBlock } from './CaseStudiesBlock'
import type { CaseStudy } from '@/types/content'

const STUDY: CaseStudy = {
  slug: 'design-retro',
  project: 'hivemq-edge',
  title: 'HiveMQ Edge: A Design Retrospective',
  status: 'published',
  featured: true,
  tags: [],
}

describe('CaseStudiesBlock', () => {
  it('renders a card with the case study title and a link', () => {
    cy.mountAccessible(<CaseStudiesBlock projectSlug="hivemq-edge" caseStudies={[STUDY]} />)
    cy.findByTestId('case-study-card').should('contain.text', 'HiveMQ Edge: A Design Retrospective')
    cy.get("a[href='/case-studies/hivemq-edge--design-retro']").should('exist')
  })

  it('renders nothing when there are no case studies', () => {
    cy.mountAccessible(<CaseStudiesBlock projectSlug="hivemq-edge" caseStudies={[]} />)
    cy.findByTestId('case-studies-block').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<CaseStudiesBlock projectSlug="hivemq-edge" caseStudies={[STUDY]} />)
    cy.checkA11y()
  })
})
