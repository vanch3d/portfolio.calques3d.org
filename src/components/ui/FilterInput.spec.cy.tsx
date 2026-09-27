import { FilterInput } from './FilterInput'

function mountInput(
  overrides: Partial<{
    value: string
    startAddon: string
    className: string
    onChange: (v: string) => void
  }> = {}
) {
  const defaults = {
    value: '',
    placeholder: 'SEARCH...',
    ariaLabel: 'Search records',
    onChange: cy.stub().as('onChange'),
  }
  cy.mountAccessible(<FilterInput {...defaults} {...overrides} />)
}

describe('FilterInput', () => {
  describe('input basics', () => {
    it('renders an input of type text', () => {
      mountInput()
      cy.get("input[type='text']").should('exist')
    })

    it('input is accessible via aria-label', () => {
      mountInput()
      cy.get("input[type='text']").should('have.attr', 'aria-label', 'Search records')
    })

    it('reflects the controlled value', () => {
      mountInput({ value: 'vercel' })
      cy.get("input[type='text']").should('have.value', 'vercel')
    })

    it('calls onChange when the user types', () => {
      mountInput()
      cy.get("input[type='text']").type('api')
      cy.get('@onChange').should('have.been.called')
    })

    it('renders the placeholder text', () => {
      mountInput()
      cy.get("input[type='text']").should('have.attr', 'placeholder', 'SEARCH...')
    })
  })

  describe('startAddon slot', () => {
    it('renders the startAddon when provided', () => {
      mountInput({ startAddon: '⌕' })
      cy.contains('⌕').should('exist')
    })

    it('startAddon is aria-hidden', () => {
      mountInput({ startAddon: '⌕' })
      cy.contains('⌕').should('have.attr', 'aria-hidden', 'true')
    })

    it('does not render the startAddon slot when omitted', () => {
      mountInput()
      cy.findByTestId('filter-input').find("[aria-hidden='true']").should('not.exist')
    })

    it('startAddon text is user-select none', () => {
      mountInput({ startAddon: '⌕' })
      cy.contains('⌕').should('have.css', 'user-select', 'none')
    })
  })

  describe('container', () => {
    it('container is rendered', () => {
      mountInput()
      cy.findByTestId('filter-input').should('exist')
    })

    it('className prop is merged onto the container', () => {
      mountInput({ className: 'w-48' })
      cy.findByTestId('filter-input').should('have.class', 'w-48')
    })
  })

  describe('accessibility', () => {
    it('has no axe accessibility violations (without startAddon)', () => {
      mountInput()
      cy.checkA11y()
    })

    it('has no axe accessibility violations (with startAddon)', () => {
      mountInput({ startAddon: '⌕' })
      cy.checkA11y()
    })
  })
})
