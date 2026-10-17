import React from 'react'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { PathnameContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime'

/**
 * Mock Next.js App Router context for Cypress Component Testing.
 *
 * Provides both AppRouterContext (required by useRouter()) and
 * PathnameContext (required by usePathname()). Without these,
 * useRouter() throws "invariant expected app router to be mounted"
 * and usePathname() returns null, causing startsWith() to throw.
 *
 * Usage: wrap via mountAccessible() — it is included automatically.
 * To test active-link logic, pass the pathname you want to simulate:
 *
 *   cy.mount(wrapWithRouter(<NavigationBar />, { pathname: "/research" }))
 */

// Minimal mock — only the methods that components call.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRouter: any = {
  back: () => {},
  forward: () => {},
  push: () => {},
  replace: () => {},
  refresh: () => {},
  prefetch: () => {},
}

export interface RouterWrapperOptions {
  pathname?: string
}

export function wrapWithRouter(
  component: React.ReactNode,
  { pathname = '/' }: RouterWrapperOptions = {}
): React.ReactElement {
  return (
    <AppRouterContext.Provider value={mockRouter}>
      <PathnameContext.Provider value={pathname}>{component}</PathnameContext.Provider>
    </AppRouterContext.Provider>
  )
}
