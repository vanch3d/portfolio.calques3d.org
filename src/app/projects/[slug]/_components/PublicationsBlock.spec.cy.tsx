/**
 * PublicationsBlock — Cypress CT spec
 *
 * Coverage:
 * - Renders the pre-formatted citation (pub.formated) for each publication
 * - Falls back to a "record missing" placeholder when unformatted
 * - Renders nothing when there are no publications
 * - Uses groupName as the heading when provided
 * - Abstract <details> only renders when hasAbstract is set
 * - "Go to project" link only renders when hasProject is set
 * - DOI / PDF links only render when hasMetadata is set, with correct
 *   href and translated aria-labels
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
  formated:
    'Van Labeke, N., &amp; Ainsworth, S. (2003). Dynamic Geometry in Undergraduate Teaching.',
}

describe('PublicationsBlock', () => {
  it('renders the formatted citation for each publication', () => {
    cy.mountAccessible(<PublicationsBlock publications={[PUB]} />)
    cy.findByTestId('publication-title').should(
      'contain.text',
      'Dynamic Geometry in Undergraduate Teaching'
    )
  })

  it('renders a fallback when the citation has not been formatted', () => {
    cy.mountAccessible(<PublicationsBlock publications={[{ ...PUB, formated: undefined }]} />)
    cy.findByTestId('publication-title').should('contain.text', 'record missing')
  })

  it('renders nothing when there are no publications', () => {
    cy.mountAccessible(<PublicationsBlock publications={[]} />)
    cy.findByTestId('publications-block').should('not.exist')
  })

  it('uses groupName as the heading when provided', () => {
    cy.mountAccessible(<PublicationsBlock publications={[PUB]} groupName="2003 - 1/1" />)
    cy.findByTestId('publications-block').should('contain.text', '2003 - 1/1')
  })

  it('renders the abstract in a details/summary when hasAbstract is set', () => {
    cy.mountAccessible(
      <PublicationsBlock
        publications={[{ ...PUB, abstract: 'A study of dynamic geometry.' }]}
        hasAbstract
      />
    )
    cy.contains('Abstract').should('exist')
    cy.contains('A study of dynamic geometry.').should('exist')
  })

  it('does not render the abstract when hasAbstract is false', () => {
    cy.mountAccessible(
      <PublicationsBlock publications={[{ ...PUB, abstract: 'A study of dynamic geometry.' }]} />
    )
    cy.contains('Abstract').should('not.exist')
  })

  it('renders a "Go to project" link when hasProject is set', () => {
    cy.mountAccessible(
      <PublicationsBlock publications={[{ ...PUB, project: 'calques3d' }]} hasProject />
    )
    cy.contains('a', 'Go to project →').should('have.attr', 'href')
  })

  it('does not render a "Go to project" link when hasProject is false', () => {
    cy.mountAccessible(<PublicationsBlock publications={[{ ...PUB, project: 'calques3d' }]} />)
    cy.contains('Go to project →').should('not.exist')
  })

  it('renders DOI and PDF links with translated aria-labels when hasMetadata is set', () => {
    cy.mountAccessible(
      <PublicationsBlock
        publications={[{ ...PUB, doi: '10.1000/xyz123', pdf: 'dynamic-geometry.pdf' }]}
        hasMetadata
      />
    )
    cy.get("a[href='https://www.doi.org/10.1000/xyz123']").should(
      'have.attr',
      'aria-label',
      'DOI: 10.1000/xyz123'
    )
    cy.get("a[href='/publications/ABC123/pdf']").should('have.attr', 'aria-label', 'Open the PDF')
  })

  it('does not render metadata links when hasMetadata is false', () => {
    cy.mountAccessible(
      <PublicationsBlock publications={[{ ...PUB, doi: '10.1000/xyz123', pdf: 'file.pdf' }]} />
    )
    cy.get("a[href='https://www.doi.org/10.1000/xyz123']").should('not.exist')
    cy.get("a[href='/publications/ABC123/pdf']").should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <PublicationsBlock
        publications={[
          PUB,
          { ...PUB, key: 'DEF456', doi: '10.1000/xyz123', pdf: 'file.pdf', project: 'calques3d' },
        ]}
        hasAbstract
        hasMetadata
        hasProject
      />
    )
    cy.checkA11y()
  })
})
