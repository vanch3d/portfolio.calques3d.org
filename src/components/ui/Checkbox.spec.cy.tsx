/**
 * Checkbox — Cypress CT spec
 *
 * Verifies the atom wires Base UI's real hidden ARIA checkbox state machine
 * correctly and renders it per the Live Line Rule — it does not re-implement
 * or re-verify Base UI's own internals, only this component's integration of
 * them (label association, Tailwind state classes, prop forwarding).
 *
 * Coverage:
 *   - Renders with the given label text
 *   - Defaults to unchecked (aria-checked="false")
 *   - Renders checked when defaultChecked is set (aria-checked + data-checked)
 *   - Toggles on click (mouse)
 *   - Toggles on Space while focused (keyboard — Base UI's non-native button path)
 *   - Fires onCheckedChange with the new value
 *   - Disabled: sets data-disabled, does not toggle on click
 *   - Merges additional className
 *   - Does not redefine focus-visible locally
 *   - a11y: unchecked
 *   - a11y: checked
 *   - a11y: disabled
 */

import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders with the given label text', () => {
    cy.mountAccessible(<Checkbox label="Publications" />)
    cy.findByText('Publications').should('be.visible')
    cy.get('[role="checkbox"]').should('exist')
  })

  // ── Checked state ──────────────────────────────────────────────────────────

  it('defaults to unchecked', () => {
    cy.mountAccessible(<Checkbox label="Publications" />)
    cy.get('[role="checkbox"]').should('have.attr', 'aria-checked', 'false')
  })

  it('renders checked when defaultChecked is set', () => {
    cy.mountAccessible(<Checkbox label="Publications" defaultChecked />)
    cy.get('[role="checkbox"]')
      .should('have.attr', 'aria-checked', 'true')
      .and('have.attr', 'data-checked', '')
  })

  // ── Interaction ────────────────────────────────────────────────────────────

  it('toggles on click', () => {
    cy.mountAccessible(<Checkbox label="Publications" />)
    cy.get('[role="checkbox"]').click()
    cy.get('[role="checkbox"]').should('have.attr', 'aria-checked', 'true')
    cy.get('[role="checkbox"]').click()
    cy.get('[role="checkbox"]').should('have.attr', 'aria-checked', 'false')
  })

  it('toggles on Space while focused', () => {
    cy.mountAccessible(<Checkbox label="Publications" />)
    cy.get('[role="checkbox"]')
      .focus()
      .trigger('keydown', { key: ' ' })
      .trigger('keyup', { key: ' ' })
    cy.get('[role="checkbox"]').should('have.attr', 'aria-checked', 'true')
  })

  it('fires onCheckedChange with the new value', () => {
    const onCheckedChange = cy.stub().as('onCheckedChange')
    cy.mountAccessible(<Checkbox label="Publications" onCheckedChange={onCheckedChange} />)
    cy.get('[role="checkbox"]').click()
    cy.get('@onCheckedChange').should('have.been.calledWith', true)
  })

  // ── Disabled state ─────────────────────────────────────────────────────────

  it('sets data-disabled and does not toggle on click when disabled', () => {
    cy.mountAccessible(<Checkbox label="Screenshots" disabled />)
    cy.get('[role="checkbox"]').should('have.attr', 'data-disabled', '')
    cy.get('[role="checkbox"]').click({ force: true })
    cy.get('[role="checkbox"]').should('have.attr', 'aria-checked', 'false')
  })

  // ── Props forwarding ───────────────────────────────────────────────────────

  it('merges additional className', () => {
    cy.mountAccessible(<Checkbox label="Publications" className="mt-lg" />)
    cy.get('[role="checkbox"]').should('have.class', 'mt-lg')
  })

  // ── Focus-visible — must not be redefined locally ─────────────────────────

  it('does not set a local outline style, relying on the global focus-visible ring', () => {
    cy.mountAccessible(<Checkbox label="Publications" />)
    cy.get('[role="checkbox"]').should('not.have.attr', 'style')
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('has no axe accessibility violations (unchecked)', () => {
    cy.mountAccessible(<Checkbox label="Publications" />)
    cy.checkA11y()
  })

  it('has no axe accessibility violations (checked)', () => {
    cy.mountAccessible(<Checkbox label="Publications" defaultChecked />)
    cy.checkA11y()
  })

  it('has no axe accessibility violations (disabled)', () => {
    cy.mountAccessible(<Checkbox label="Screenshots" disabled />)
    cy.checkA11y()
  })
})
