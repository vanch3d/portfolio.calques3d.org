import type { CaseStudyChapter } from '@/types/content'
import { ChapterNav } from './ChapterNav'

const PREV: CaseStudyChapter = { file: 'a', slug: 'two', title: 'The Bet That Worked' }
const NEXT: CaseStudyChapter = { file: 'b', slug: 'four', title: 'When It Is Not Even a Graph' }

describe('ChapterNav', () => {
  it('links to the previous and next chapters with their titles', () => {
    cy.mountAccessible(
      <ChapterNav project="hivemq-edge" slug="design-retro" prev={PREV} next={NEXT} />
    )
    cy.get("a[href='/case-studies/hivemq-edge/design-retro/two']").should(
      'contain.text',
      'The Bet That Worked'
    )
    cy.get("a[href='/case-studies/hivemq-edge/design-retro/four']").should(
      'contain.text',
      'When It Is Not Even a Graph'
    )
  })

  it('shows only next on the first chapter', () => {
    cy.mountAccessible(<ChapterNav project="p" slug="s" prev={null} next={NEXT} />)
    cy.get('a').should('have.length', 1).and('contain.text', 'Next')
  })

  it('links the last chapter to the hub Closing when the case has one', () => {
    cy.mountAccessible(
      <ChapterNav project="hivemq-edge" slug="design-retro" prev={PREV} next={null} hasClosing />
    )
    cy.get("a[href='/case-studies/hivemq-edge/design-retro#closing']").should(
      'contain.text',
      'Closing'
    )
  })

  it('has no next link on the last chapter without a closing', () => {
    cy.mountAccessible(<ChapterNav project="p" slug="s" prev={PREV} next={null} />)
    cy.get('a').should('have.length', 1)
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <ChapterNav project="hivemq-edge" slug="design-retro" prev={PREV} next={NEXT} />
    )
    cy.checkA11y()
  })
})
