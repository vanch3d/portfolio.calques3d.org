import { CaseTitleBlock } from './CaseTitleBlock'

describe('CaseTitleBlock', () => {
  it('renders the title as the only h1 at headline scale, with the case eyebrow', () => {
    cy.mountAccessible(<CaseTitleBlock title="Calques 3D: a cube" status="published" />)
    cy.get('[data-testid="case-title-block"] h1')
      .should('have.length', 1)
      .and('contain.text', 'Calques 3D: a cube')
      .and('have.class', 'text-headline')
    cy.contains('Case study')
  })

  it('shows the draft mark and the chapter count on a hub', () => {
    cy.mountAccessible(<CaseTitleBlock title="Hub" status="draft" chapterCount={6} />)
    cy.contains('Draft')
    cy.contains('6 chapters')
  })

  it('shows no reading time', () => {
    cy.mountAccessible(<CaseTitleBlock title="Hub" status="draft" chapterCount={6} />)
    cy.contains(/reading time|min read/i).should('not.exist')
  })

  it('renders the lead and the tags', () => {
    cy.mountAccessible(
      <CaseTitleBlock
        title="T"
        status="draft"
        lead={<p>The lead.</p>}
        tags={['Prototyping', 'Interaction design']}
      />
    )
    cy.contains('The lead.')
    cy.get('ul[aria-label="Tags"] li').should('have.length', 2)
  })

  it('renders each tag, and the draft mark, with the shared Tag frame', () => {
    cy.mountAccessible(
      <CaseTitleBlock title="T" status="draft" tags={['Prototyping', 'Interaction design']} />
    )
    cy.get('ul[aria-label="Tags"] li span.border-ghost').should('have.length', 2)
    cy.findByTestId('case-status-mark').should('have.class', 'border-ghost')
  })

  it('chapter variant drops the eyebrow and shows the plain chapter label when given', () => {
    cy.mountAccessible(
      <CaseTitleBlock
        title="T"
        status="draft"
        variant="chapter"
        chapterPosition={{ number: 3, total: 6 }}
      />
    )
    cy.contains('Chapter 3 of 6')
    cy.contains('Case study').should('not.exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <CaseTitleBlock title="T" status="draft" lead={<p>Lead</p>} tags={['A']} chapterCount={2} />
      </div>
    )
    cy.checkA11y()
  })
})
