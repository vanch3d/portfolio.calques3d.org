import type { CaseStudyListItem } from '@/lib/content/case-study-groups'
import { CaseStudyEntry } from './CaseStudyEntry'

const BASE: CaseStudyListItem = {
  caseStudy: {
    slug: 'calques3d',
    project: 'calques3d',
    title: 'Calques 3D: letting teachers decide how students see a cube',
    status: 'draft',
    featured: false,
    tags: [],
  },
  projectName: 'Calques 3D',
  chapterCount: 0,
  href: '/case-studies/calques3d/calques3d',
  number: 3,
}

function mountEntry(item: CaseStudyListItem) {
  cy.mountAccessible(
    <ol>
      <CaseStudyEntry item={item} />
    </ol>
  )
}

describe('CaseStudyEntry', () => {
  it('renders the number, the title as the only link, and the project name', () => {
    mountEntry(BASE)
    cy.findByTestId('case-study-entry').within(() => {
      cy.contains('3')
      cy.get('a').should('have.length', 1).and('have.attr', 'href', BASE.href)
      cy.contains('Calques 3D: letting teachers decide how students see a cube')
      cy.contains('Calques 3D')
    })
  })

  it('shows the draft mark for a draft case and not for a published one', () => {
    mountEntry(BASE)
    cy.contains('Draft')
    mountEntry({ ...BASE, caseStudy: { ...BASE.caseStudy, status: 'published' } })
    cy.contains('Draft').should('not.exist')
  })

  it('shows the chapter count only for a chaptered case', () => {
    mountEntry({ ...BASE, chapterCount: 6 })
    cy.contains('6 chapters')
    mountEntry(BASE)
    cy.contains('chapters').should('not.exist')
  })

  it('shows the summary when the frontmatter has one', () => {
    mountEntry({ ...BASE, caseStudy: { ...BASE.caseStudy, summary: 'A short teaser.' } })
    cy.contains('A short teaser.')
  })

  it('wraps a very long title without breaking the row', () => {
    mountEntry({ ...BASE, caseStudy: { ...BASE.caseStudy, title: 'Long '.repeat(60) } })
    cy.findByTestId('case-study-entry').should(($el) => {
      expect($el[0].scrollWidth).to.be.at.most($el[0].clientWidth + 1)
    })
  })

  it('uses no red', () => {
    mountEntry(BASE)
    cy.get('.active-mark, .text-active, .bg-active').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    mountEntry({ ...BASE, chapterCount: 6, caseStudy: { ...BASE.caseStudy, summary: 'Teaser.' } })
    cy.checkA11y()
  })
})
