/**
 * Case-study figures — Cypress E2E spec
 *
 * A resolved plate image opens full-viewport in a dialog (FigureLightbox). Uses
 * a case whose images are local files: Piwigo images are fetched live at render
 * time and the E2E server has no Piwigo mock.
 */

const CASE = '/case-studies/hivemq-edge/mapping-editor'

/** Waits for hydration (a click before it is a no-op), then clicks the first figure. */
function openFirstFigure() {
  cy.findAllByTestId('case-plate-expand').first().as('trigger')
  cy.get('@trigger')
    .scrollIntoView()
    .should(($el) => {
      expect(Object.keys($el[0]).some((key) => key.startsWith('__reactProps'))).to.eq(true)
    })
    .click()
}

describe('Case-study figures', () => {
  beforeEach(() => {
    cy.visit(CASE)
    cy.injectAxe()
  })

  it('has no axe accessibility violations', () => {
    cy.checkA11y()
  })

  it('opens a figure full-viewport, then closes with Esc and returns focus', () => {
    openFirstFigure()
    cy.findByTestId('case-plate-lightbox')
      .should('be.visible')
      .within(() => {
        cy.get('img').should('be.visible')
        cy.contains('Fig. 1')
      })
    cy.checkA11y()
    cy.press('Escape')
    cy.findByTestId('case-plate-lightbox').should('not.exist')
    cy.get('@trigger').should('have.focus')
  })

  it('shows the image no larger than its natural size', () => {
    openFirstFigure()
    cy.findByTestId('case-plate-lightbox')
      .find('img')
      .should(($img) => {
        const el = $img[0] as HTMLImageElement
        expect(el.getBoundingClientRect().width).to.be.at.most(el.naturalWidth + 1)
      })
  })
})
