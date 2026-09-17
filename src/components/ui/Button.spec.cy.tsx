/**
 * Button — Cypress CT spec
 *
 * Tests the three-variant action atom in isolation. Button receives all
 * strings as children/props — no translation context needed.
 *
 * Coverage:
 *   - Renders as a native <button> with the given text content
 *   - Defaults to type="button" (never submits an enclosing form by accident)
 *   - Forwards an explicit type
 *   - Defaults to the primary variant
 *   - Primary variant carries the solid ink-fill classes
 *   - Secondary variant carries the border-medium ink-secondary rest classes
 *   - Text-action variant carries the no-border underline classes
 *   - Disabled state sets the native disabled attribute
 *   - Disabled state is not focusable/clickable
 *   - Fires onClick when enabled
 *   - Does not fire onClick when disabled
 *   - Forwards an aria-label
 *   - Merges additional className
 *   - Does not redefine focus-visible locally (relies on the global ring)
 *   - Primary/secondary carry active:live-line-pressed + active:outline-ink
 *     for pressed-state escalation (KNOWN ISSUE, unresolved: this shares
 *     the `outline` property with the global focus-visible ring — see
 *     Button.tsx doc comment; a pseudo-element alternative was tried and
 *     reverted after rendering asymmetrically in the real page layout)
 *   - a11y: primary variant
 *   - a11y: secondary variant
 *   - a11y: text-action variant
 *   - a11y: disabled state
 */

import { Button } from './Button'

describe('Button', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders as a native button with the given text content', () => {
    cy.mountAccessible(<Button>Apply filters</Button>)
    cy.get('button').should('contain.text', 'Apply filters')
  })

  it('defaults to type="button"', () => {
    cy.mountAccessible(<Button>Apply filters</Button>)
    cy.get('button').should('have.attr', 'type', 'button')
  })

  it('forwards an explicit type', () => {
    cy.mountAccessible(<Button type="submit">Save</Button>)
    cy.get('button').should('have.attr', 'type', 'submit')
  })

  // ── Variants ───────────────────────────────────────────────────────────────

  it('defaults to the primary variant', () => {
    cy.mountAccessible(<Button>Apply filters</Button>)
    cy.get('button').should('have.class', 'bg-ink').and('have.class', 'text-ground')
  })

  it('primary variant carries the solid ink-fill rest classes', () => {
    cy.mountAccessible(<Button variant="primary">Apply filters</Button>)
    cy.get('button')
      .should('have.class', 'bg-ink')
      .and('have.class', 'text-ground')
      .and('have.class', 'border-ink')
  })

  it('secondary variant carries the border-medium ink-secondary rest classes', () => {
    cy.mountAccessible(<Button variant="secondary">Cancel</Button>)
    cy.get('button')
      .should('have.class', 'border-ink-secondary')
      .and('have.class', 'text-ink')
      .and('not.have.class', 'bg-ink')
  })

  it('text-action variant carries the no-border underline classes', () => {
    cy.mountAccessible(<Button variant="text-action">Clear all</Button>)
    cy.get('button')
      .should('have.class', 'border-none')
      .and('have.class', 'underline')
      .and('have.class', 'text-ink-secondary')
  })

  // ── Disabled state ─────────────────────────────────────────────────────────

  it('sets the native disabled attribute when disabled', () => {
    cy.mountAccessible(<Button disabled>Apply filters</Button>)
    cy.get('button').should('be.disabled')
  })

  it('does not fire onClick when disabled', () => {
    const onClick = cy.stub().as('onClick')
    cy.mountAccessible(
      <Button disabled onClick={onClick}>
        Apply filters
      </Button>
    )
    cy.get('button').click({ force: true })
    cy.get('@onClick').should('not.have.been.called')
  })

  // ── Interaction ────────────────────────────────────────────────────────────

  it('fires onClick when enabled', () => {
    const onClick = cy.stub().as('onClick')
    cy.mountAccessible(<Button onClick={onClick}>Apply filters</Button>)
    cy.get('button').click()
    cy.get('@onClick').should('have.been.calledOnce')
  })

  // ── Props forwarding ───────────────────────────────────────────────────────

  it('forwards an aria-label', () => {
    cy.mountAccessible(<Button aria-label="Apply the current filters">Apply</Button>)
    cy.get('button').should('have.attr', 'aria-label', 'Apply the current filters')
  })

  it('merges additional className', () => {
    cy.mountAccessible(<Button className="mt-lg">Apply filters</Button>)
    cy.get('button').should('have.class', 'mt-lg')
  })

  // ── Focus-visible — must not be redefined locally ─────────────────────────

  it('does not set a local outline style, relying on the global focus-visible ring', () => {
    cy.mountAccessible(<Button>Apply filters</Button>)
    cy.get('button').should('not.have.class', 'focus-visible:outline-active')
    cy.get('button').should('not.have.attr', 'style')
  })

  // ── Pressed state ──────────────────────────────────────────────────────────
  // Primary/secondary escalate via the live-line-pressed outline utility.
  // KNOWN ISSUE, unresolved (see Button.tsx doc comment): this shares the
  // outline property with the global :focus-visible ring.

  it('primary variant carries the pressed-state outline classes', () => {
    cy.mountAccessible(<Button variant="primary">Apply filters</Button>)
    cy.get('button')
      .should('have.class', 'active:live-line-pressed')
      .and('have.class', 'active:outline-ink')
  })

  it('secondary variant carries the pressed-state outline classes', () => {
    cy.mountAccessible(<Button variant="secondary">Cancel</Button>)
    cy.get('button')
      .should('have.class', 'active:live-line-pressed')
      .and('have.class', 'active:outline-ink')
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('has no axe accessibility violations (primary)', () => {
    cy.mountAccessible(<Button variant="primary">Apply filters</Button>)
    cy.checkA11y()
  })

  it('has no axe accessibility violations (secondary)', () => {
    cy.mountAccessible(<Button variant="secondary">Cancel</Button>)
    cy.checkA11y()
  })

  it('has no axe accessibility violations (text-action)', () => {
    cy.mountAccessible(<Button variant="text-action">Clear all</Button>)
    cy.checkA11y()
  })

  it('has no axe accessibility violations (disabled)', () => {
    cy.mountAccessible(<Button disabled>Apply filters</Button>)
    cy.checkA11y()
  })
})
