import { useState } from 'react'
import { CollapsibleRoot, CollapsibleTrigger, CollapsiblePanel } from './Collapsible'

function ControlledCollapsible() {
  const [open, setOpen] = useState(false)
  return (
    <CollapsibleRoot data-testid="root" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
      <CollapsiblePanel data-testid="panel">Panel content</CollapsiblePanel>
    </CollapsibleRoot>
  )
}

describe('Collapsible', () => {
  describe('uncontrolled mode', () => {
    it('starts closed by default — panel not in the DOM', () => {
      cy.mountAccessible(
        <CollapsibleRoot data-testid="root">
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsiblePanel data-testid="panel">Panel content</CollapsiblePanel>
        </CollapsibleRoot>
      )
      cy.findByTestId('trigger').should('have.attr', 'aria-expanded', 'false')
      cy.findByTestId('panel').should('not.exist')
    })

    it('opens on trigger click and reveals the panel', () => {
      cy.mountAccessible(
        <CollapsibleRoot data-testid="root">
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsiblePanel data-testid="panel">Panel content</CollapsiblePanel>
        </CollapsibleRoot>
      )
      cy.findByTestId('trigger').click()
      cy.findByTestId('trigger').should('have.attr', 'aria-expanded', 'true')
      cy.findByTestId('panel').should('exist').and('have.attr', 'data-open', '')
      cy.findByTestId('panel').should('contain.text', 'Panel content')
    })

    it('closes again on a second trigger click', () => {
      cy.mountAccessible(
        <CollapsibleRoot data-testid="root" defaultOpen>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsiblePanel data-testid="panel">Panel content</CollapsiblePanel>
        </CollapsibleRoot>
      )
      cy.findByTestId('trigger').should('have.attr', 'aria-expanded', 'true')
      cy.findByTestId('trigger').click()
      cy.findByTestId('trigger').should('have.attr', 'aria-expanded', 'false')
      cy.findByTestId('panel').should('not.exist')
    })
  })

  describe('controlled mode', () => {
    it('opens when the open prop follows onOpenChange back in', () => {
      cy.mountAccessible(<ControlledCollapsible />)
      cy.findByTestId('panel').should('not.exist')
      cy.findByTestId('trigger').click()
      cy.findByTestId('trigger').should('have.attr', 'aria-expanded', 'true')
      cy.findByTestId('panel').should('exist')
    })

    it('does not change open state on click when the caller ignores onOpenChange', () => {
      const onOpenChange = cy.stub().as('onOpenChange')
      cy.mountAccessible(
        <CollapsibleRoot data-testid="root" open={false} onOpenChange={onOpenChange}>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsiblePanel data-testid="panel">Panel content</CollapsiblePanel>
        </CollapsibleRoot>
      )
      cy.findByTestId('trigger').click()
      cy.get('@onOpenChange').should('have.been.calledWith', true)
      cy.findByTestId('trigger').should('have.attr', 'aria-expanded', 'false')
      cy.findByTestId('panel').should('not.exist')
    })
  })

  describe('keepMounted', () => {
    it('keeps the panel in the DOM while closed, marked data-closed', () => {
      cy.mountAccessible(
        <CollapsibleRoot data-testid="root">
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsiblePanel data-testid="panel" keepMounted>
            Panel content
          </CollapsiblePanel>
        </CollapsibleRoot>
      )
      cy.findByTestId('panel').should('exist').and('have.attr', 'data-closed', '')
    })

    it('flips from data-closed to data-open across a trigger click, staying mounted throughout', () => {
      cy.mountAccessible(
        <CollapsibleRoot data-testid="root">
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsiblePanel data-testid="panel" keepMounted>
            Panel content
          </CollapsiblePanel>
        </CollapsibleRoot>
      )
      cy.findByTestId('trigger').click()
      cy.findByTestId('panel').should('exist').and('have.attr', 'data-open', '')
      cy.findByTestId('trigger').click()
      cy.findByTestId('panel').should('exist').and('have.attr', 'data-closed', '')
    })
  })

  describe('disabled', () => {
    it('prevents toggling on trigger click', () => {
      cy.mountAccessible(
        <CollapsibleRoot data-testid="root" disabled>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsiblePanel data-testid="panel">Panel content</CollapsiblePanel>
        </CollapsibleRoot>
      )
      cy.findByTestId('trigger').should('have.attr', 'aria-disabled', 'true')
      cy.findByTestId('trigger').click({ force: true })
      cy.findByTestId('trigger').should('have.attr', 'aria-expanded', 'false')
      cy.findByTestId('panel').should('not.exist')
    })
  })

  describe('prop forwarding and contracts', () => {
    it('merges caller className onto each part', () => {
      cy.mountAccessible(
        <CollapsibleRoot data-testid="root" className="mt-lg" defaultOpen>
          <CollapsibleTrigger data-testid="trigger" className="mt-sm">
            Toggle
          </CollapsibleTrigger>
          <CollapsiblePanel data-testid="panel" className="mt-xs">
            Panel content
          </CollapsiblePanel>
        </CollapsibleRoot>
      )
      cy.findByTestId('root').should('have.class', 'mt-lg')
      cy.findByTestId('trigger').should('have.class', 'mt-sm')
      cy.findByTestId('panel').should('have.class', 'mt-xs')
    })
  })

  describe('accessibility', () => {
    it('has no axe accessibility violations (closed)', () => {
      cy.mountAccessible(
        <CollapsibleRoot data-testid="root">
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsiblePanel data-testid="panel">Panel content</CollapsiblePanel>
        </CollapsibleRoot>
      )
      cy.checkA11y()
    })

    it('has no axe accessibility violations (open)', () => {
      cy.mountAccessible(
        <CollapsibleRoot data-testid="root" defaultOpen>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsiblePanel data-testid="panel">Panel content</CollapsiblePanel>
        </CollapsibleRoot>
      )
      cy.checkA11y()
    })
  })
})
