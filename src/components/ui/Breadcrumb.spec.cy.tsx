/**
 * Breadcrumb — Cypress CT spec
 *
 * Coverage:
 * - Renders each item as a link plus the current (non-link) crumb
 * - Current crumb carries aria-current="page"
 * - Renders correctly with a single item
 * - axe-clean
 */

import type { Route } from 'next'
import { Breadcrumb } from './Breadcrumb'

describe('Breadcrumb', () => {
  it('renders each item as a link', () => {
    cy.mountAccessible(
      <Breadcrumb
        items={[
          { label: 'Nicolas Van Labeke', href: '/' },
          { label: 'Engineering', href: '/engineering' },
        ]}
        current="HiveMQ Edge"
      />
    )
    cy.get("a[href='/']").should('contain.text', 'Nicolas Van Labeke')
    cy.get("a[href='/engineering']").should('contain.text', 'Engineering')
  })

  it('renders the current crumb as non-link text with aria-current', () => {
    cy.mountAccessible(<Breadcrumb items={[{ label: 'Home', href: '/' }]} current="HiveMQ Edge" />)
    cy.findByTestId('breadcrumb-current')
      .should('have.text', 'HiveMQ Edge')
      .and('have.attr', 'aria-current', 'page')
    cy.findByTestId('breadcrumb-current').find('a').should('not.exist')
  })

  it('renders with a single trail item', () => {
    cy.mountAccessible(<Breadcrumb items={[{ label: 'Home', href: '/' }]} current="Research" />)
    cy.findByTestId('breadcrumb').find('a').should('have.length', 1)
  })

  it('has the Breadcrumb aria-label on the nav element', () => {
    cy.mountAccessible(<Breadcrumb items={[{ label: 'Home', href: '/' }]} current="Research" />)
    cy.findByTestId('breadcrumb').should('have.attr', 'aria-label', 'Breadcrumb')
  })

  it('has no axe accessibility violations', () => {
    cy.mountAccessible(
      <Breadcrumb
        items={[
          { label: 'Nicolas Van Labeke', href: '/' },
          { label: 'Engineering', href: '/engineering' },
          { label: 'HiveMQ', href: '/projects/hivemq-edge' as Route },
        ]}
        current="HiveMQ Edge"
      />
    )
    cy.checkA11y()
  })
})
