import type { CaseStudyImageMap } from '@/lib/content/case-study-images'
import { CaseFigure } from './CaseFigure'

const SRC =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="60"></svg>'
const IMAGES: CaseStudyImageMap = {
  'images/1-a.png': { src: SRC, width: 80, height: 60, comment: 'Piwigo comment' },
}

describe('CaseFigure', () => {
  it('renders a resolved image with its number and the MDX title as caption', () => {
    cy.mountAccessible(
      <CaseFigure
        plate={{
          kind: 'figure',
          no: 2,
          src: 'images/1-a.png',
          alt: 'A wireframe',
          title: 'The wireframe',
        }}
        images={IMAGES}
      />
    )
    cy.findByTestId('case-plate').within(() => {
      cy.get('img').should('have.attr', 'alt', 'A wireframe')
      cy.contains('Fig. 2')
      cy.contains('The wireframe')
    })
  })

  it('falls back to the Piwigo comment when the MDX gives no title', () => {
    cy.mountAccessible(
      <CaseFigure
        plate={{ kind: 'figure', no: 1, src: 'images/1-a.png', alt: 'x' }}
        images={IMAGES}
      />
    )
    cy.contains('Piwigo comment')
  })

  it('renders a labelled placeholder for an unresolved image', () => {
    cy.mountAccessible(
      <CaseFigure
        plate={{ kind: 'figure', no: 1, src: 'images/9-z.png', alt: 'Missing' }}
        images={{}}
      />
    )
    cy.findByTestId('case-plate-unavailable').should('have.attr', 'aria-label', 'Missing')
    cy.get('img').should('not.exist')
  })

  it('renders the pending plate with its number', () => {
    cy.mountAccessible(<CaseFigure plate={{ kind: 'pending', no: 3 }} images={{}} />)
    cy.findByTestId('case-plate-pending').should('contain.text', 'Plate pending')
    cy.contains('Fig. 3')
  })

  it('uses no red on a plate', () => {
    cy.mountAccessible(<CaseFigure plate={{ kind: 'pending', no: 1 }} images={{}} />)
    cy.get('.active-mark, .text-active, .bg-active').should('not.exist')
  })

  it('has no axe accessibility violations (resolved)', () => {
    cy.mountAccessible(
      <CaseFigure
        plate={{ kind: 'figure', no: 1, src: 'images/1-a.png', alt: 'A', title: 'T' }}
        images={IMAGES}
      />
    )
    cy.checkA11y()
  })

  it('has no axe accessibility violations (pending)', () => {
    cy.mountAccessible(<CaseFigure plate={{ kind: 'pending', no: 1 }} images={{}} />)
    cy.checkA11y()
  })
})
