import { CareerArc } from './CareerArc'

const PROPS = {
  arcLabel: 'CAREER ARC · 31 YEARS',
  timelineStart: '1995',
  timelineTransition: '2018',
  timelineEnd: '2026',
  researchSprinkles: [
    {
      title: 'Calques 3D · 1995–2010',
      subtitle: '3D geometry · dynamic geometry software · ILE',
      periodStartYear: 1995,
      periodEndYear: 2010,
    },
    {
      title: 'SAFeSEA · 2010–2017',
      subtitle: 'AI · Adaptive Systems · HCI',
      periodStartYear: 2010,
      periodEndYear: 2017,
    },
  ],
  engineeringSprinkles: [
    {
      title: 'HiveMQ Edge · 2023–present',
      subtitle: 'React · TypeScript · React Flow',
      periodStartYear: 2023,
      periodEndYear: 2026,
    },
  ],
}

// Visible at every tier, including base — ERA I/II must always be readable (see CareerArc.tsx).
const ALWAYS_VISIBLE = [
  'arc-research-path',
  'arc-engineering-path',
  'inflection-circle',
  'timeline-legend',
  'era-zone-research',
  'era-zone-engineering',
  'sprinkle-research-0',
  'sprinkle-research-0-title',
  'sprinkle-engineering-0',
  'sprinkle-engineering-0-title',
]

// Decorative — hidden below `sm`.
const CHROME_TESTIDS = [
  'ghost-grid',
  'career-chord',
  'structural-borders',
  'arc-research-echo',
  'arc-engineering-echo',
  'era-zone-research-years',
  'era-zone-engineering-years',
]

const SECONDARY_SPRINKLE_TESTID = 'sprinkle-research-1'

// Gated at `md`, same tier as SECONDARY_SPRINKLE_TESTID.
const SUBTITLE_TESTIDS = [
  'sprinkle-research-0-subtitle',
  'sprinkle-research-1-subtitle',
  'sprinkle-engineering-0-subtitle',
]

type Tier = 'base' | 'sm' | 'md+'

function visibleTestIdsFor(tier: Tier): string[] {
  const visible = [...ALWAYS_VISIBLE]
  if (tier !== 'base') visible.push(...CHROME_TESTIDS)
  if (tier === 'md+') visible.push(SECONDARY_SPRINKLE_TESTID, ...SUBTITLE_TESTIDS)
  return visible
}

function hiddenTestIdsFor(tier: Tier): string[] {
  const all = [...CHROME_TESTIDS, SECONDARY_SPRINKLE_TESTID, ...SUBTITLE_TESTIDS]
  const visible = new Set(visibleTestIdsFor(tier))
  return all.filter((id) => !visible.has(id))
}

function assertWithinViewport(selector: string) {
  cy.get(selector)
    .filter(':visible')
    .each(($el) => {
      cy.window().then((win) => {
        const rect = ($el[0] as Element).getBoundingClientRect()
        expect(rect.left, `${selector} left edge`).to.be.at.least(-0.5)
        expect(rect.top, `${selector} top edge`).to.be.at.least(-0.5)
        expect(rect.right, `${selector} right edge`).to.be.at.most(win.innerWidth + 0.5)
        expect(rect.bottom, `${selector} bottom edge`).to.be.at.most(win.innerHeight + 0.5)
      })
    })
}

type ViewportCase = {
  label: string
  width: number
  height: number
  tier: Tier
}

const VIEWPORTS: ViewportCase[] = [
  { label: 'base — small phone', width: 390, height: 844, tier: 'base' },
  { label: 'sm — 640px floor', width: 640, height: 800, tier: 'sm' },
  { label: 'md — 768px floor', width: 768, height: 1024, tier: 'md+' },
  { label: 'lg — 1024px floor', width: 1024, height: 768, tier: 'md+' },
  { label: 'xl — 1280px floor', width: 1280, height: 800, tier: 'md+' },
  {
    label: 'viewBox-aspect 1440×900 (reported screenshot size)',
    width: 1440,
    height: 900,
    tier: 'md+',
  },
  { label: '2xl — 1536px floor', width: 1536, height: 864, tier: 'md+' },
  { label: 'ultra — 1920×1080 (reported screenshot size)', width: 1920, height: 1080, tier: 'md+' },
  { label: 'ultra — 2560×1440', width: 2560, height: 1440, tier: 'md+' },
  { label: 'ultra — 3440×1440 (ultrawide)', width: 3440, height: 1440, tier: 'md+' },
]

// Source of truth for the density table across Tailwind breakpoints + the
// custom `ultra` (≥1920) tier. Density is CSS display toggling, not DOM
// removal, so "not part of this tier" asserts `not.be.visible`, not
// `not.exist`. Doesn't cover IdentityBlock overlap (CareerArc mounts alone
// here) — see cypress/e2e/homepage.cy.ts for that.
describe('CareerArc responsive density', () => {
  VIEWPORTS.forEach(({ label, width, height, tier }) => {
    describe(`${label} (${width}×${height})`, () => {
      beforeEach(() => {
        cy.viewport(width, height)
        cy.mountAccessible(<CareerArc {...PROPS} />)
      })

      it("shows the elements this tier's density table expects", () => {
        visibleTestIdsFor(tier).forEach((testId) => {
          cy.get(`[data-testid='${testId}']`).should('be.visible')
        })
      })

      it("hides the elements this tier's density table drops", () => {
        hiddenTestIdsFor(tier).forEach((testId) => {
          cy.get(`[data-testid='${testId}']`).should('not.be.visible')
        })
      })

      it('keeps every visible element fully inside the viewport (Fix A regression guard)', () => {
        assertWithinViewport('svg')
        visibleTestIdsFor(tier).forEach((testId) => {
          assertWithinViewport(`[data-testid='${testId}']`)
        })
      })
    })
  })

  it('has no axe accessibility violations at the base tier', () => {
    cy.viewport(390, 844)
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.checkA11y()
  })

  it('has no axe accessibility violations at the ultra tier', () => {
    cy.viewport(1920, 1080)
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.checkA11y()
  })
})
