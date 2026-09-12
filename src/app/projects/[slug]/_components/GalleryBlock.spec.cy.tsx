/**
 * GalleryBlock — Cypress CT spec
 *
 * Coverage:
 * - Renders the album name when present
 * - Renders nothing when absent
 * - axe-clean
 */

import { GalleryBlock } from './GalleryBlock'

describe('GalleryBlock', () => {
  it('renders the album name', () => {
    cy.mountAccessible(<GalleryBlock galleryAlbum="calques3d" />)
    cy.findByTestId('gallery-block').should('contain.text', 'calques3d')
  })

  it('renders nothing when there is no album', () => {
    cy.mountAccessible(<GalleryBlock />)
    cy.findByTestId('gallery-block').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<GalleryBlock galleryAlbum="calques3d" />)
    cy.checkA11y()
  })
})
