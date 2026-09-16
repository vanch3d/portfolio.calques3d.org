/**
 * PublicationMainClient — Cypress CT spec
 *
 * Coverage:
 * - Renders publications grouped by year (descending)
 * - Shows the filtered/total result count
 * - Tag filtering interaction: selecting a tag narrows the rendered set
 * - Empty publications state
 * - axe-clean
 */

import PublicationMainClient from './PublicationMainClient'
import type { Publication } from '@/types/content'

const make = (key: string, year: number, tags: string[]): Publication => ({
  key,
  type: 'conferencePaper',
  title: `Publication ${key}`,
  authors: ['Van Labeke, Nicolas'],
  year,
  tags,
})

const PUBLICATIONS: Publication[] = [
  make('P1', 2016, ['safesea']),
  make('P2', 2016, ['calques3d']),
  make('P3', 2010, ['safesea']),
]

describe('PublicationMainClient', () => {
  beforeEach(() => {
    cy.viewport(1024, 768)
  })

  it('renders publications grouped by year, most recent first', () => {
    cy.mountAccessible(<PublicationMainClient publications={PUBLICATIONS} />)
    cy.findAllByTestId('publications-block').should('have.length', 2)
    cy.contains('2016 - 2/2').should('exist')
    cy.contains('2010 - 1/1').should('exist')
  })

  it('shows the filtered/total result count', () => {
    cy.mountAccessible(<PublicationMainClient publications={PUBLICATIONS} />)
    cy.get('#result-count').should('contain.text', '3 publications showing out of 3')
  })

  it('narrows the rendered set when a tag is activated', () => {
    cy.mountAccessible(<PublicationMainClient publications={PUBLICATIONS} />)
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('tag-chip-calques3d').click()

    cy.findAllByTestId('publications-block').should('have.length', 1)
    cy.contains('2016 - 1/2').should('exist')
    cy.contains('2010').should('not.exist')
    cy.get('#result-count').should('contain.text', 'one publication showing out of 3')
  })

  it('renders an empty state when there are no publications', () => {
    cy.mountAccessible(<PublicationMainClient publications={[]} />)
    cy.findByTestId('publications-block').should('not.exist')
    cy.get('#result-count').should('contain.text', 'No publication matching')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<PublicationMainClient publications={PUBLICATIONS} />)
    // PublicationMainClient renders its own top-level <main> — correct in the
    // real page (publications/page.tsx has no other <main>), but the CT
    // scaffold (cypress/support/component-index.html) also wraps every
    // mounted component in a <main id="cy-component-root"> to satisfy
    // page-level axe rules for components that don't render one themselves.
    // The scaffold's own doc comment sanctions disabling these three landmark
    // rules per-spec when the component under test renders its own <main>.
    cy.checkA11y(undefined, {
      rules: {
        'landmark-main-is-top-level': { enabled: false },
        'landmark-no-duplicate-main': { enabled: false },
        'landmark-unique': { enabled: false },
      },
    })
  })
})
