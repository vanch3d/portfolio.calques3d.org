/**
 * GET /publications/[key]/pdf
 *
 * Streams a publication PDF from ownCloud WebDAV using server-side Basic Auth.
 * Resolution logic (key validation, pub lookup, URL building) lives in
 * src/lib/api/pdf.ts — unit-tested independently of this route handler.
 *
 * Security:
 *   - Key is validated against the Zotero key format before any lookup.
 *   - Filename comes entirely from our own Zotero data, never from the request.
 *   - ownCloud credentials are confined to the server-only owncloud module.
 */

import { getAllPublications } from "@/lib/api";
import { resolvePdfSource } from "@/lib/api/pdf";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const publications = await getAllPublications();
  const resolved = resolvePdfSource(key, publications);

  if (!resolved.ok) {
    return new Response(null, { status: resolved.status });
  }

  let upstream: Response;
  try {
    upstream = await fetch(resolved.url, {
      headers: { Authorization: resolved.authHeader },
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
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(resolved.filename)}`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
