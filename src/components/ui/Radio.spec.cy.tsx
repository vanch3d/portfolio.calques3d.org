/**
 * Radio / RadioGroup — Cypress CT spec
 *
 * Verifies the atoms wire Base UI's real hidden ARIA radiogroup state machine
 * correctly and render it per the Live Line Rule — it does not re-implement
 * or re-verify Base UI's own internals, only this component's integration of
 * them (label association, single-selection behaviour, Tailwind state
 * classes, prop forwarding).
 *
 * Coverage:
 *   - Renders a group with role="radiogroup" and radio options with role="radio"
 *   - defaultValue selects the matching option only
 *   - Selecting a different option moves the selection (single-select)
 *   - Toggles selection on Space while focused (keyboard)
 *   - Fires onValueChange with the new value
 *   - Disabled option: sets data-disabled, does not select on click
 *   - Merges additional className on RadioGroup and Radio
 *   - Does not redefine focus-visible locally
 *   - a11y: default (no selection)
 *   - a11y: with a selection
 *   - a11y: disabled option present
 */

import { Radio, RadioGroup } from './Radio'

describe('Radio / RadioGroup', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders a group with radio options', () => {
    cy.mountAccessible(
      <RadioGroup aria-label="Group tags by">
        <Radio value="frequency" label="Frequency" />
        <Radio value="category" label="Category" />
      </RadioGroup>
    )
    cy.get('[role="radiogroup"]').should('exist')
    cy.get('[role="radio"]').should('have.length', 2)
    cy.findByText('Frequency').should('be.visible')
    cy.findByText('Category').should('be.visible')
  })

  // ── Selection ──────────────────────────────────────────────────────────────

  it('selects the option matching defaultValue only', () => {
    cy.mountAccessible(
      <RadioGroup aria-label="Group tags by" defaultValue="frequency">
        <Radio value="frequency" label="Frequency" />
        <Radio value="category" label="Category" />
      </RadioGroup>
    )
    cy.findByText('Frequency')
      .parent()
      .find('[role="radio"]')
      .should('have.attr', 'aria-checked', 'true')
      .and('have.attr', 'data-checked', '')
    cy.findByText('Category')
      .parent()
      .find('[role="radio"]')
      .should('have.attr', 'aria-checked', 'false')
  })

  it('moves the selection to a different option on click', () => {
    cy.mountAccessible(
      <RadioGroup aria-label="Group tags by" defaultValue="frequency">
        <Radio value="frequency" label="Frequency" />
        <Radio value="category" label="Category" />
      </RadioGroup>
    )
    cy.findByText('Category').click()
    cy.findByText('Category')
      .parent()
      .find('[role="radio"]')
      .should('have.attr', 'aria-checked', 'true')
    cy.findByText('Frequency')
      .parent()
      .find('[role="radio"]')
      .should('have.attr', 'aria-checked', 'false')
  })

  // ── Interaction ────────────────────────────────────────────────────────────

  it('toggles selection on Space while focused', () => {
    cy.mountAccessible(
      <RadioGroup aria-label="Group tags by">
        <Radio value="frequency" label="Frequency" />
        <Radio value="category" label="Category" />
      </RadioGroup>
    )
    cy.findByText('Category')
      .parent()
      .find('[role="radio"]')
      .focus()
      .trigger('keydown', { key: ' ' })
      .trigger('keyup', { key: ' ' })
    cy.findByText('Category')
      .parent()
      .find('[role="radio"]')
      .should('have.attr', 'aria-checked', 'true')
  })

  it('fires onValueChange with the new value', () => {
    const onValueChange = cy.stub().as('onValueChange')
    cy.mountAccessible(
      <RadioGroup aria-label="Group tags by" onValueChange={onValueChange}>
        <Radio value="frequency" label="Frequency" />
        <Radio value="category" label="Category" />
      </RadioGroup>
    )
    cy.findByText('Frequency').click()
    cy.get('@onValueChange').should('have.been.calledWith', 'frequency')
  })

  // ── Disabled state ─────────────────────────────────────────────────────────

  it('sets data-disabled and does not select on click when disabled', () => {
    cy.mountAccessible(
      <RadioGroup aria-label="Group tags by">
        <Radio value="frequency" label="Frequency" />
        <Radio value="status" label="Status" disabled />
      </RadioGroup>
    )
    cy.findByText('Status').parent().find('[role="radio"]').should('have.attr', 'data-disabled', '')
    cy.findByText('Status').click({ force: true })
    cy.findByText('Status')
      .parent()
      .find('[role="radio"]')
      .should('have.attr', 'aria-checked', 'false')
  })

  // ── Props forwarding ───────────────────────────────────────────────────────

  it('merges additional className on RadioGroup and Radio', () => {
    cy.mountAccessible(
      <RadioGroup aria-label="Group tags by" className="mt-lg">
        <Radio value="frequency" label="Frequency" className="mb-sm" />
      </RadioGroup>
    )
    cy.get('[role="radiogroup"]').should('have.class', 'mt-lg')
    cy.get('[role="radio"]').should('have.class', 'mb-sm')
  })

  // ── Focus-visible — must not be redefined locally ─────────────────────────

  it('does not set a local outline style, relying on the global focus-visible ring', () => {
    cy.mountAccessible(
      <RadioGroup aria-label="Group tags by">
        <Radio value="frequency" label="Frequency" />
      </RadioGroup>
    )
    cy.get('[role="radio"]').should('not.have.attr', 'style')
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('has no axe accessibility violations (no selection)', () => {
    cy.mountAccessible(
      <RadioGroup aria-label="Group tags by">
        <Radio value="frequency" label="Frequency" />
        <Radio value="category" label="Category" />
      </RadioGroup>
    )
    cy.checkA11y()
  })

  it('has no axe accessibility violations (with a selection)', () => {
    cy.mountAccessible(
      <RadioGroup aria-label="Group tags by" defaultValue="frequency">
        <Radio value="frequency" label="Frequency" />
        <Radio value="category" label="Category" />
      </RadioGroup>
    )
    cy.checkA11y()
  })

  it('has no axe accessibility violations (disabled option present)', () => {
    cy.mountAccessible(
      <RadioGroup aria-label="Group tags by" defaultValue="frequency">
        <Radio value="frequency" label="Frequency" />
        <Radio value="status" label="Status" disabled />
      </RadioGroup>
    )
    cy.checkA11y()
  })
})
