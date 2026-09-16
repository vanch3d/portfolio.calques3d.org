/**
 * PublicationSearchBar — Cypress CT spec
 *
 * Coverage:
 * - Renders the tag list derived from getPublicationTags(publications)
 * - Calls onTagsChange when a tag chip is selected
 * - Reflects activeTags as pre-selected chips
 * - axe-clean
 */

import PublicationSearchBar from './PublicationSearchBar'
import type { Publication } from '@/types/content'

const make = (key: string, tags: string[]): Publication => ({
  key,
  type: 'conferencePaper',
  title: `Publication ${key}`,
  authors: ['Van Labeke, Nicolas'],
  year: 2010,
  tags,
})

const PUBLICATIONS: Publication[] = [
  make('P1', ['safesea']),
  make('P2', ['safesea', 'calques3d']),
  make('P3', ['calques3d']),
]

describe('PublicationSearchBar', () => {
  beforeEach(() => {
    // Desktop viewport — the tag drawer renders as a fixed full-screen
    // overlay below the sm breakpoint, same as TagFilterDrawer's own specs.
    cy.viewport(1024, 768)
  })

  it('renders the tag list derived from getPublicationTags', () => {
    cy.mountAccessible(
      <PublicationSearchBar publications={PUBLICATIONS} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('tag-chip-safesea').should('exist')
    cy.findByTestId('tag-chip-calques3d').should('exist')
  })

  it('calls onTagsChange when a tag chip is selected', () => {
    const onTagsChange = cy.stub().as('onTagsChange')
    cy.mountAccessible(
      <PublicationSearchBar
        publications={PUBLICATIONS}
        activeTags={[]}
        onTagsChange={onTagsChange}
      />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('tag-chip-safesea').click()
    cy.get('@onTagsChange').should('have.been.calledWith', ['safesea'])
  })

  it('reflects activeTags as pre-selected chips', () => {
    cy.mountAccessible(
      <PublicationSearchBar
        publications={PUBLICATIONS}
        activeTags={['safesea']}
        onTagsChange={cy.stub()}
      />
    )
    cy.findByTestId('active-chip-safesea').should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <PublicationSearchBar publications={PUBLICATIONS} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.checkA11y()
  })
})
