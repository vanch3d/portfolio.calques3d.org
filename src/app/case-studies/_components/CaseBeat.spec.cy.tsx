import type { Plate } from '@/lib/case-study-blocks'
import { CaseBeat } from './CaseBeat'

const PLATES: Plate[] = [
  { kind: 'pending', no: 1 },
  { kind: 'pending', no: 2 },
]

describe('CaseBeat', () => {
  it('renders a lone paragraph without a margin column', () => {
    cy.mountAccessible(
      <CaseBeat plates={[]} images={{}}>
        Just text.
      </CaseBeat>
    )
    cy.findByTestId('case-beat').should('contain.text', 'Just text.')
    cy.findByTestId('case-beat-margin').should('not.exist')
  })

  it('stacks the plates after the paragraph below lg', () => {
    cy.viewport(600, 800)
    cy.mountAccessible(
      <CaseBeat plates={PLATES} images={{}}>
        Text.
      </CaseBeat>
    )
    cy.findByTestId('case-beat-margin').find('figure').should('have.length', 2)
    cy.get('p').then(($p) => {
      cy.findByTestId('case-beat-margin').then(($m) => {
        expect($m[0].getBoundingClientRect().top).to.be.at.least(
          $p[0].getBoundingClientRect().bottom - 1
        )
      })
    })
  })

  it('opens the plates into a margin column beside the paragraph, top-aligned, on lg', () => {
    cy.viewport(1280, 900)
    cy.mountAccessible(
      <CaseBeat plates={PLATES} images={{}}>
        Text.
      </CaseBeat>
    )
    cy.get('p').then(($p) => {
      cy.findByTestId('case-beat-margin').then(($m) => {
        const p = $p[0].getBoundingClientRect()
        const m = $m[0].getBoundingClientRect()
        expect(m.left).to.be.greaterThan(p.right - 1)
        expect(Math.abs(m.top - p.top)).to.be.lessThan(2)
      })
    })
  })

  it('renders an aside in the margin column', () => {
    cy.mountAccessible(
      <CaseBeat plates={[]} images={{}} aside={<div data-testid="note">Note</div>}>
        Text.
      </CaseBeat>
    )
    cy.findByTestId('case-beat-margin').findByTestId('note').should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <CaseBeat plates={PLATES} images={{}}>
        Text.
      </CaseBeat>
    )
    cy.checkA11y()
  })
})
