import type { CaseStudyChapter } from '@/types/content'
import { ChapterList } from './ChapterList'

const CHAPTERS: CaseStudyChapter[] = [
  {
    file: 'a',
    slug: 'problem-class',
    title: 'The Problem Class',
    teaser: 'Why config UI is hard.',
  },
  { file: 'b', slug: 'workspace', title: 'The Bet That Worked' },
]

describe('ChapterList', () => {
  it('renders a numbered row per chapter, each one link to its route', () => {
    cy.mountAccessible(
      <ChapterList project="hivemq-edge" slug="design-retro" chapters={CHAPTERS} />
    )
    cy.findAllByTestId('chapter-list-item').should('have.length', 2)
    cy.get("a[href='/case-studies/hivemq-edge/design-retro/problem-class']").should(
      'contain.text',
      'The Problem Class'
    )
    cy.get("a[href='/case-studies/hivemq-edge/design-retro/workspace']").should('exist')
  })

  it('renders the teaser only when the chapter has one', () => {
    cy.mountAccessible(<ChapterList project="p" slug="s" chapters={CHAPTERS} />)
    cy.contains('Why config UI is hard.')
    cy.findAllByTestId('chapter-list-item').eq(1).find('p').should('not.exist')
  })

  it('stretches each link over its whole row', () => {
    cy.mountAccessible(<ChapterList project="p" slug="s" chapters={CHAPTERS} />)
    cy.findAllByTestId('chapter-list-item').first().should('have.css', 'position', 'relative')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <h1>Hub</h1>
        <ChapterList project="p" slug="s" chapters={CHAPTERS} />
      </div>
    )
    cy.checkA11y()
  })
})
