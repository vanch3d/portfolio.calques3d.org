/**
 * PropsTable — Cypress CT spec
 *
 * Tests the props API table component in isolation.
 * No translation context needed — column headers are universal terminology.
 *
 * Coverage:
 *   - Renders all five column headers
 *   - Renders a required prop row with active-mark on REQ cell
 *   - Renders an optional prop row with ghost REQ cell
 *   - Renders defaultValue when provided, dash when absent
 *   - a11y check
 */

import { PropsTable } from './PropsTable'
import type { PropRow } from './PropsTable'

const REQUIRED_ROW: PropRow = {
  name: 'tags',
  type: 'TagWithCount[]',
  required: true,
  notes: 'Full list of tags with frequency counts.',
}

const OPTIONAL_ROW: PropRow = {
  name: 'initialActiveTags',
  type: 'string[]',
  required: false,
  defaultValue: '[]',
  notes: 'Tags selected on first render.',
}

const OPTIONAL_NO_DEFAULT: PropRow = {
  name: 'className',
  type: 'string',
  required: false,
  notes: 'Additional class names forwarded to the root element.',
}

describe('PropsTable', () => {
  it('renders all five column headers', () => {
    cy.mountAccessible(<PropsTable rows={[REQUIRED_ROW]} />)
    cy.get('th').should('have.length', 5)
    cy.get('th').eq(0).should('contain.text', 'NAME')
    cy.get('th').eq(1).should('contain.text', 'TYPE')
    cy.get('th').eq(2).should('contain.text', 'REQ')
    cy.get('th').eq(3).should('contain.text', 'DEFAULT')
    cy.get('th').eq(4).should('contain.text', 'NOTES')
  })

  it('renders a required prop row with active-mark on REQ cell', () => {
    cy.mountAccessible(<PropsTable rows={[REQUIRED_ROW]} />)
    cy.findByTestId('prop-row-tags').should('exist')
    cy.findByTestId('prop-req-tags').should('have.class', 'active-mark')
    cy.findByTestId('prop-req-tags').should('contain.text', 'YES')
  })

  it('renders an optional prop row with ghost REQ cell', () => {
    cy.mountAccessible(<PropsTable rows={[OPTIONAL_ROW]} />)
    cy.findByTestId('prop-row-initialActiveTags').should('exist')
    cy.findByTestId('prop-req-initialActiveTags').should('have.class', 'text-ink-ghost')
    cy.findByTestId('prop-req-initialActiveTags').should('contain.text', '—')
  })

  it('renders defaultValue when provided, dash when absent', () => {
    cy.mountAccessible(<PropsTable rows={[OPTIONAL_ROW, OPTIONAL_NO_DEFAULT]} />)
    cy.findByTestId('prop-row-initialActiveTags').find('td').eq(3).should('contain.text', '[]')
    cy.findByTestId('prop-row-className').find('td').eq(3).should('contain.text', '—')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(<PropsTable rows={[REQUIRED_ROW, OPTIONAL_ROW, OPTIONAL_NO_DEFAULT]} />)
    cy.checkA11y()
  })
})
