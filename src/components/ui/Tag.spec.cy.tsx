import { Tag } from './Tag'

describe('Tag', () => {
  it('renders its content as a passive span, not a link or button', () => {
    cy.mountAccessible(<Tag data-testid="tag">Case studies</Tag>)
    cy.findByTestId('tag').should('contain.text', 'Case studies').and('match', 'span')
    cy.get('a, button').should('not.exist')
  })

  it('is framed with the ghost line weight', () => {
    cy.mountAccessible(<Tag data-testid="tag">Tag</Tag>)
    cy.findByTestId('tag').should('have.class', 'border-ghost')
  })

  it('merges a caller className without dropping the base classes', () => {
    cy.mountAccessible(
      <Tag data-testid="tag" className="ml-md">
        Tag
      </Tag>
    )
    cy.findByTestId('tag').should('have.class', 'ml-md').and('have.class', 'border-ghost')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <Tag>Case studies</Tag>
      </div>
    )
    cy.checkA11y()
  })
})
