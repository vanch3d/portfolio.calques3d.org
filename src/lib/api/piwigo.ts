/**
 * Piwigo API wrapper (gallery.calques3d.org) — image metadata for case studies.
 *
 * TEMPORARY WORKAROUND — remove once the Piwigo instance is upgraded.
 * The instance runs Piwigo 2.9.2 on a PHP version that prints `Deprecated`
 * HTML warnings *before* the JSON body, so `response.json()` throws. The
 * parser below skips to the first `{`. After the upgrade, replace
 * `parsePiwigoBody` with a plain `res.json()` (or the generated client from
 * src/openapi/piwigo.yaml, ADR 003) and delete this notice.
 *
 * Server-side only. Rendering: SSG (fetched at build time by the case-study
 * pages; revalidated daily if the page is regenerated).
 */

const PIWIGO_BASE = 'https://gallery.calques3d.org/ws.php'

export interface PiwigoImage {
  id: number
  src: string // original image URL
  width: number
  height: number
  name: string
  comment: string | null
}

interface PiwigoImageInfoResponse {
  stat: 'ok' | 'fail'
  result?: {
    id: number
    name: string | null
    comment: string | null
    width: number
    height: number
    element_url: string
  }
}

/** Strips any PHP warning noise preceding the JSON payload (see header). */
export function parsePiwigoBody(body: string): unknown {
  const start = body.indexOf('{')
  if (start === -1) throw new Error('Piwigo response contains no JSON object')
  return JSON.parse(body.slice(start))
}

/**
 * Fetch one image's metadata. Returns null on any failure (network, non-ok
 * stat, unknown id) so a missing image degrades to a placeholder instead of
 * failing the whole page.
 */
export async function getPiwigoImage(id: number): Promise<PiwigoImage | null> {
  try {
    const url = `${PIWIGO_BASE}?format=json&method=pwg.images.getInfo&image_id=${id}`
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) return null
    const data = parsePiwigoBody(await res.text()) as PiwigoImageInfoResponse
    if (data.stat !== 'ok' || !data.result) return null
    const r = data.result
    return {
      id: r.id,
      src: r.element_url,
      width: r.width,
      height: r.height,
      name: r.name ?? '',
      comment: r.comment,
    }
  } catch {
    return null
  }
}
