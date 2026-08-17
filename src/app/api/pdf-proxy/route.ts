/**
 * GET /api/pdf-proxy?file=<filename>
 *
 * Fetches a PDF from ownCloud WebDAV using server-side Basic Auth credentials
 * and streams it to the client. The ownCloud credentials are never exposed.
 *
 * Security:
 *   - Filename is validated against a strict allowlist pattern before use.
 *   - Path separators and traversal sequences are rejected.
 *   - Only .pdf files are served.
 */

import type { NextRequest } from "next/server";
import { buildFileUrl, buildAuthHeader } from "@/lib/api/owncloud";

export const dynamic = "force-dynamic";

// Allow only safe filenames: letters, digits, hyphens, underscores, spaces,
// dots — no slashes, no "..", must end in .pdf
const SAFE_FILENAME = /^[\w\- .]+\.pdf$/i;

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file");

  if (!file) {
    return new Response("Missing file parameter", { status: 400 });
  }

  if (!SAFE_FILENAME.test(file)) {
    return new Response("Invalid file name", { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(buildFileUrl(file), {
      headers: { Authorization: buildAuthHeader() },
    });
  } catch {
    return new Response("Failed to reach ownCloud", { status: 502 });
  }

  if (!upstream.ok) {
    return new Response("PDF not found", { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${file}"`,
      // Allow browsers to cache the proxied PDF for 1 hour
      "Cache-Control": "private, max-age=3600",
    },
  });
}
