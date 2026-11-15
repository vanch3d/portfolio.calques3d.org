import { FigureLightbox } from './FigureLightbox'

const SRC =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"></svg>'

function Fixture() {
  return (
    <FigureLightbox
      no={2}
      src={SRC}
      alt="A wireframe"
      width={400}
      height={300}
      caption="The wireframe"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={SRC} alt="A wireframe" width={400} height={300} />
    </FigureLightbox>
  )
}

describe('FigureLightbox', () => {
  it('shows only the inline image until opened', () => {
    cy.mountAccessible(<Fixture />)
    cy.findByTestId('case-plate-expand').should('have.attr', 'aria-label', 'Enlarge figure 2')
    cy.findByTestId('case-plate-lightbox').should('not.exist')
  })

  it('opens the image with its number and caption, and closes with Esc', () => {
    cy.mountAccessible(<Fixture />)
    cy.findByTestId('case-plate-expand').click()
    cy.findByTestId('case-plate-lightbox').within(() => {
      cy.get('img').should('have.attr', 'alt', 'A wireframe')
      cy.contains('Fig. 2')
      cy.contains('The wireframe')
    })
    cy.press('Escape')
    cy.findByTestId('case-plate-lightbox').should('not.exist')
    cy.findByTestId('case-plate-expand').should('have.focus')
  })

  it('closes with the close control and returns focus to the trigger', () => {
    cy.mountAccessible(<Fixture />)
    cy.findByTestId('case-plate-expand').click()
    cy.findByRole('button', { name: 'Close' }).click()
    cy.findByTestId('case-plate-lightbox').should('not.exist')
    cy.findByTestId('case-plate-expand').should('have.focus')
  })

  it('never shows the image above its natural size', () => {
    cy.viewport(1600, 1000)
    cy.mountAccessible(<Fixture />)
    cy.findByTestId('case-plate-expand').click()
    cy.findByTestId('case-plate-lightbox')
      .find('img')
      .should(($img) => {
        expect($img.width()).to.be.at.most(400)
        expect($img.height()).to.be.at.most(300)
      })
  })

  it('has no axe accessibility violations (closed)', () => {
    cy.mountAccessible(<Fixture />)
    cy.checkA11y()
  })

  it('has no axe accessibility violations (open)', () => {
    cy.mountAccessible(<Fixture />)
    cy.findByTestId('case-plate-expand').click()
    cy.findByTestId('case-plate-lightbox').should('be.visible')
    cy.checkA11y()
  })
})
