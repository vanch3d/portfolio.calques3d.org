/**
 * PDF resolution logic — pure, testable layer.
 *
 * Extracted from the /publications/[key]/pdf route handler so that
 * key validation and publication lookup can be unit-tested without
 * standing up a Next.js server or ownCloud connection.
 */

import 'server-only'

import type { Publication } from '@/types/content'
import { buildFileUrl, buildAuthHeader } from './owncloud'

// Zotero item keys are 8-character alphanumeric strings
export const ZOTERO_KEY_PATTERN = /^[A-Z0-9]{8}$/i

export type PdfResolutionResult =
  { ok: true; url: string; authHeader: string; filename: string } | { ok: false; status: 400 | 404 }

/**
 * Validates the key format and resolves the ownCloud URL for a publication PDF.
 * Returns a typed result — the route handler maps this to a Response.
 *
 * @param key       - Zotero item key from the URL segment
 * @param publications - Full publication list to search
 */
export function resolvePdfSource(key: string, publications: Publication[]): PdfResolutionResult {
  if (!ZOTERO_KEY_PATTERN.test(key)) {
    return { ok: false, status: 400 }
  }

  const pub = publications.find((p) => p.key === key)
  if (!pub || !pub.pdf) {
    return { ok: false, status: 404 }
  }

  return {
    ok: true,
    url: buildFileUrl(pub.pdf),
    authHeader: buildAuthHeader(),
    filename: pub.pdf,
  }
}
