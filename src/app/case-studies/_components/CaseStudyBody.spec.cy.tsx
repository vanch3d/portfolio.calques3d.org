import type { ComponentType, ElementType, ReactElement } from 'react'
import type { MDXComponents } from 'mdx/types'
import type { CaseStudyImageMap } from '@/lib/content/case-study-images'
import { CaseStudyBody } from './CaseStudyBody'

type Components = Record<string, ElementType>

function makeDoc(
  nodes: (C: Components) => ReactElement
): ComponentType<{ components?: MDXComponents }> {
  return function Doc({ components }) {
    const C = (components ?? {}) as unknown as Components
    // Mirrors compiled MDX: the wrapper's child returns one fragment whose
    // children are the document nodes (see unwrapMdxChildren).
    function Content() {
      return nodes(C)
    }
    const Wrapper = C.wrapper
    return (
      <Wrapper>
        <Content />
      </Wrapper>
    )
  }
}

const SRC =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="60"></svg>'
const IMAGES: CaseStudyImageMap = { 'images/1-a.png': { src: SRC, width: 80, height: 60 } }

const FLAT = makeDoc((C) => (
  <>
    <C.h1>Authoring title</C.h1>
    <C.p>The lead paragraph.</C.p>
    <C.h2>First section</C.h2>
    <C.p>Body with a figure.</C.p>
    <C.p>
      <C.img src="images/1-a.png" alt="A figure" title="Caption one" />
    </C.p>
    <C.h2>Second section</C.h2>
    <C.p>Plain body.</C.p>
    <C.blockquote>
      <C.p>&quot;A quoted passage.&quot;</C.p>
    </C.blockquote>
  </>
))

const CHAPTER = makeDoc((C) => (
  <>
    <C.h1>Chapter title</C.h1>
    <C.p>Opening.</C.p>
    <C.h3>The problem</C.h3>
    <C.p>Text.</C.p>
    <C.blockquote>
      <C.p>{'[!NOTE]\nSecret authoring instruction about a screenshot.'}</C.p>
    </C.blockquote>
    <C.h3>What it grew into</C.h3>
    <C.blockquote>
      <C.p>{'[!TODO]\nThe comparison goes here.'}</C.p>
    </C.blockquote>
  </>
))

describe('CaseStudyBody — flat case', () => {
  beforeEach(() => {
    cy.viewport(1280, 900)
  })

  it('drops the authoring h1 and hands the lead to the title block', () => {
    cy.mountAccessible(
      <CaseStudyBody
        Content={FLAT}
        images={IMAGES}
        lead
        renderTitleBlock={(lead) => (
          <header data-testid="tb">
            <h1>Frontmatter title</h1>
            {lead}
          </header>
        )}
      />
    )
    cy.get('[data-testid="tb"] h1')
      .should('have.length', 1)
      .and('contain.text', 'Frontmatter title')
    cy.contains('Authoring title').should('not.exist')
    cy.findByTestId('tb').should('contain.text', 'The lead paragraph.')
    cy.findByTestId('case-body').should('not.contain.text', 'The lead paragraph.')
  })

  it('numbers sections 1 and 2', () => {
    cy.mountAccessible(<CaseStudyBody Content={FLAT} images={IMAGES} lead />)
    cy.get('[data-testid="case-body"] h2')
      .eq(0)
      .should('contain.text', '1')
      .and('contain.text', 'First section')
    cy.get('[data-testid="case-body"] h2')
      .eq(1)
      .should('contain.text', '2')
      .and('contain.text', 'Second section')
  })

  it('groups a paragraph with its trailing figure into one beat', () => {
    cy.mountAccessible(<CaseStudyBody Content={FLAT} images={IMAGES} lead />)
    cy.findAllByTestId('case-beat')
      .first()
      .within(() => {
        cy.contains('Body with a figure.')
        cy.findByTestId('case-plate')
          .should('contain.text', 'Fig. 1')
          .and('contain.text', 'Caption one')
      })
  })

  it('renders blockquotes roman with a single ghost rule', () => {
    cy.mountAccessible(<CaseStudyBody Content={FLAT} images={IMAGES} lead />)
    cy.get('blockquote')
      .should('have.css', 'font-style', 'normal')
      .and('have.class', 'border-l-medium')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <h1>Title</h1>
        <CaseStudyBody Content={FLAT} images={IMAGES} lead />
      </div>
    )
    cy.checkA11y()
  })
})

describe('CaseStudyBody — chapter', () => {
  it('demotes ### to h2 with chapter-scoped numbers', () => {
    cy.mountAccessible(<CaseStudyBody Content={CHAPTER} chapterNo={3} />)
    cy.get('h3').should('not.exist')
    cy.get('[data-testid="case-body"] h2')
      .eq(0)
      .should('contain.text', '3.1')
      .and('contain.text', 'The problem')
    cy.get('[data-testid="case-body"] h2')
      .eq(1)
      .should('contain.text', '3.2')
      .and('contain.text', 'What it grew into')
  })

  it('renders [!NOTE] as a pending plate and never shows its body', () => {
    cy.mountAccessible(<CaseStudyBody Content={CHAPTER} chapterNo={3} />)
    cy.findByTestId('case-plate-pending').should('exist')
    cy.contains('Secret authoring instruction').should('not.exist')
    cy.get('blockquote').should('not.exist')
  })

  it('renders [!TODO] as a work-in-progress block with its text', () => {
    cy.mountAccessible(<CaseStudyBody Content={CHAPTER} chapterNo={3} />)
    cy.findByTestId('case-wip').should('contain.text', 'The comparison goes here.')
  })

  it('attaches an aside to the first beat', () => {
    cy.mountAccessible(
      <CaseStudyBody Content={CHAPTER} chapterNo={3} aside={<div data-testid="guide">Guide</div>} />
    )
    cy.findAllByTestId('case-beat').first().findByTestId('guide').should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <h1>Title</h1>
        <CaseStudyBody Content={CHAPTER} chapterNo={3} />
      </div>
    )
    cy.checkA11y()
  })
})
