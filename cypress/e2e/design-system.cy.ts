/**
 * /lab/design-system — Cypress E2E spec
 *
 * Tests the design-system surface group at the page composition level.
 * Does NOT re-test what CT specs already cover (component class names,
 * prop variants, individual atom structure).
 *
 * Focuses on:
 *   - Route loads and page structure
 *   - Nav breadcrumb is correct and the One Red Rule is enforced
 *   - Section nav links are present and functional
 *   - Key content regions are present (named rules grid, colour strip, type ramp)
 *   - Cross-page navigation via section links
 *   - Page-level a11y on all three routes
 *
 * Requires: pnpm build && pnpm start (or pnpm dev)
 */

// ── /lab/design-system ───────────────────────────────────────────────────────

describe('/lab/design-system — index', () => {
  beforeEach(() => {
    cy.visit('/lab/design-system')
    cy.injectAxe()
  })

  it('loads without error', () => {
    cy.location('pathname').should('eq', '/lab/design-system')
    cy.get('main').should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.checkA11y()
  })

  // ── Breadcrumb / nav ────────────────────────────────────────────────────

  it('breadcrumb contains links to / and /lab', () => {
    cy.get("nav[aria-label='Breadcrumb and section navigation'] a[href='/']").should('exist')
    cy.get("nav[aria-label='Breadcrumb and section navigation'] a[href='/lab']").should('exist')
  })

  it("breadcrumb marks 'Design System' as current with aria-current", () => {
    cy.get("[aria-current='page']").should('contain.text', 'Design System')
  })

  it('has exactly one active-mark in the navigation header (One Red Rule)', () => {
    // Scoped to header: the page content includes active-mark in specimens
    // (documentation surface — intentional). The nav invariant is: one red in header.
    cy.get('header .active-mark').should('have.length', 1)
  })

  it('section nav contains a link to /lab/design-system/colors', () => {
    cy.get("a[href='/lab/design-system/colors']").should('exist')
  })

  it('section nav contains a link to /lab/design-system/typography', () => {
    cy.get("a[href='/lab/design-system/typography']").should('exist')
  })

  it('section nav contains a link to /lab/design-system/atoms', () => {
    cy.get("a[href='/lab/design-system/atoms']").should('exist')
  })

  // ── Content regions ─────────────────────────────────────────────────────

  it("renders the page title 'The Construction on Tracing Paper'", () => {
    cy.get('h1').should('contain.text', 'The Construction on Tracing Paper')
  })

  it('renders the Named Rules section heading', () => {
    cy.get('#named-rules-heading').should('exist')
  })

  it('renders three named-rule cards in the Named Rules section', () => {
    cy.get('#named-rules-heading').closest('section').find('article').should('have.length', 3)
  })

  it('renders five colour swatches in the colour preview strip', () => {
    // The strip uses aria-hidden="true" so we query by visual presence
    cy.get('main').within(() => {
      // Five swatch divs each containing a label "Ground", "Ink", etc.
      ;['Ground', 'Ink', 'Secondary', 'Ghost', 'Active'].forEach((name) => {
        cy.contains(name).should('be.visible')
      })
    })
  })

  it('renders five type-scale rows in the type ramp', () => {
    ;['Display', 'Headline', 'Title', 'Body', 'Label'].forEach((role) => {
      cy.contains(role).should('be.visible')
    })
  })

  it('renders the Atoms section heading', () => {
    cy.get('#atoms-heading').should('exist')
  })

  it('atoms preview strip contains NavLink specimens with nav-link class', () => {
    cy.get('#atoms-heading')
      .closest('section')
      .within(() => {
        cy.get('a.nav-link').should('have.length.gte', 2)
      })
  })

  it('navigates to /lab/design-system/atoms via the atoms link', () => {
    cy.visit('/lab/design-system')
    cy.contains('a', 'Full atom documentation').click()
    cy.location('pathname').should('eq', '/lab/design-system/atoms')
  })

  // ── Cross-page navigation ───────────────────────────────────────────────

  it('navigates to /lab/design-system/colors via the colours link', () => {
    cy.contains('a', 'Full colour documentation').click()
    cy.location('pathname').should('eq', '/lab/design-system/colors')
  })

  it('navigates to /lab/design-system/typography via the type link', () => {
    cy.visit('/lab/design-system')
    cy.contains('a', 'Full type documentation').click()
    cy.location('pathname').should('eq', '/lab/design-system/typography')
  })
})

// ── /lab/design-system/colors ────────────────────────────────────────────────

