import { useState } from 'react'
import { ConstructionPanel } from './ConstructionPanel'
import { CollapsibleTrigger } from './Collapsible'

describe('ConstructionPanel', () => {
  describe('rendering', () => {
    it('renders the toggle with the given label', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags">
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('construction-panel-toggle').should('contain.text', 'Tags')
    })

    it('starts closed by default — no panel body in the DOM', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags">
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('construction-panel-toggle').should('have.attr', 'aria-expanded', 'false')
      cy.findByTestId('construction-panel-body').should('not.exist')
    })

    it('renders open when defaultOpen is set', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags" defaultOpen>
          <span data-testid="inner-content">panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('construction-panel-toggle').should('have.attr', 'aria-expanded', 'true')
      cy.findByTestId('construction-panel-body').should('be.visible')
      cy.findByTestId('construction-panel-body').within(() => {
        cy.findByTestId('inner-content').should('contain.text', 'panel content')
      })
    })

    it('shows the closed hint only while closed', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags" closedHint="No tags selected">
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('construction-panel-hint').should('contain.text', 'No tags selected')
      cy.findByTestId('construction-panel-toggle').click()
      cy.findByTestId('construction-panel-hint').should('not.exist')
    })
  })

  describe('interaction', () => {
    it('opens the panel on toggle click and reveals children', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags">
          <span data-testid="inner-content">panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('construction-panel-toggle').click()
      cy.findByTestId('construction-panel-toggle').should('have.attr', 'aria-expanded', 'true')
      cy.findByTestId('construction-panel-body').within(() => {
        cy.findByTestId('inner-content').should('be.visible')
      })
    })

    it('closes the panel again on a second click', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags">
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('construction-panel-toggle').click()
      cy.findByTestId('construction-panel-toggle').click()
      cy.findByTestId('construction-panel-toggle').should('have.attr', 'aria-expanded', 'false')
      cy.findByTestId('construction-panel-body').should('not.exist')
    })

    it('aria-controls references the panel body id once open', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags">
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('construction-panel-toggle').click()
      cy.findByTestId('construction-panel-toggle')
        .invoke('attr', 'aria-controls')
        .then((controlsId) => {
          cy.findByTestId('construction-panel-body').should('have.attr', 'id', controlsId)
        })
    })
  })

  describe('prop forwarding and contracts', () => {
    it('merges additional className onto the panel body, alongside the shared box styling', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags" defaultOpen className="mt-lg">
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('construction-panel-body').should('have.class', 'mt-lg')
      cy.findByTestId('construction-panel-body').should('have.class', 'bg-ground-warm')
    })

    it('does not set a local outline style, relying on the global focus-visible ring', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags">
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('construction-panel-toggle').should('not.have.attr', 'style')
    })

    it('defaults the panel body aria-label to toggleLabel when ariaLabel is omitted', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags" defaultOpen>
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('construction-panel-body').should('have.attr', 'aria-label', 'Tags')
    })

    it('overrides the panel body aria-label with ariaLabel when supplied', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags" ariaLabel="Custom region label" defaultOpen>
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('construction-panel-body').should(
        'have.attr',
        'aria-label',
        'Custom region label'
      )
    })
  })

  describe('custom trigger', () => {
    it('renders the custom trigger instead of the default toggle row', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags" trigger={customTrigger}>
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('custom-trigger').should('contain.text', 'Custom closed')
      cy.findByTestId('construction-panel-toggle').should('not.exist')
      cy.findByTestId('construction-panel-toggle-row').should('not.exist')
    })

    it('keeps the custom trigger keyboard-reachable and toggling the panel', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags" trigger={customTrigger}>
          <span data-testid="inner-content">panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('custom-trigger').should('have.attr', 'aria-expanded', 'false')
      cy.findByTestId('custom-trigger').click()
      cy.findByTestId('custom-trigger').should('have.attr', 'aria-expanded', 'true')
      cy.findByTestId('custom-trigger').should('contain.text', 'Custom open')
      cy.findByTestId('construction-panel-body').within(() => {
        cy.findByTestId('inner-content').should('be.visible')
      })
    })

    it('allows sibling content outside the clickable trigger element', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags" trigger={customTrigger}>
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('custom-trigger-row').should('exist')
      cy.findByTestId('sibling-zone').should('contain.text', 'sibling content')
    })
  })

  describe('controlled open', () => {
    function ControlledHarness() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button data-testid="external-toggle" onClick={() => setOpen((next) => !next)}>
            external toggle
          </button>
          <ConstructionPanel toggleLabel="Tags" open={open} onOpenChange={setOpen}>
            <span data-testid="inner-content">panel content</span>
          </ConstructionPanel>
        </>
      )
    }

    it('reflects an externally-owned open prop', () => {
      cy.mountAccessible(<ControlledHarness />)
      cy.findByTestId('construction-panel-toggle').should('have.attr', 'aria-expanded', 'false')
      cy.findByTestId('external-toggle').click()
      cy.findByTestId('construction-panel-toggle').should('have.attr', 'aria-expanded', 'true')
      cy.findByTestId('construction-panel-body').within(() => {
        cy.findByTestId('inner-content').should('be.visible')
      })
    })

    it('calls onOpenChange on trigger click but leaves the open prop authoritative', () => {
      const onOpenChange = cy.stub().as('onOpenChange')
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags" open={true} onOpenChange={onOpenChange}>
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.findByTestId('construction-panel-toggle').click()
      cy.get('@onOpenChange').should('have.been.calledWith', false)
      cy.findByTestId('construction-panel-toggle').should('have.attr', 'aria-expanded', 'true')
    })
  })

  describe('accessibility', () => {
    it('has no axe accessibility violations (closed)', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags" closedHint="No tags selected">
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.checkA11y()
    })

    it('has no axe accessibility violations (open)', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags" defaultOpen>
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.checkA11y()
    })

    it('has no axe accessibility violations (custom trigger, open)', () => {
      cy.mountAccessible(
        <ConstructionPanel toggleLabel="Tags" defaultOpen trigger={customTrigger}>
          <span>panel content</span>
        </ConstructionPanel>
      )
      cy.checkA11y()
    })
  })
})

function customTrigger({ open }: { open: boolean }) {
  return (
    <div className="flex items-center gap-sm" data-testid="custom-trigger-row">
      <CollapsibleTrigger data-testid="custom-trigger">
        Custom {open ? 'open' : 'closed'}
      </CollapsibleTrigger>
      <span data-testid="sibling-zone">sibling content</span>
    </div>
  )
}
