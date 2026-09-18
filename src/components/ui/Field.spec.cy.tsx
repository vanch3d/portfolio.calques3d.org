import { Field } from './Field'

describe('Field', () => {
  describe('rendering', () => {
    it('renders with the given label text, associated with the input', () => {
      cy.mountAccessible(<Field label="Filter by author" />)
      cy.findByLabelText('Filter by author').should('exist')
    })

    it('renders the description when no error is present', () => {
      cy.mountAccessible(<Field label="Filter by author" description="Matches partial names." />)
      cy.findByText('Matches partial names.').should('be.visible')
    })

    it('fills available width up to the field max-width, not a collapsed default', () => {
      cy.mountAccessible(<Field label="Filter by author" />)
      cy.contains('div', 'Filter by author').should(($el) => {
        expect($el.outerWidth()).to.be.greaterThan(100)
      })
    })
  })

  describe('error state', () => {
    it('renders the error message and hides the description when an error is present', () => {
      cy.mountAccessible(
        <Field
          label="Filter by author"
          description="Matches partial names."
          errorMessage="Author name must be at least 2 characters."
        />
      )
      cy.findByText('Author name must be at least 2 characters.').should('be.visible')
      cy.findByText('Matches partial names.').should('not.exist')
    })

    it('sets data-invalid on the control when an error is present', () => {
      cy.mountAccessible(<Field label="Filter by author" errorMessage="Required." />)
      cy.findByLabelText('Filter by author').should('have.attr', 'data-invalid', '')
    })

    it('renders the error glyph as an inline SVG inside an aria-hidden badge, not a text character', () => {
      cy.mountAccessible(<Field label="Filter by author" errorMessage="Required." />)
      cy.get('[aria-hidden="true"] > svg').should('exist')
      cy.get('svg').invoke('text').should('eq', '')
    })
  })

  describe('disabled state', () => {
    it('disables the input and dims the label when disabled', () => {
      cy.mountAccessible(<Field label="Filter by author" disabled />)
      cy.findByLabelText('Filter by author').should('be.disabled')
      cy.contains('label', 'Filter by author').should('have.attr', 'data-disabled', '')
    })
  })

  describe('prop forwarding and contracts', () => {
    it('forwards inputProps to the control', () => {
      cy.mountAccessible(
        <Field label="Filter by author" inputProps={{ placeholder: 'e.g. Van Labeke' }} />
      )
      cy.findByPlaceholderText('e.g. Van Labeke').should('exist')
    })

    it('merges additional className', () => {
      cy.mountAccessible(<Field label="Filter by author" className="mt-lg" />)
      cy.contains('div.mt-lg', 'Filter by author').should('exist')
    })

    it('does not set a local outline style on the control, relying on the global focus-visible ring', () => {
      cy.mountAccessible(<Field label="Filter by author" />)
      cy.findByLabelText('Filter by author').should('not.have.attr', 'style')
    })
  })

  describe('accessibility', () => {
    it('has no axe accessibility violations (default, with description)', () => {
      cy.mountAccessible(<Field label="Filter by author" description="Matches partial names." />)
      cy.checkA11y()
    })

    it('has no axe accessibility violations (error state)', () => {
      cy.mountAccessible(
        <Field label="Filter by author" errorMessage="Author name must be at least 2 characters." />
      )
      cy.checkA11y()
    })

    it('has no axe accessibility violations (disabled, with description)', () => {
      cy.mountAccessible(
        <Field label="Filter by author" disabled description="Matches partial names." />
      )
      cy.checkA11y()
    })
  })
})
