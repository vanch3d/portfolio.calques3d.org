import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  describe('rendering', () => {
    it('renders with the given label text', () => {
      cy.mountAccessible(<Checkbox label="Publications" />)
      cy.findByText('Publications').should('be.visible')
      cy.get('[role="checkbox"]').should('exist')
    })

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
  })

  describe('interaction', () => {
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
  })

  describe('disabled state', () => {
    it('sets data-disabled and does not toggle on click when disabled', () => {
      cy.mountAccessible(<Checkbox label="Screenshots" disabled />)
      cy.get('[role="checkbox"]').should('have.attr', 'data-disabled', '')
      cy.get('[role="checkbox"]').click({ force: true })
      cy.get('[role="checkbox"]').should('have.attr', 'aria-checked', 'false')
    })
  })

  describe('prop forwarding and contracts', () => {
    it('merges additional className', () => {
      cy.mountAccessible(<Checkbox label="Publications" className="mt-lg" />)
      cy.get('[role="checkbox"]').should('have.class', 'mt-lg')
    })

    it('does not set a local outline style, relying on the global focus-visible ring', () => {
      cy.mountAccessible(<Checkbox label="Publications" />)
      cy.get('[role="checkbox"]').should('not.have.attr', 'style')
    })
  })

  describe('accessibility', () => {
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
})
