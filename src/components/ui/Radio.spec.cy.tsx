import { Radio, RadioGroup } from './Radio'

describe('Radio / RadioGroup', () => {
  describe('rendering', () => {
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
  })

  describe('interaction', () => {
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
  })

  describe('disabled state', () => {
    it('sets data-disabled and does not select on click when disabled', () => {
      cy.mountAccessible(
        <RadioGroup aria-label="Group tags by">
          <Radio value="frequency" label="Frequency" />
          <Radio value="status" label="Status" disabled />
        </RadioGroup>
      )
      cy.findByText('Status')
        .parent()
        .find('[role="radio"]')
        .should('have.attr', 'data-disabled', '')
      cy.findByText('Status').click({ force: true })
      cy.findByText('Status')
        .parent()
        .find('[role="radio"]')
        .should('have.attr', 'aria-checked', 'false')
    })
  })

  describe('prop forwarding and contracts', () => {
    it('merges additional className on RadioGroup and Radio', () => {
      cy.mountAccessible(
        <RadioGroup aria-label="Group tags by" className="mt-lg">
          <Radio value="frequency" label="Frequency" className="mb-sm" />
        </RadioGroup>
      )
      cy.get('[role="radiogroup"]').should('have.class', 'mt-lg')
      cy.get('[role="radio"]').should('have.class', 'mb-sm')
    })

    it('does not set a local outline style, relying on the global focus-visible ring', () => {
      cy.mountAccessible(
        <RadioGroup aria-label="Group tags by">
          <Radio value="frequency" label="Frequency" />
        </RadioGroup>
      )
      cy.get('[role="radio"]').should('not.have.attr', 'style')
    })
  })

  describe('accessibility', () => {
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
})
