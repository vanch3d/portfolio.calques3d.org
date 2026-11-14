import { FeaturedCaseStudies } from './FeaturedCaseStudies'
import type { FeaturedItem } from './FeaturedCaseStudies'

const HIVE: FeaturedItem = {
  title: 'HiveMQ Edge: A Design Retrospective',
  projectName: 'HiveMQ Edge',
  chapterCount: 6,
  href: '/case-studies/hivemq-edge/design-retro',
}
const OE: FeaturedItem = {
  title: 'OpenEssayist: showing students what their draft essay says',
  projectName: 'SAFeSEA',
  chapterCount: 0,
  href: '/case-studies/safesea/openessayist',
}
const C3D: FeaturedItem = {
  title: 'Calques 3D: letting teachers decide how students see a cube',
  projectName: 'Calques 3D',
  chapterCount: 0,
  href: '/case-studies/calques3d/calques3d',
}

describe('FeaturedCaseStudies', () => {
  it('renders nothing with no featured case studies', () => {
    cy.mountAccessible(<FeaturedCaseStudies items={[]} />)
    cy.findByTestId('featured-case-studies').should('not.exist')
  })

  it('renders the singular heading and one linked cell for one case', () => {
    cy.mountAccessible(<FeaturedCaseStudies items={[HIVE]} />)
    cy.get('h2').should('contain.text', 'Featured case study')
    cy.findAllByTestId('featured-case-study').should('have.length', 1)
    cy.get(`a[href='${HIVE.href}']`).should('contain.text', HIVE.title)
    cy.contains('6 chapters')
  })

  it('renders the plural heading and every cell for several cases', () => {
    cy.mountAccessible(<FeaturedCaseStudies items={[HIVE, OE, C3D]} />)
    cy.get('h2').should('contain.text', 'Featured case studies')
    cy.findAllByTestId('featured-case-study').should('have.length', 3)
  })

  it('links to the whole collection from the heading rule', () => {
    cy.mountAccessible(<FeaturedCaseStudies items={[HIVE]} />)
    cy.get("a[href='/case-studies']").should('contain.text', 'All case studies')
  })

  it('never shows a draft mark', () => {
    cy.mountAccessible(<FeaturedCaseStudies items={[HIVE]} />)
    cy.contains('Draft').should('not.exist')
  })

  it('uses no red', () => {
    cy.mountAccessible(<FeaturedCaseStudies items={[HIVE, OE]} />)
    cy.get('.active-mark, .text-active, .bg-active').should('not.exist')
  })

  it('has no axe accessibility violations (one)', () => {
    cy.mountAccessible(
      <div>
        <FeaturedCaseStudies items={[HIVE]} />
      </div>
    )
    cy.checkA11y()
  })

  it('has no axe accessibility violations (several)', () => {
    cy.mountAccessible(
      <div>
        <FeaturedCaseStudies items={[HIVE, OE, C3D]} />
      </div>
    )
    cy.checkA11y()
  })
})
