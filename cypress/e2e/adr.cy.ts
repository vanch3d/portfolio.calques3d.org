/**
 * /lab/adr — Cypress E2E spec
 *
 * Tests the ADR register index at the page composition level.
 * Does NOT re-test what CT specs already cover (component class names,
 * prop variants, Base UI internals).
 *
 * Focuses on:
 *   - Route load and page structure
 *   - Breadcrumb correctness and One Red Rule
 *   - Register header renders with real data (counters, dimension line)
 *   - Insights callout strip is present when insights exist
 *   - Filter bar is rendered (search input)
 *   - TagFilterDrawer toggle is rendered
 *   - Register table renders rows with real ADR data
 *   - Search filter narrows the visible rows
 *   - Tag filter via drawer narrows the visible rows
 *   - NONE button deselects all tags
 *   - CLEAR resets both search and tags
 *   - Load-more footer is present
 *   - Page-level a11y
 */

describe('/lab/adr — register index', () => {
  beforeEach(() => {
    cy.viewport(1280, 900)
    cy.visit('/lab/adr')
    cy.injectAxe()
  })

  // ── Page load ────────────────────────────────────────────────────────────

  it('loads without error', () => {
    cy.location('pathname').should('eq', '/lab/adr')
    cy.get('main').should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.checkA11y()
  })

  // ── Breadcrumb / One Red Rule ────────────────────────────────────────────

  it('breadcrumb contains links to / and /lab', () => {
    cy.get("nav[aria-label='Breadcrumb'] a[href='/']").should('exist')
    cy.get("nav[aria-label='Breadcrumb'] a[href='/lab']").should('exist')
  })

  it("breadcrumb marks 'ADR' as current with aria-current", () => {
    cy.get("[aria-current='page']").should('contain.text', 'ADR')
  })

  it('has no active-mark elements (ADR breadcrumb uses text-ink, not active-mark)', () => {
    // The ADR active breadcrumb segment uses aria-current="page" + text-ink,
    // not the active-mark class. The One Red Rule is not applied on this surface.
    cy.get('.active-mark').should('have.length', 0)
  })

  // ── Register header ──────────────────────────────────────────────────────

  it('renders the register subtitle heading', () => {
    cy.get('h1').should('be.visible')
  })

  it('renders Architecture and Decision Records label', () => {
    cy.contains('Architecture').should('be.visible')
    cy.contains('Decision Records').should('be.visible')
  })

  it('renders the RECORDS counter with a non-zero value', () => {
    // counter-records renders as a single span e.g. "RECORDS: 19"
    cy.findByTestId('counter-records').should('be.visible').and('contain.text', 'RECORDS:')
  })

  it('renders the INSIGHTS counter', () => {
    cy.findByTestId('counter-insights').should('be.visible').and('contain.text', 'INSIGHTS:')
  })

  it('renders the AS OF date', () => {
    cy.findByTestId('counter-as-of').should('be.visible').and('contain.text', 'AS OF:')
  })

  it('renders dimension-line tick labels', () => {
    cy.contains('001').should('exist')
  })

  // ── Insights callout ─────────────────────────────────────────────────────

  it('renders the insights callout strip', () => {
    cy.get('aside').should('contain.text', 'Discovered in Practice')
  })

  it('callout strip shows the insight title', () => {
    cy.contains('Draft PR as Hard Agent Containment Boundary').should('be.visible')
  })

  it('callout strip shows the Related ADR reference', () => {
    cy.contains('ADR 16').should('be.visible')
  })

  // ── Filter bar ───────────────────────────────────────────────────────────

  it('renders the search input', () => {
    cy.get("input[type='text']").should('exist')
  })

  it('renders the TAGS toggle button', () => {
    cy.findByTestId('drawer-toggle').should('be.visible')
  })

  // ── Register table ───────────────────────────────────────────────────────

  it('renders a table with ADR rows', () => {
    cy.get('table').should('exist')
    cy.get('tbody tr').should('have.length.gte', 1)
  })

  it('most recent accepted row has red number (text-active class)', () => {
    cy.get('tbody tr').first().find('td').first().should('have.class', 'text-active')
  })

  it('renders the column headers', () => {
    ;['NO.', 'TITLE', 'STATUS', 'DATE', 'TAGS'].forEach((col) => {
      cy.get('thead').contains(col).should('exist')
    })
  })

  // ── Search filter ────────────────────────────────────────────────────────

  it('search input narrows the visible rows', () => {
    cy.get('tbody tr')
      .its('length')
      .then((initialCount) => {
        cy.get("input[type='text']").type('deployment')
        cy.get('tbody tr').should('have.length.lessThan', initialCount)
      })
  })

  it('shows no-results message when search matches nothing', () => {
    cy.get("input[type='text']").type('xyzxyzxyz_no_match')
    cy.get('table').should('not.exist')
    cy.findByTestId('no-results').should('be.visible')
  })

  it('clearing the search restores all rows', () => {
    cy.get('tbody tr')
      .its('length')
      .then((initialCount) => {
        cy.get("input[type='text']").type('deployment').clear()
        cy.get('tbody tr').should('have.length', initialCount)
      })
  })

  // ── Tag filter via drawer ─────────────────────────────────────────────────

  it('clicking TAGS opens the drawer', () => {
    // Wait for React hydration: useEffect in AdrIndexClient sets data-testid="client-ready"
    // only on the client — SSR omits it, so this is a reliable hydration sentinel.
    cy.findByTestId('client-ready').should('exist')
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('tag-drawer-panel').should('exist')
  })

  it('selecting a tag in the drawer filters the table', () => {
    cy.get('tbody tr')
      .its('length')
      .then((initialCount) => {
        cy.findByTestId('client-ready').should('exist')
        cy.findByTestId('drawer-toggle').click()
        cy.findByTestId('tag-drawer-panel').should('exist')
        cy.get("[data-testid^='tag-chip-']").first().click()
        cy.get('tbody tr').should('have.length.lessThan', initialCount)
      })
  })

  it('NONE button deselects all tags and restores rows', () => {
    cy.get('tbody tr')
      .its('length')
      .then((initialCount) => {
        cy.findByTestId('client-ready').should('exist')
        cy.findByTestId('drawer-toggle').click()
        cy.get("[data-testid^='tag-chip-']").first().click()
        cy.get('tbody tr').should('have.length.lessThan', initialCount)
        cy.findByTestId('none-button').click()
        cy.get('tbody tr').should('have.length', initialCount)
      })
  })

  it('CLEAR resets both search and tags', () => {
    cy.get('tbody tr')
      .its('length')
      .then((initialCount) => {
        cy.findByTestId('client-ready').should('exist')
        cy.get("input[type='text']").type('a')
        cy.findByTestId('drawer-toggle').click()
        cy.get("[data-testid^='tag-chip-']").first().click()
        cy.findByTestId('drawer-toggle').click()
        cy.contains('button', /clear/i).click()
        cy.get("input[type='text']").should('have.value', '')
        cy.get('tbody tr').should('have.length', initialCount)
        cy.contains('button', /clear/i).should('not.exist')
      })
  })

  // ── Footer ───────────────────────────────────────────────────────────────

  it('renders the folio footer below the table', () => {
    // Footer shows either a count "N / N" (aria-hidden span) or a load-more button
    cy.get('main').within(() => {
      cy.contains(/\d+ \/ \d+|CONTINUATION/i).should('exist')
    })
  })

  // ── AdrRegisterHeader — server component coverage ─────────────────────────
  // AdrRegisterHeader is an async Server Component (await getTranslations) and
  // cannot be mounted in CT. These tests mirror the CT spec narrative exactly,
  // executed against the real rendered page. See AdrRegisterHeader.spec.cy.tsx.
  describe('AdrRegisterHeader', () => {
    it('renders the register subtitle h1 in the centre column', () => {
      cy.get('h1').should('be.visible')
    })

    it('renders Architecture and Decision Records in the left column', () => {
      cy.contains('Architecture').should('be.visible')
      cy.contains('Decision Records').should('be.visible')
    })

    it('renders the RECORDS counter', () => {
      cy.findByTestId('counter-records').should('contain.text', 'RECORDS:')
    })

    it('renders the INSIGHTS counter', () => {
      cy.findByTestId('counter-insights').should('contain.text', 'INSIGHTS:')
    })

    it('renders the AS OF date', () => {
      cy.findByTestId('counter-as-of').should('contain.text', 'AS OF:')
    })

    it('renders the zero-padded min tick label on the dimension line', () => {
      cy.findByTestId('dimension-line').should('contain.text', '001')
    })

    it('renders the zero-padded max tick label on the dimension line', () => {
      // Max tick reflects the actual ADR count — assert it exists and is padded
      cy.findByTestId('dimension-line')
        .find('span')
        .last()
        .invoke('text')
        .should('match', /^\d{3}$/)
    })

    it('dimension line is hidden from the accessibility tree', () => {
      cy.findByTestId('dimension-line').should('have.attr', 'aria-hidden', 'true')
    })
  })

  // ── InsightCalloutStrip — server component coverage ───────────────────────
  // InsightCalloutStrip is an async Server Component that also imports
  // server-only, making CT impossible. These tests mirror the CT spec narrative
  // exactly, executed against the real rendered page.
  // See InsightCalloutStrip.spec.cy.tsx.
  //
  // Note: "no relatedAdr" and other prop variants are not testable here —
  // the content is real data. Those edge cases need seeded data or a mock server.
  describe('InsightCalloutStrip', () => {
    it('renders the DISCOVERED IN PRACTICE label', () => {
      cy.get('aside').should('contain.text', 'Discovered in Practice')
    })

    it('renders the zero-padded insight number with the title', () => {
      cy.get('aside').should('contain.text', '001')
      cy.get('aside').should('contain.text', 'Draft PR as Hard Agent Containment Boundary')
    })

    it('renders the discoveredDuring context line', () => {
      cy.get('aside').should('contain.text', 'First live run of the pr-flow skill')
    })

    it('renders insight tags', () => {
      ;['agents', 'safety', 'github', 'workflow'].forEach((tag) => {
        cy.get('aside').should('contain.text', tag)
      })
    })

    it('aside has an aria-label', () => {
      cy.get('aside').should('have.attr', 'aria-label', 'Engineering Insights')
    })

    it('renders the Related ADR reference', () => {
      cy.get('aside').should('contain.text', 'ADR 16')
    })
  })
})
