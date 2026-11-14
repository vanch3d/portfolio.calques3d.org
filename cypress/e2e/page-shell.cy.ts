/**
 * Page shell — Cypress E2E spec
 *
 * Every route except the homepage is framed by PageShell: a <header> holding
 * the shared Breadcrumb (with a way back to the home page), <main id="main-content">
 * and a <footer>. Every route, the homepage included, starts with the SkipNav link.
 *
 * Per-route axe checks live in each route's own spec.
 */

const SHELL_ROUTES = [
  '/research',
  '/engineering',
  '/lab',
  '/lab/adr',
  '/lab/design-system',
  '/lab/design-system/colors',
  '/lab/design-system/typography',
  '/lab/design-system/atoms',
  '/lab/design-system/molecules',
  '/publications',
  '/projects/calques3d',
  '/case-studies',
  '/case-studies/calques3d/calques3d',
  '/case-studies/hivemq-edge/design-retro',
  '/case-studies/hivemq-edge/design-retro/problem-class',
]

function expectSkipNavFirst() {
  cy.get('body a').first().should('have.attr', 'data-slot', 'skip-nav')
  // Wait for hydration: until React attaches its handlers, a click is just the
  // browser's native anchor jump, which scrolls but does not move focus.
  cy.get("[data-slot='skip-nav']")
    .should('have.attr', 'href', '#main-content')
    .should(($a) => {
      expect(Object.keys($a[0]).some((key) => key.startsWith('__reactProps'))).to.eq(true)
    })
    .click({ force: true })
  cy.get('main#main-content').should('have.focus')
}

describe('page shell', () => {
  beforeEach(() => {
    cy.viewport(1280, 900)
  })

  SHELL_ROUTES.forEach((route) => {
    describe(route, () => {
      beforeEach(() => {
        cy.visit(route)
      })

      it('has a header with a breadcrumb back to the home page', () => {
        cy.get('header nav[aria-label="Breadcrumb"]').should('have.length', 1)
        cy.get('header nav[aria-label="Breadcrumb"] a[href="/"]').should('exist')
        cy.get('header nav[aria-label="Breadcrumb"] [aria-current="page"]').should('exist')
      })

      it('has exactly one main landmark, and a footer', () => {
        cy.get('main').should('have.length', 1)
        cy.get('main').should('have.attr', 'id', 'main-content')
        cy.get('footer').should('exist')
      })

      it('offers a skip link first, which moves focus to main', () => {
        expectSkipNavFirst()
      })
    })
  })

  describe('/ (homepage)', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('offers a skip link first, which moves focus to main', () => {
      expectSkipNavFirst()
    })
  })
})
