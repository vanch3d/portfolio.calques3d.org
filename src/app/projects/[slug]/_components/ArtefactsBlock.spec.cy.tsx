/**
 * ArtefactsBlock — Cypress CT spec
 *
 * Coverage:
 * - Renders artefact links when public with artefacts
 * - Renders nothing when public with no artefacts
 * - Renders RestrictedBlock instead of the list when proprietary — even if
 *   artefacts happen to be present
 * - axe-clean on the public and proprietary states
 */

import { ArtefactsBlock } from './ArtefactsBlock'

describe('ArtefactsBlock', () => {
  it('renders a link for each artefact when public', () => {
    cy.mountAccessible(
      <ArtefactsBlock artefacts={['https://figma.com/file/xyz']} visibility="public" />
    )
    cy.get("a[href='https://figma.com/file/xyz']").should('exist')
  })

  it('renders nothing when public with no artefacts', () => {
    cy.mountAccessible(<ArtefactsBlock artefacts={[]} visibility="public" />)
    cy.findByTestId('artefacts-block').should('not.exist')
    cy.findByTestId('restricted-block').should('not.exist')
  })

  it('renders RestrictedBlock instead of the artefact list when proprietary', () => {
    cy.mountAccessible(
      <ArtefactsBlock artefacts={['https://figma.com/file/xyz']} visibility="proprietary" />
    )
    cy.findByTestId('restricted-block').should('exist')
    cy.findByTestId('artefacts-block').should('not.exist')
  })

  it('has no axe accessibility violations (public state)', () => {
    cy.mountAccessible(
      <ArtefactsBlock artefacts={['https://figma.com/file/xyz']} visibility="public" />
    )
    cy.checkA11y()
  })

  it('has no axe accessibility violations (proprietary state)', () => {
    cy.mountAccessible(<ArtefactsBlock artefacts={[]} visibility="proprietary" />)
    cy.checkA11y()
  })
})
