import { Fieldset } from './Fieldset'
import { Radio, RadioGroup } from './Radio'

describe('Fieldset', () => {
  describe('rendering', () => {
    it('renders the legend text, associated with the fieldset via aria-labelledby', () => {
      cy.mountAccessible(
        <Fieldset legend="Group tags by">
          <p>Content</p>
        </Fieldset>
      )
      cy.findByText('Group tags by').should('be.visible')
      cy.get('fieldset')
        .invoke('attr', 'aria-labelledby')
        .then((id) => {
          expect(id).to.be.a('string')
          cy.get(`#${id}`).should('contain.text', 'Group tags by')
        })
    })

    it('renders the description when provided', () => {
      cy.mountAccessible(
        <Fieldset
          legend="Group tags by"
          description="Frequency is the only mode implemented today."
        >
          <p>Content</p>
        </Fieldset>
      )
      cy.findByText('Frequency is the only mode implemented today.').should('be.visible')
    })

    it('renders children inside the fieldset', () => {
      cy.mountAccessible(
        <Fieldset legend="Group tags by">
          <RadioGroup defaultValue="frequency">
            <Radio value="frequency" label="Frequency" />
            <Radio value="category" label="Category" />
          </RadioGroup>
        </Fieldset>
      )
      cy.findByText('Frequency').should('be.visible')
      cy.findByText('Category').should('be.visible')
    })

    it('lets a nested RadioGroup inherit the legend as its accessible name, with no aria-label prop', () => {
      cy.mountAccessible(
        <Fieldset legend="Group tags by">
          <RadioGroup defaultValue="frequency">
            <Radio value="frequency" label="Frequency" />
          </RadioGroup>
        </Fieldset>
      )
      cy.get('[role="radiogroup"]')
        .invoke('attr', 'aria-labelledby')
        .then((id) => {
          expect(id).to.be.a('string')
          cy.get(`#${id}`).should('contain.text', 'Group tags by')
        })
    })

    it('merges additional className', () => {
      cy.mountAccessible(
        <Fieldset legend="Group tags by" className="mt-lg">
          <p>Content</p>
        </Fieldset>
      )
      cy.get('fieldset.mt-lg').should('exist')
    })
  })

  describe('disabled state', () => {
    it('sets the native disabled attribute on the fieldset when disabled', () => {
      cy.mountAccessible(
        <Fieldset legend="Group tags by" disabled>
          <p>Content</p>
        </Fieldset>
      )
      cy.get('fieldset').should('be.disabled')
    })
  })

  describe('accessibility', () => {
    it('has no axe accessibility violations (default)', () => {
      cy.mountAccessible(
        <Fieldset
          legend="Group tags by"
          description="Frequency is the only mode implemented today."
        >
          <RadioGroup defaultValue="frequency">
            <Radio value="frequency" label="Frequency" />
            <Radio value="category" label="Category" />
          </RadioGroup>
        </Fieldset>
      )
      cy.checkA11y()
    })

    it('has no axe accessibility violations (disabled)', () => {
      cy.mountAccessible(
        <Fieldset legend="Group tags by" disabled>
          <RadioGroup defaultValue="frequency">
            <Radio value="frequency" label="Frequency" disabled />
            <Radio value="category" label="Category" disabled />
          </RadioGroup>
        </Fieldset>
      )
      cy.checkA11y()
    })
  })
})
