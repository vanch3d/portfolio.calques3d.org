import type { CaseStudyChapter } from '@/types/content'
import { ChapterRail } from './ChapterRail'

const CHAPTERS: CaseStudyChapter[] = [
  { file: 'a', slug: 'one', title: 'The Problem Class' },
  { file: 'b', slug: 'two', title: 'The Bet That Worked' },
  { file: 'c', slug: 'three', title: 'The Same Bet, a Harder Domain' },
  { file: 'd', slug: 'four', title: 'When It Is Not Even a Graph' },
  { file: 'e', slug: 'five', title: 'How I Actually Build' },
  { file: 'f', slug: 'six', title: 'Where the Practice Is Now' },
]

function mountRail(currentSlug = 'three', hasClosing = true) {
  cy.mountAccessible(
    <ChapterRail
      project="hivemq-edge"
      slug="design-retro"
      chapters={CHAPTERS}
      currentSlug={currentSlug}
      hasClosing={hasClosing}
    />
  )
}

describe('ChapterRail', () => {
  it('renders one node per chapter plus the END node', () => {
    mountRail()
    cy.findByTestId('chapter-rail').find('li').should('have.length', 7)
    cy.get("a[href='/case-studies/hivemq-edge/design-retro#closing']").should('contain.text', 'End')
  })

  it('omits the END node when the case has no closing', () => {
    mountRail('three', false)
    cy.findByTestId('chapter-rail').find('li').should('have.length', 6)
  })

  it('labels the current chapter and marks exactly one node as current', () => {
    mountRail()
    cy.contains('Chapter 3 of 6')
    cy.contains('The Same Bet, a Harder Domain')
    cy.findByTestId('chapter-rail').find("[aria-current='page']").should('have.length', 1)
    cy.get("[aria-current='page']").should(
      'have.attr',
      'aria-label',
      'Chapter 3: The Same Bet, a Harder Domain (current)'
    )
  })

  it('links every node to its chapter route', () => {
    mountRail()
    cy.get("a[href='/case-studies/hivemq-edge/design-retro/problem-class']").should('not.exist')
    cy.get("a[href='/case-studies/hivemq-edge/design-retro/one']").should('exist')
    cy.get("a[href='/case-studies/hivemq-edge/design-retro/six']").should('exist')
  })

  it('makes the current tick the only red on the rail', () => {
    mountRail()
    cy.findByTestId('chapter-rail').find('.after\\:bg-active').should('have.length', 1)
    cy.get("[aria-current='page']").should('have.class', 'after:bg-active')
  })

  it('is sticky', () => {
    mountRail()
    cy.findByTestId('chapter-rail').should('have.css', 'position', 'sticky')
  })

  it('has no axe accessibility violations', () => {
    mountRail()
    cy.checkA11y()
  })

  it('has no axe accessibility violations on the last chapter', () => {
    mountRail('six')
    cy.checkA11y()
  })
})
