/**
 * NavLink — Cypress CT spec
 *
 * Tests the inline navigation link atom in isolation.
 * NavLink encodes the full nav-link style contract: label class, persistent
 * ghost underline, hover darkening, transition. This spec verifies the class
 * composition and a11y — it does NOT test hover visual appearance (that is a
 * visual regression concern, not a unit test concern).
 *
 * Coverage:
 *   - Renders an <a> element with the correct href
 *   - Applies the label utility class
 *   - Applies the nav-link utility class (provides the always-on underline)
 *   - Applies text-ink-secondary as the default colour class
 *   - Applies hover:text-ink and transition-colors
 *   - Renders children as link text
 *   - Merges additional className on the anchor
 *   - Multiple NavLinks in a breadcrumb row render without layout issues
 *   - Multiple NavLinks in a section nav row render without layout issues
 *   - a11y: single link
 *   - a11y: breadcrumb row with aria-label
 *   - a11y: section nav row with aria-label
 */

import { NavLink } from './NavLink'

describe('NavLink', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders an anchor element', () => {
    cy.mountAccessible(<NavLink href="/lab">Lab</NavLink>)
    cy.get('a').should('exist')
  })

  it('forwards the href to the anchor', () => {
    cy.mountAccessible(<NavLink href="/lab/design-system">Design System</NavLink>)
    cy.get('a').should('have.attr', 'href', '/lab/design-system')
  })

  it('renders children as the link text', () => {
    cy.mountAccessible(<NavLink href="/lab">Lab</NavLink>)
    cy.get('a').should('contain.text', 'Lab')
  })

  // ── Class composition ──────────────────────────────────────────────────────

  it('applies the label utility class', () => {
    cy.mountAccessible(<NavLink href="/lab">Lab</NavLink>)
    cy.get('a').should('have.class', 'label')
  })

  it('applies the nav-link utility class', () => {
    cy.mountAccessible(<NavLink href="/lab">Lab</NavLink>)
    cy.get('a').should('have.class', 'nav-link')
  })

  it('applies text-ink-secondary as the default colour class', () => {
    cy.mountAccessible(<NavLink href="/lab">Lab</NavLink>)
    cy.get('a').should('have.class', 'text-ink-secondary')
  })

  it('applies hover:text-ink', () => {
    cy.mountAccessible(<NavLink href="/lab">Lab</NavLink>)
    cy.get('a').should('have.class', 'hover:text-ink')
  })

  it('applies transition-colors', () => {
    cy.mountAccessible(<NavLink href="/lab">Lab</NavLink>)
    cy.get('a').should('have.class', 'transition-colors')
  })

  // ── className merging ──────────────────────────────────────────────────────

  it('merges additional className on the anchor', () => {
    cy.mountAccessible(
      <NavLink href="/lab" className="ml-auto">
        Lab
      </NavLink>
    )
    cy.get('a').should('have.class', 'ml-auto')
  })

  it('preserves base classes when additional className is provided', () => {
    cy.mountAccessible(
      <NavLink href="/lab" className="ml-auto">
        Lab
      </NavLink>
    )
    cy.get('a').should('have.class', 'label').and('have.class', 'nav-link')
  })

  // ── Composition patterns ───────────────────────────────────────────────────

  it('renders a breadcrumb row without layout issues', () => {
    cy.mountAccessible(
      <nav aria-label="Breadcrumb" className="flex items-baseline gap-lg">
        <NavLink href="/">Nicolas Van Labeke</NavLink>
        <span className="label text-ink-ghost" aria-hidden="true">
          /
        </span>
        <NavLink href="/lab">Lab</NavLink>
        <span className="label text-ink-ghost" aria-hidden="true">
          /
        </span>
        <span className="label active-mark" aria-current="page">
          Design System
        </span>
      </nav>
    )
    cy.get('a').should('have.length', 2)
    cy.get("[aria-current='page']").should('contain.text', 'Design System')
  })

  it('renders a section nav row without layout issues', () => {
    cy.mountAccessible(
      <nav aria-label="Design system sections" className="flex items-baseline gap-lg">
        <NavLink href="/lab/design-system/colors">Colors</NavLink>
        <NavLink href="/lab/design-system/typography">Typography</NavLink>
      </nav>
    )
    cy.get('a').should('have.length', 2)
    cy.contains('Colors').should('be.visible')
    cy.contains('Typography').should('be.visible')
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('has no axe accessibility violations (single link)', () => {
    cy.mountAccessible(<NavLink href="/lab">Lab</NavLink>)
    cy.checkA11y()
  })

  it('has no axe accessibility violations (breadcrumb row)', () => {
    cy.mountAccessible(
      <nav aria-label="Breadcrumb" className="flex items-baseline gap-lg">
        <NavLink href="/">Nicolas Van Labeke</NavLink>
        <span className="label text-ink-ghost" aria-hidden="true">
          /
        </span>
        <NavLink href="/lab">Lab</NavLink>
        <span className="label text-ink-ghost" aria-hidden="true">
          /
        </span>
        <span className="label active-mark" aria-current="page">
          Design System
        </span>
      </nav>
    )
    cy.checkA11y()
  })

  it('has no axe accessibility violations (section nav row)', () => {
    cy.mountAccessible(
      <nav aria-label="Design system sections" className="flex items-baseline gap-lg">
        <NavLink href="/lab/design-system/colors">Colors</NavLink>
        <NavLink href="/lab/design-system/typography">Typography</NavLink>
      </nav>
    )
    cy.checkA11y()
  })
})
