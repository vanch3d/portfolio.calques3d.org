/**
 * GET /publications/[key]/pdf
 *
 * Streams a publication PDF from ownCloud WebDAV using server-side Basic Auth.
 * The Zotero item key is resolved to a filename via the cached publication list —
 * only PDFs associated with known publications are accessible.
 *
 * Security:
 *   - Key is validated against the Zotero key format before any lookup.
 *   - Filename comes entirely from our own Zotero data, never from the request.
 *   - ownCloud credentials are confined to the server-only owncloud module.
 *
 * Extensibility:
 *   - Additional content types (slides, datasets) follow the same pattern
 *     at /publications/[key]/slides, /publications/[key]/data, etc.
 */

import { getCachedPublications } from '@/lib/publications'
import { resolvePdfSource } from '@/lib/api/pdf'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params

  const publications = await getCachedPublications()
  const resolution = resolvePdfSource(key, publications)

  if (!resolution.ok) {
    return new Response(null, { status: resolution.status })
  }

  let upstream: Response
  try {
    upstream = await fetch(resolution.url, {
      headers: { Authorization: resolution.authHeader },
    })
  } catch {
    return new Response(null, { status: 502 })
  }

  if (!upstream.ok) {
    return new Response(null, { status: upstream.status })
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(resolution.filename)}`,
      'Cache-Control': 'private, max-age=3600',
    },
  })
}
