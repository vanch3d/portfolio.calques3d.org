/**
 * MSW node server — used in Vitest tests.
 * Lifecycle (listen/reset/close) is managed in src/test/setup.ts.
 */

import { setupServer } from 'msw/node'
import { zoteroHandlers } from './handlers/zotero'

export const server = setupServer(...zoteroHandlers)
