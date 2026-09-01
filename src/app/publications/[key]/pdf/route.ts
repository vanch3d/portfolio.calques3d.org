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

import { getAllPublications } from "@/lib/api";
import { buildFileUrl, buildAuthHeader } from "@/lib/api/owncloud";

export const dynamic = "force-dynamic";

// Zotero item keys are 8-character alphanumeric strings
const ZOTERO_KEY = /^[A-Z0-9]{8}$/i;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  if (!ZOTERO_KEY.test(key)) {
    return new Response(null, { status: 400 });
  }

  const publications = await getAllPublications();
  const pub = publications.find((p) => p.key === key);

  if (!pub || !pub.pdf) {
    return new Response(null, { status: 404 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(buildFileUrl(pub.pdf), {
      headers: { Authorization: buildAuthHeader() },
    });
  } catch {
    return new Response(null, { status: 502 });
  }

  if (!upstream.ok) {
    return new Response(null, { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(pub.pdf)}`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
