import { Badge } from './Badge'
import { Tag } from './Tag'

describe('Badge', () => {
  it('renders its number as a passive span', () => {
    cy.mountAccessible(<Badge data-testid="badge">3</Badge>)
    cy.findByTestId('badge').should('have.text', '3').and('match', 'span')
    cy.get('a, button').should('not.exist')
  })

  it('is a filled chip, not a framed one', () => {
    cy.mountAccessible(<Badge data-testid="badge">3</Badge>)
    cy.findByTestId('badge')
      .should('have.class', 'bg-ink-secondary')
      .and('have.class', 'text-ground')
  })

  it('merges a caller className without dropping the base classes', () => {
    cy.mountAccessible(
      <Badge data-testid="badge" className="ml-md">
        3
      </Badge>
    )
    cy.findByTestId('badge').should('have.class', 'ml-md').and('have.class', 'bg-ink-secondary')
  })

  it('sits on the vertical middle of the Tag that holds it', () => {
    cy.mountAccessible(
      <Tag data-testid="tag">
        Case studies <Badge data-testid="badge">3</Badge>
      </Tag>
    )
    cy.findByTestId('tag').then(($tag) => {
      cy.findByTestId('badge').then(($badge) => {
        const tag = $tag[0].getBoundingClientRect()
        const badge = $badge[0].getBoundingClientRect()
        const tagCentre = tag.top + tag.height / 2
        const badgeCentre = badge.top + badge.height / 2
        expect(Math.abs(tagCentre - badgeCentre)).to.be.lessThan(1)
      })
    })
  })

  it('has no axe accessibility violations inside a Tag', () => {
    cy.mountAccessible(
      <div>
        <Tag>
          Case studies <Badge>3</Badge>
        </Tag>
      </div>
    )
    cy.checkA11y()
  })
})
