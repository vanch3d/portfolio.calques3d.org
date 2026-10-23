// Page-composition level only — does not re-test what CT specs already cover.
describe('/ — homepage', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.injectAxe()
  })

  it('loads without error', () => {
    cy.location('pathname').should('eq', '/')
  })

  it('has no axe accessibility violations', () => {
    cy.checkA11y()
  })

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

  // Root surface has no breadcrumb/nav active segment, so zero active-marks is correct here.
  it('has no active-mark elements (root page has no breadcrumb)', () => {
    cy.get('.active-mark').should('have.length', 0)
  })

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

  // IdentityBlock is an async Server Component, can't be mounted in CT — see IdentityBlock.spec.cy.tsx.
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

  // Regression guard: HomepageScrollHandler must toggle "nav-visible", not "visible".
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

  // Canvas must never crop/scroll and must never overlap IdentityBlock — CT specs
  // mount CareerArc alone, so only this page-composition test catches the latter.
  // ERA II / the engineering sprinkle are exempt from the overlap check (always
  // visible by design, not guaranteed overlap-free at every aspect ratio — see
  // CareerArc.tsx's ENGINEERING_SLOT_0_OFFSET and .docs/tasks/2026-10-23-career-arc-fixes.md).
  describe('arc canvas — responsive rendering', () => {
    const VIEWPORTS: Array<[number, number]> = [
      [390, 844],
      [768, 1024],
      [1024, 768],
      [1280, 800],
      [1440, 900],
      [1920, 1080],
      [2560, 1440],
      [3440, 1440],
    ]

    VIEWPORTS.forEach(([width, height]) => {
      it(`canvas fits within the hero viewport without scrolling at ${width}×${height}`, () => {
        cy.viewport(width, height)
        cy.visit('/')
        cy.get("[data-testid='career-arc-canvas']").then(($canvas) => {
          const rect = $canvas[0].getBoundingClientRect()
          expect(rect.bottom, 'canvas bottom edge').to.be.at.most(height + 0.5)
          expect(rect.right, 'canvas right edge').to.be.at.most(width + 0.5)
        })
      })

      it(`canvas does not overlap IdentityBlock at ${width}×${height}`, () => {
        cy.viewport(width, height)
        cy.visit('/')
        cy.get('#canvas-identity').then(($identity) => {
          const identityRect = $identity[0].getBoundingClientRect()
          cy.get(
            "[data-testid^='sprinkle-'], [data-testid^='era-zone-'], [data-testid^='timeline-legend-']"
          )
            .filter(':visible')
            .each(($label) => {
              const testId = $label.attr('data-testid') ?? ''
              const alwaysVisibleByDesign =
                testId.startsWith('era-zone-engineering') ||
                testId.startsWith('sprinkle-engineering-0')
              if (alwaysVisibleByDesign) return

              const r = ($label[0] as Element).getBoundingClientRect()
              const overlaps =
                r.left < identityRect.right &&
                r.right > identityRect.left &&
                r.top < identityRect.bottom &&
                r.bottom > identityRect.top
              expect(overlaps, `${testId} overlaps IdentityBlock`).to.equal(false)
            })
        })
      })

      it(`ERA I and ERA II labels are both always visible at ${width}×${height}`, () => {
        cy.viewport(width, height)
        cy.visit('/')
        cy.get("[data-testid='era-zone-research']").should('be.visible')
        cy.get("[data-testid='era-zone-engineering']").should('be.visible')
      })
    })

    it('timeline legend (CAREER ARC) is rendered at 1920×1080', () => {
      cy.viewport(1920, 1080)
      cy.visit('/')
      cy.get("[data-testid='timeline-legend-arc-label']").should('contain.text', 'CAREER ARC')
    })

    it('year labels 1995, 2018, 2026 are rendered at 1920×1080', () => {
      cy.viewport(1920, 1080)
      cy.visit('/')
      cy.get("[data-testid='timeline-legend-start']").should('contain.text', '1995')
      cy.get("[data-testid='timeline-legend-transition']").should('contain.text', '2018')
      cy.get("[data-testid='timeline-legend-end']").should('contain.text', '2026')
    })

    it('inflection circle (One Red Rule) is present at 1920×1080', () => {
      cy.viewport(1920, 1080)
      cy.visit('/')
      cy.get("[data-testid='inflection-circle']").should('exist')
    })
  })
})
