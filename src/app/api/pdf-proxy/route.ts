/**
 * /api/pdf-proxy — authenticated GitHub Release PDF proxy.
 *
 * The publication PDFs are stored in a private GitHub repository's Release
 * assets. GitHub returns 404 for direct download URLs (`github.com/…/releases/
 * download/…`) when fetched server-side without a browser session, even for
 * public releases in private repos.
 *
 * The correct approach is the GitHub API endpoint with an OAuth token and
 * Accept: application/octet-stream — GitHub then redirects to a signed CDN URL.
 *
 * Flow:
 *  1. Receive the browser_download_url as ?url= query param
 *  2. Extract the filename and look up its asset ID via the release API
 *     (asset list is cached for the server process lifetime — one fetch)
 *  3. Fetch the asset bytes via the API with auth
 *  4. Stream to the browser with Content-Type: application/pdf
 *
 * Security: strict allowlist on the ?url= param — only our own release is
 * accepted. Callers cannot use this proxy to exfiltrate arbitrary GitHub content.
 *
 * Required env vars:
 *   GITHUB_TOKEN — fine-grained PAT with read access to the repo's contents
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const OWNER = "vanch3d";
const REPO = "portfolio.calques3d.org";
const RELEASE_TAG = "publications-pdfs";
const GITHUB_API = "https://api.github.com";

const ALLOWED_PREFIX = `https://github.com/${OWNER}/${REPO}/releases/download/${RELEASE_TAG}/`;

// Module-level asset cache: filename → asset ID.
// Populated once per server process lifetime — release assets don't change.
let assetCache: Map<string, number> | null = null;

async function getAssetId(filename: string, token: string): Promise<number | null> {
  if (!assetCache) {
    const res = await fetch(
      `${GITHUB_API}/repos/${OWNER}/${REPO}/releases/tags/${RELEASE_TAG}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!res.ok) return null;

    const data: { assets: Array<{ name: string; id: number }> } = await res.json();
    assetCache = new Map(data.assets.map((a) => [a.name, a.id]));
  }

  return assetCache.get(filename) ?? null;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  if (!url.startsWith(ALLOWED_PREFIX)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return new NextResponse("Server misconfigured: missing GITHUB_TOKEN", {
      status: 500,
    });
  }

  const filename = url.slice(ALLOWED_PREFIX.length);

  const assetId = await getAssetId(filename, token);
  if (assetId === null) {
    return new NextResponse("PDF not found", { status: 404 });
  }

  let assetRes: Response;
  try {
    // GitHub API: fetch asset bytes with Accept: application/octet-stream.
    // GitHub returns a 302 to a signed CDN URL; fetch() follows it automatically.
    assetRes = await fetch(
      `${GITHUB_API}/repos/${OWNER}/${REPO}/releases/assets/${assetId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/octet-stream",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
  } catch {
    return new NextResponse("Failed to fetch PDF from GitHub", { status: 502 });
  }

  if (!assetRes.ok) {
    return new NextResponse("PDF fetch failed", { status: assetRes.status });
  }

  return new NextResponse(assetRes.body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      // PDFs are immutable once the release is published
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}
