import { ReadingGuide } from './ReadingGuide'

describe('ReadingGuide', () => {
  it('labels the supplied text as a reading guide', () => {
    cy.mountAccessible(<ReadingGuide>Six sections, roughly twenty-five minutes.</ReadingGuide>)
    cy.findByTestId('aside')
      .should('contain.text', 'Reading guide')
      .and('contain.text', 'Six sections, roughly twenty-five minutes.')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <ReadingGuide>Text.</ReadingGuide>
      </div>
    )
    cy.checkA11y()
  })
})
