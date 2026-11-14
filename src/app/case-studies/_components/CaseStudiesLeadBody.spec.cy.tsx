import type { ComponentType, ElementType } from 'react'
import type { MDXComponents } from 'mdx/types'
import { CaseStudiesLeadBody } from './CaseStudiesLeadBody'

type Components = Record<string, ElementType>

const Intro: ComponentType<{ components?: MDXComponents }> = ({ components }) => {
  const C = (components ?? {}) as unknown as Components
  return (
    <>
      <C.h1>Collection intro (authoring heading)</C.h1>
      <C.h2>Design by building</C.h2>
      <p>I design and build the interface as one practice.</p>
    </>
  )
}

describe('CaseStudiesLeadBody', () => {
  it('drops the authoring h1 and renders the h2 as the page title', () => {
    cy.mountAccessible(<CaseStudiesLeadBody Content={Intro} />)
    cy.contains('authoring heading').should('not.exist')
    cy.contains('h1', 'Design by building').should('have.length', 1)
    cy.contains('h2', 'Design by building').should('not.exist')
  })

  it('renders the lead paragraphs after the title', () => {
    cy.mountAccessible(<CaseStudiesLeadBody Content={Intro} />)
    cy.contains('I design and build the interface')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <CaseStudiesLeadBody Content={Intro} />
      </div>
    )
    cy.checkA11y()
  })
})
