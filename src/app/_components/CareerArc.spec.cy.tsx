import { CareerArc } from './CareerArc'
import { RESEARCH_ARC, ENGINEERING_ARC, yearToArcPoint } from '../_utils/arc-geometry'

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

// Breakpoint density is covered separately in CareerArc.responsive.spec.cy.tsx.
describe('CareerArc', () => {
  it('renders an SVG element', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('svg').should('exist')
  })

  it('stretches to fill its frame exactly — preserveAspectRatio is "none" (no crop, no letterbox)', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('svg').should('have.attr', 'preserveAspectRatio', 'none')
  })

  it('SVG is aria-hidden', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('svg').should('have.attr', 'aria-hidden', 'true')
  })

  it('HTML label overlay is aria-hidden', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='career-arc-labels']").should('have.attr', 'aria-hidden', 'true')
  })

  it('SVG has focusable=false', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('svg').should('have.attr', 'focusable', 'false')
  })

  it('renders at least two arc paths (research + engineering primaries)', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get('path').should('have.length.at.least', 2)
  })

  it('renders the research arc with correct d attribute', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='arc-research-path']").should('exist')
  })

  it('renders the engineering arc with correct d attribute', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='arc-engineering-path']").should('exist')
  })

  it('renders the timeline start year', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='timeline-legend-start']").should('contain.text', '1995')
  })

  it('renders the timeline end year', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='timeline-legend-end']").should('contain.text', '2026')
  })

  it('renders the transition year (2018) in active colour', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='timeline-legend-transition']")
      .should('contain.text', '2018')
      .and('have.class', 'text-active')
  })

  it('renders the arc span label', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='timeline-legend-arc-label']").should('contain.text', 'CAREER ARC')
  })

  it('ONE RED RULE: inflection circle exists with active stroke', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='inflection-circle']").should('exist')
  })

  it('inflection circle has active border colour', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='inflection-circle']").should('have.class', 'border-active')
  })

  it('inflection circle has ground fill (ring not filled disc)', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='inflection-circle']").should('have.class', 'bg-ground')
  })

  it('inflection circle is a true circle (equal width/height), not distorted by the non-uniform SVG stretch', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='inflection-circle']").then(($el) => {
      const rect = $el[0].getBoundingClientRect()
      expect(rect.width).to.be.closeTo(rect.height, 0.5)
    })
  })

  it('renders project sprinkle dots', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='arc-research']").find('circle').first().should('exist')
    cy.get("[data-testid='arc-research']").find('circle').eq(1).should('exist')
    cy.get("[data-testid='arc-engineering']").find('circle').first().should('exist')
  })

  it('positions the SAFeSEA sprinkle (slot 1, idealYear 2013) at the mathematically correct arc point', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    const expected = yearToArcPoint(2013, RESEARCH_ARC)
    cy.get("[data-testid='sprinkle-research-1']")
      .find('circle')
      .should('have.attr', 'cx')
      .then((cx) => {
        expect(Number(cx)).to.be.closeTo(expected.x, 1)
      })
    cy.get("[data-testid='sprinkle-research-1']")
      .find('circle')
      .should('have.attr', 'cy')
      .then((cy_) => {
        expect(Number(cy_)).to.be.closeTo(expected.y, 1)
      })
  })

  it('positions the HiveMQ Edge sprinkle (idealYear 2023) at the mathematically correct arc point', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    const expected = yearToArcPoint(2023, ENGINEERING_ARC)
    cy.get("[data-testid='sprinkle-engineering-0']")
      .find('circle')
      .should('have.attr', 'cx')
      .then((cx) => {
        expect(Number(cx)).to.be.closeTo(expected.x, 1)
      })
  })

  it('renders ERA I zone label', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='era-zone-research']").contains('ERA I').should('exist')
  })

  it('renders ERA II zone label', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.get("[data-testid='era-zone-engineering']").contains('ERA II').should('exist')
  })

  it('null sprinkle slots render no circles in that arc group', () => {
    cy.mountAccessible(
      <CareerArc {...PROPS} researchSprinkles={[null, null]} engineeringSprinkles={[null]} />
    )
    cy.get("[data-testid='arc-research']").find('circle').should('not.exist')
    cy.get("[data-testid='arc-engineering']").find('circle').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<CareerArc {...PROPS} />)
    cy.checkA11y()
  })
})
