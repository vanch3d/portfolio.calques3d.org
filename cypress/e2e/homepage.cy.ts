/**
 * / — Homepage Cypress E2E spec
 *
 * Tests the homepage at page composition level.
 * Does NOT re-test what CT specs already cover (component rendering, prop variants).
 *
 * Focuses on:
 *   - Route load and page structure
 *   - Hero section presence and landmark
 *   - h1 visible in first viewport
 *   - One Red Rule: exactly one .active-mark element
 *   - Era blocks below the fold (both present)
 *   - Era nav links present
 *   - Scroll prompt is aria-hidden
 *   - Page-level a11y
 *
 * Responsive arc rules (regression guards):
 *   - preserveAspectRatio="xMidYMin slice" must remain set on the hero SVG.
 *     xMidYMin pins the SVG top to the viewport top so the timeline legend
 *     (y=56-80 in the 1440×900 viewBox) is visible on all screen widths.
 *     Reversion to xMidYMid would clip the timeline on screens wider than 16:10.
 *
 * Site nav scroll reveal:
 *   - nav#site-nav has nav-hidden on load, nav-visible after scrolling 35% of hero.
 */

describe('/ — homepage', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.injectAxe()
  })

  // ── Page load ────────────────────────────────────────────────────────────

  it('loads without error', () => {
    cy.location('pathname').should('eq', '/')
  })

  it('has no axe accessibility violations', () => {
    cy.checkA11y()
  })

  // ── Hero section ─────────────────────────────────────────────────────────

  it('renders a hero section with aria-label', () => {
    cy.get('section[aria-label]').should('exist')
  })

  it('renders a visible h1 in the hero', () => {
    cy.get('h1').should('be.visible')
  })

  it('h1 contains the name', () => {
    cy.get('h1').should('contain.text', 'Nicolas')
  })

  it('renders the positioning sentence', () => {
    cy.contains('25 years').should('be.visible')
  })

  it('scroll prompt is aria-hidden', () => {
    cy.contains('Scroll').closest("[aria-hidden='true']").should('exist')
  })

  // ── One Red Rule ──────────────────────────────────────────────────────────
  //
  // The homepage is the root surface — it has no breadcrumb and no nav active
  // segment. Zero active-marks is correct here; the One Red Rule applies when
  // there is a navigation context (sub-pages use a breadcrumb with one red segment).

  it('has no active-mark elements (root page has no breadcrumb)', () => {
    cy.get('.active-mark').should('have.length', 0)
  })

  // ── Era blocks ────────────────────────────────────────────────────────────

  it('renders both era headings', () => {
    cy.contains('h2', 'Research').should('exist')
    cy.contains('h2', 'Engineering').should('exist')
  })

  it('renders era date spans', () => {
    cy.contains('1995').should('exist')
    cy.contains('2018').should('exist')
  })

  it('renders nav links to research and engineering', () => {
    cy.get("a[href='/research']").should('exist')
    cy.get("a[href='/engineering']").should('exist')
  })

  // ── IdentityBlock — server component coverage ─────────────────────────────
  // IdentityBlock is an async Server Component (await getTranslations) and
  // cannot be mounted in CT. These tests mirror the CT spec narrative exactly,
  // executed against the real rendered page. See IdentityBlock.spec.cy.tsx.
  describe('IdentityBlock', () => {
    it('renders an h1', () => {
      cy.get('h1').should('exist')
    })

    it('h1 contains the full name', () => {
      cy.get('h1').should('contain.text', 'Nicolas')
      cy.get('h1').should('contain.text', 'Van\u00a0Labeke')
    })

    it('renders the era label text', () => {
      cy.get('main').contains('h2', 'Research').should('be.visible')
      cy.get('main').contains('h2', 'Engineering').should('be.visible')
    })

    it('renders the positioning sentence', () => {
      cy.contains('25 years of precise practice').should('be.visible')
    })

    it('leading rule span inside the era-label paragraph is aria-hidden', () => {
      cy.get('#canvas-identity p').first().find("[aria-hidden='true']").should('exist')
    })
  })

  // ── Site nav — scroll reveal ──────────────────────────────────────────────
  //
  // HomepageScrollHandler adds nav-visible to #site-nav once scroll progress
  // exceeds 30% of the hero height. nav-visible (declared after nav-hidden in
  // utilities/index.css) overrides translateY(-100%) → translateY(0).
  // Regression: hook must toggle "nav-visible", not "visible" (wrong class name
  // that silently fails because no CSS rule targets it).

  describe('site nav — scroll reveal', () => {
    it('nav is hidden on load', () => {
      cy.get('nav#site-nav').should('have.class', 'nav-hidden')
      cy.get('nav#site-nav').should('not.have.class', 'nav-visible')
    })

    it('nav gains nav-visible class after scrolling past 30% of hero height', () => {
      cy.get('#hero').then(($hero) => {
        const scrollTarget = Math.floor($hero[0].offsetHeight * 0.35)
        cy.scrollTo(0, scrollTarget)
      })
      cy.get('nav#site-nav').should('have.class', 'nav-visible')
    })
  })

  // ── Arc SVG — responsive viewport rules ───────────────────────────────────
  //
  // RULE: hero SVG must use preserveAspectRatio="xMidYMin slice".
  // xMidYMin pins the SVG top to the viewport top.
  // Any screen wider than 16:10 (SVG native ratio 1440:900) causes the SVG
  // to scale up in height; xMidYMid would clip top AND bottom equally,
  // hiding the timeline legend. xMidYMin clips only the bottom.
  //
  // These tests run at specific viewport sizes to catch regression at the
  // common breakpoints that exposed the original bug:
  //   1280×800  — 16:10 (SVG native, no clip)
  //   1920×1080 — 16:9  (wider, top clip with xMidYMid)
  //   1440×900  — 16:10 (design baseline, no clip)

  describe('arc SVG — responsive rendering', () => {
    it('hero SVG preserveAspectRatio is xMidYMin slice (regression guard)', () => {
      cy.get("svg[aria-hidden='true']").should('have.attr', 'preserveAspectRatio', 'xMidYMin slice')
    })

    it('timeline legend (CAREER ARC) is in the SVG DOM at 1280×800', () => {
      cy.viewport(1280, 800)
      cy.visit('/')
      cy.get("svg[aria-hidden='true']").contains('CAREER ARC').should('exist')
    })

    it('timeline legend (CAREER ARC) is in the SVG DOM at 1920×1080', () => {
      cy.viewport(1920, 1080)
      cy.visit('/')
      cy.get("svg[aria-hidden='true']").contains('CAREER ARC').should('exist')
    })

    it('year labels 1995, 2018, 2026 present in SVG DOM at 1920×1080', () => {
      cy.viewport(1920, 1080)
      cy.visit('/')
      cy.get("svg[aria-hidden='true']").contains('1995').should('exist')
      cy.get("svg[aria-hidden='true']").contains('2018').should('exist')
      cy.get("svg[aria-hidden='true']").contains('2026').should('exist')
    })

    it('inflection circle (One Red Rule) is present at 1920×1080', () => {
      cy.viewport(1920, 1080)
      cy.visit('/')
      cy.get("[data-testid='inflection-circle']").should('exist')
    })
  })
})
