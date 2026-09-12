/**
 * PublicationsBlock — Cypress CT spec
 *
 * Coverage:
 * - Renders a citation per publication
 * - Wraps the citation in a DOI link when a DOI is present
 * - Renders nothing when there are no publications
 * - axe-clean
 */

import { PublicationsBlock } from './PublicationsBlock'
import type { Publication } from '@/types/content'

const PUB: Publication = {
  key: 'ABC123',
  type: 'journalArticle',
  title: 'Dynamic Geometry in Undergraduate Teaching',
  authors: ['Van Labeke, N.', 'Ainsworth, S.'],
  year: 2003,
  venue: 'Journal of Computer Assisted Learning',
  tags: ['calques3d'],
}

describe('PublicationsBlock', () => {
  it('renders a citation for each publication', () => {
    cy.mountAccessible(<PublicationsBlock publications={[PUB]} />)
    cy.findByTestId('publications-block').should('contain.text', 'Van Labeke, N.')
    cy.findByTestId('publications-block').should(
      'contain.text',
      'Dynamic Geometry in Undergraduate Teaching'
    )
  })

  it('wraps the citation in a DOI link when a DOI is present', () => {
    cy.mountAccessible(<PublicationsBlock publications={[{ ...PUB, doi: '10.1000/xyz123' }]} />)
    cy.get("a[href='https://doi.org/10.1000/xyz123']").should('exist')
  })

  it('renders nothing when there are no publications', () => {
    cy.mountAccessible(<PublicationsBlock publications={[]} />)
    cy.findByTestId('publications-block').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <PublicationsBlock publications={[PUB, { ...PUB, key: 'DEF456', doi: '10.1000/xyz123' }]} />
    )
    cy.checkA11y()
  })
})
