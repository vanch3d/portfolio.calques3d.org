import type { CaseStudyGroup as CaseStudyGroupModel } from '@/lib/content/case-study-groups'
import { CaseStudyGroup } from './CaseStudyGroup'

function item(slug: string, number: number) {
  return {
    caseStudy: {
      slug,
      project: slug,
      title: `Case ${slug}`,
      status: 'draft' as const,
      featured: false,
      tags: [],
    },
    projectName: `Project ${slug}`,
    chapterCount: 0,
    href: `/case-studies/${slug}/${slug}`,
    number,
  }
}

const RESEARCH: CaseStudyGroupModel = {
  era: 'research',
  items: [item('a', 2), item('b', 3)],
}
const ENGINEERING: CaseStudyGroupModel = { era: 'engineering', items: [item('e', 1)] }

describe('CaseStudyGroup', () => {
  it('renders a labelled rule with the era name and the case count', () => {
    cy.mountAccessible(<CaseStudyGroup group={RESEARCH} />)
    cy.get('h2#era-research').should('contain.text', 'Research')
    cy.findByTestId('case-study-group').should('contain.text', '2')
  })

  it('carries the anchor id the home era link targets', () => {
    cy.mountAccessible(<CaseStudyGroup group={ENGINEERING} />)
    cy.get('#era-engineering').should('contain.text', 'Engineering')
  })

  it('keeps the numbering it is given across groups', () => {
    cy.mountAccessible(<CaseStudyGroup group={RESEARCH} />)
    cy.findAllByTestId('case-study-entry').eq(0).should('contain.text', '2')
    cy.findAllByTestId('case-study-entry').eq(1).should('contain.text', '3')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <h1>Design by building</h1>
        <CaseStudyGroup group={ENGINEERING} />
        <CaseStudyGroup group={RESEARCH} />
      </div>
    )
    cy.checkA11y()
  })
})
