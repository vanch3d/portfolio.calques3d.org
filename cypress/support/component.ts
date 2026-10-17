// Cypress component testing support file.
// Runs before each component spec.
//
// CT helpers live in cypress/support/ as co-located files:
//   IntlWrapper.tsx  — NextIntlClientProvider wrapper for useTranslations() components

import { mount } from 'cypress/react'
import { wrapWithIntl } from './commands/IntlWrapper'
import 'axe-core'
import './commands'
import '../../src/styles/globals.css'
import installLogsCollector from 'cypress-terminal-report/src/installLogsCollector'

// ─── Animation freeze for accessibility testing ───────────────────────────────
// In CT there is no page navigation, so window:before:load fires unreliably.
// The animation reset is applied via a static <style> block in
// component-index.html instead — it is always present before any component
// mounts. See ADR 011 for the rationale.

installLogsCollector({ collectTypes: ['cy:log', 'cy:command'] })

type MountParams = Parameters<typeof mount>

function mountWithIntl(
  component: MountParams[0],
  options?: MountParams[1] & { messages?: Record<string, unknown> }
): ReturnType<typeof mount> {
  const { messages = {}, ...mountOptions } = options ?? {}
  return mount(wrapWithIntl(component, messages), mountOptions)
}

// Make cy.mount(), cy.mountWithIntl(), and cy.mountAccessible() available in all CT specs
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      mountWithIntl(
        component: MountParams[0],
        options?: MountParams[1] & { messages?: Record<string, unknown> }
      ): Chainable
      mountAccessible(component: MountParams[0]): Chainable
    }
  }
}

Cypress.Commands.add('mount', mount)
Cypress.Commands.add('mountWithIntl', mountWithIntl)
