/**
 * SkipNav — Cypress CT spec
 *
 * Coverage:
 * - Renders a "Skip to content" link to #main-content by default
 * - Accepts a custom href and label
 * - Activating it moves focus to the target and makes a non-focusable target
 *   temporarily focusable (tabindex removed again on blur)
 * - Leaves the hash/URL alone and tolerates a missing target
 * - axe-clean
 *
 * The scaffold already provides <main>, so the target here is a plain <div>.
 */

import { SkipNav } from './SkipNav'

describe('SkipNav', () => {
  it('renders a link to #main-content labelled from the SkipNav namespace', () => {
    cy.mountAccessible(
      <div>
        <SkipNav />
        <div id="main-content">Content</div>
      </div>
    )
    cy.get("[data-slot='skip-nav']")
      .should('have.attr', 'href', '#main-content')
      .and('have.text', 'Skip to content')
  })

  it('accepts a custom href and label', () => {
    cy.mountAccessible(
      <div>
        <SkipNav href="#footer-region">Skip to footer</SkipNav>
        <div id="footer-region">Footer</div>
      </div>
    )
    cy.get("[data-slot='skip-nav']")
      .should('have.attr', 'href', '#footer-region')
      .and('have.text', 'Skip to footer')
  })

  it('moves focus to the target on activation, then restores the target on blur', () => {
    cy.mountAccessible(
      <div>
        <SkipNav />
        <div id="main-content">Content</div>
        <button type="button">After</button>
      </div>
    )
    cy.get("[data-slot='skip-nav']").click({ force: true })
    cy.get('#main-content').should('have.focus').and('have.attr', 'tabindex', '-1')

    cy.get('button').focus()
    cy.get('#main-content').should('not.have.attr', 'tabindex')
  })

  it('does not rewrite the URL hash', () => {
    cy.mountAccessible(
      <div>
        <SkipNav />
        <div id="main-content">Content</div>
      </div>
    )
    cy.location('hash').then((before) => {
      cy.get("[data-slot='skip-nav']").click({ force: true })
      cy.location('hash').should('eq', before)
    })
  })

  it('does not throw when the target is missing', () => {
    cy.mountAccessible(
      <div>
        <SkipNav href="#nowhere" />
      </div>
    )
    cy.get("[data-slot='skip-nav']").click({ force: true })
    cy.get("[data-slot='skip-nav']").should('exist')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <div>
        <SkipNav />
        <div id="main-content">Content</div>
      </div>
    )
    cy.checkA11y()
  })
})
