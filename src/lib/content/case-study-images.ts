/**
 * Resolves the images a case study references in its MDX source.
 *
 * Authors write `![alt](images/28-20140421113730-fb3528ad.png "caption")`.
 *  - A leading numeric id (`28-…`) is the Piwigo image id → metadata comes from
 *    the Piwigo API (src/lib/api/piwigo.ts, temporary workaround).
 *  - Anything else is a local file, served from
 *    public/images/case-studies/{dir}/{file} (copy it there; temporary home
 *    until the image is uploaded to Piwigo).
 *
 * Resolution is async and happens ONCE at page level (ADR 021: nothing async
 * below page.tsx); the resulting map is handed to the sync MDX `img` override.
 *
 * Server-side only. Rendering: SSG
 */

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { getPiwigoImage } from '@/lib/api/piwigo'

export interface CaseStudyImage {
  src: string
  width?: number
  height?: number
  /** Piwigo's own comment, used as caption when the MDX gives no title. */
  comment?: string
}

export type CaseStudyImageMap = Record<string, CaseStudyImage>

const IMAGE_REF = /!\[[^\]]*\]\((images\/[^)\s]+)(?:\s+"[^"]*")?\)/g

/** Distinct `images/...` references found in markdown source. */
export function extractImageRefs(source: string): string[] {
  const refs = new Set<string>()
  for (const m of source.matchAll(IMAGE_REF)) refs.add(m[1])
  return [...refs]
}

/** Piwigo id encoded as the filename prefix (`28-2014….png` → 28), else null. */
export function piwigoIdFromRef(ref: string): number | null {
  const file = ref.split('/').pop() ?? ''
  const m = /^(\d+)-/.exec(file)
  return m ? Number(m[1]) : null
}

/** Public URL of a local (non-Piwigo) case-study image. */
export function localImageSrc(dir: string, ref: string): string {
  return `/images/case-studies/${dir}/${ref.split('/').pop()}`
}

/**
 * Builds the ref → image map for the given MDX sources. Unresolvable refs
 * are simply absent from the map (the renderer shows a placeholder).
 */
export async function resolveCaseStudyImages(
  dir: string,
  sources: string[]
): Promise<CaseStudyImageMap> {
  const refs = [...new Set(sources.flatMap(extractImageRefs))]
  const entries = await Promise.all(
    refs.map(async (ref): Promise<[string, CaseStudyImage] | null> => {
      const id = piwigoIdFromRef(ref)
      if (id !== null) {
        const img = await getPiwigoImage(id)
        if (!img) return null
        return [
          ref,
          {
            src: img.src,
            width: img.width,
            height: img.height,
            comment: img.comment ?? undefined,
          },
        ]
      }
      const publicPath = join(process.cwd(), 'public', localImageSrc(dir, ref))
      return existsSync(publicPath) ? [ref, { src: localImageSrc(dir, ref) }] : null
    })
  )
  return Object.fromEntries(entries.filter((e): e is [string, CaseStudyImage] => e !== null))
}
