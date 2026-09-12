import { NextIntlClientProvider } from 'next-intl'
import React from 'react'

/**
 * Returns a component wrapped in NextIntlClientProvider.
 * Used by cy.mountWithIntl() for components that call useTranslations() internally.
 * CT specs that use the labels-prop pattern do not need this wrapper.
 *
 * Exported as a factory function (not a component) so component.ts can call it
 * without React.createElement children-as-prop (ESLint react/no-children-prop).
 */
export function wrapWithIntl(
  component: React.ReactNode,
  messages: Record<string, unknown> = {}
): React.ReactElement {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  )
}