describe('/lab/design-system/colors', () => {
  beforeEach(() => {
    cy.visit('/lab/design-system/colors')
    cy.injectAxe()
  })

  it('loads without error', () => {
    cy.location('pathname').should('eq', '/lab/design-system/colors')
    cy.get('main').should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.checkA11y()
  })

  it("renders the page heading 'Colours'", () => {
    cy.get('h1').should('contain.text', 'Colours')
  })

  it('has exactly one active-mark in the navigation header (One Red Rule)', () => {
    cy.get('header .active-mark').should('have.length', 1)
  })

  it('renders a Neutral section with four swatches', () => {
    cy.get('#neutral-heading').should('exist')
    // Four role=img swatch blocks in the neutral group
    cy.get("section[aria-labelledby='neutral-heading'] [role='img']").should('have.length', 4)
  })

  it('renders an Accent section with one swatch', () => {
    cy.get('#accent-heading').should('exist')
    cy.get("section[aria-labelledby='accent-heading'] [role='img']").should('have.length', 1)
  })

  it('renders the named-rule callout for Compass-Arc Red', () => {
    cy.contains('The One Red Rule').should('be.visible')
  })

  it('renders all five colour names', () => {
    ;[
      'Draughting Paper',
      'Construction Graphite',
      'Faded Graphite',
      'Ghost Line',
      'Compass-Arc Red',
    ].forEach((name) => {
      cy.contains(name).should('be.visible')
    })
  })

  it('renders all five hex values', () => {
    ;['#f8f4ed', '#2a2a2a', '#6b6b6b', '#c8c4bc', '#c0392b'].forEach((hex) => {
      cy.contains(hex).should('be.visible')
    })
  })
})

// ── /lab/design-system/typography ────────────────────────────────────────────

describe('/lab/design-system/typography', () => {
  beforeEach(() => {
    cy.visit('/lab/design-system/typography')
    cy.injectAxe()
  })

  it('loads without error', () => {
    cy.location('pathname').should('eq', '/lab/design-system/typography')
    cy.get('main').should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.checkA11y()
  })

  it("renders the page heading 'Typography'", () => {
    cy.get('h1').should('contain.text', 'Typography')
  })

  it('has exactly one active-mark in the navigation header (One Red Rule)', () => {
    cy.get('header .active-mark').should('have.length', 1)
  })

  it('renders the specimens section heading', () => {
    cy.get('#specimens-heading').should('exist')
  })

  it('renders all five specimen role labels', () => {
    ;['Display', 'Headline', 'Title', 'Body', 'Label'].forEach((role) => {
      cy.contains(role).should('be.visible')
    })
  })

  it('renders the display specimen text', () => {
    cy.contains('Dr Nicolas Van Labeke').should('be.visible')
  })

  it('renders the named rules section', () => {
    cy.get('#type-rules-heading').should('exist')
    cy.contains('The Incline Rule').should('be.visible')
  })

  it('renders the incline comparison — two rows', () => {
    cy.contains('Display — geometric incline as character').should('be.visible')
    cy.contains('Body italic — titles of works only').should('be.visible')
  })
})

// ── /lab/design-system/atoms ─────────────────────────────────────────────────

describe('/lab/design-system/atoms', () => {
  beforeEach(() => {
    cy.visit('/lab/design-system/atoms')
    cy.injectAxe()
  })

  it('loads without error', () => {
    cy.location('pathname').should('eq', '/lab/design-system/atoms')
    cy.get('main').should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.checkA11y()
  })

  it("renders the page heading 'Atoms'", () => {
    cy.get('h1').should('contain.text', 'Atoms')
  })

  it('has exactly one active-mark in the navigation header (One Red Rule)', () => {
    cy.get('header .active-mark').should('have.length', 1)
  })

  // ── NavLink section ─────────────────────────────────────────────────────

  it('renders the NavLink section heading', () => {
    cy.get('#atom-nav-link-heading').should('exist')
  })

  it('renders NavLink breadcrumb, section nav, and standalone specimens', () => {
    ;['Breadcrumb', 'Section nav', 'Standalone'].forEach((label) => {
      cy.contains(label).should('be.visible')
    })
  })

  it('all NavLink anchors carry the nav-link class (always-visible underline)', () => {
    cy.get('a.nav-link').should('have.length.gte', 5)
  })

  it('renders the four state annotations', () => {
    ;['Rest', 'Hover', 'Focus', 'Current'].forEach((state) => {
      cy.contains(state).should('be.visible')
    })
  })

  // ── SectionLabel section ────────────────────────────────────────────────

  it('renders the SectionLabel section heading', () => {
    cy.get('#atom-section-label-heading').should('exist')
  })

  it('renders SectionLabel default and active specimens', () => {
    cy.contains('Colors').should('be.visible')
    cy.contains('Lab').should('be.visible')
  })

  // ── NamedRuleCard section ───────────────────────────────────────────────

  it('renders the NamedRuleCard section heading', () => {
    cy.get('#atom-named-rule-card-heading').should('exist')
  })

  it('renders with-rationale, without-rationale, and in-grid examples', () => {
    ;['With rationale', 'Without rationale', 'In grid'].forEach((label) => {
      cy.contains(label).should('be.visible')
    })
  })
})
