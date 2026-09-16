/**
 * /publications — Cypress E2E spec
 *
 * Zotero-backed page — exercised here via MSW fixtures (see src/mocks/handlers/zotero.ts),
 * intercepted server-side by src/instrumentation.ts when MSW_ENABLED=true (set by the
 * `test:e2e*` scripts in package.json). See ADR 002's "Cypress E2E (smoke)" layer.
 *
 * The fixture set (src/mocks/handlers/zotero.ts, MOCK_ITEMS) has 3 items spanning
 * three distinct years (2016, 2014, 2010). Only the 2016 item (key AAAA0001) has
 * archiveLocation set, so it's the only one expected to render a PDF link. The
 * 2010 item (key BBBB0001) is the only one tagged "nvl.calques3d" (-> "calques3d"
 * after the nvl. prefix is stripped), used below to exercise tag filtering.
 */

/**
 * `next dev` (Turbopack) compiles each route on first request rather than
 * ahead of time — see the `distDir` comment in next.config.ts. The very
 * first `cy.visit('/publications')` in a freshly started E2E server can
 * therefore resolve, and pass Cypress's actionability checks, before the
 * route's JS chunk has finished compiling and React has attached event
 * handlers — so a click can land on still-inert markup. One retry (not an
 * open-ended loop) covers that specific one-time cold-compile window;
 * `.should('be.visible')` below still does the real, deterministic wait via
 * Cypress's built-in assertion retry.
 */
function toggleDrawer(): void {
  cy.get('[data-testid="drawer-toggle"]').click()
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="tag-drawer-panel"]').length === 0) {
      cy.get('[data-testid="drawer-toggle"]').click()
    }
  })
  cy.get('[data-testid="tag-drawer-panel"]').should('be.visible')
}

describe('/publications', () => {
  beforeEach(() => {
    cy.viewport(1280, 900)
    cy.visit('/publications')
    cy.injectAxe()
  })

  it('loads without error', () => {
    cy.location('pathname').should('eq', '/publications')
    cy.get('main').should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.checkA11y()
  })

  it("renders a visible h1 containing 'Publications'", () => {
    cy.get('h1').should('be.visible').and('contain.text', 'Publications')
  })

  it('breadcrumb links back to /', () => {
    cy.get("nav[aria-label='Breadcrumb'] a[href='/']").should('exist')
  })

  it("breadcrumb marks 'Publications' as current with aria-current", () => {
    cy.get("[aria-current='page']").should('contain.text', 'Publications')
  })

  it('renders the publication count matching the MSW fixture data', () => {
    cy.findByTestId('counter-records').should('contain.text', '3')
  })

  it('groups publications by year matching the MSW fixture data', () => {
    cy.get('[data-testid="publications-block"]').should('have.length', 3)
    cy.get('[data-testid="publications-block"]').eq(0).should('contain.text', '2016')
    cy.get('[data-testid="publications-block"]').eq(1).should('contain.text', '2014')
    cy.get('[data-testid="publications-block"]').eq(2).should('contain.text', '2010')
    cy.get('[data-testid="publication-title"]').should('have.length', 3)
  })

  it('filters by tag and only matching publications remain visible', () => {
    // Unfiltered: all 3 fixture items are showing.
    cy.get('#result-count').should('contain.text', '3 publications showing out of 3')

    toggleDrawer()
    cy.get('[data-testid="tag-chip-calques3d"]').click()

    // Filtered: only the "calques3d"-tagged item (BBBB0001) remains.
    cy.get('#result-count').should('contain.text', 'one publication showing out of 3')
    cy.get('[data-testid="publication-title"]')
      .should('have.length', 1)
      .and('contain.text', '3D Dynamic Geometry')
  })

  it('shows a PDF link only for the fixture item with an archive location', () => {
    cy.get('a[href="/publications/AAAA0001/pdf"]').should('exist')
    cy.get('a[href="/publications/AAAA0002/pdf"]').should('not.exist')
    cy.get('a[href="/publications/BBBB0001/pdf"]').should('not.exist')
  })

  it('has exactly one active-mark element (One Red Rule)', () => {
    cy.get('.active-mark').should('have.length', 1)
  })
})
