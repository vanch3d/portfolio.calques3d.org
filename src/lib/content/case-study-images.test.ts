import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/api/piwigo', () => ({
  getPiwigoImage: vi.fn(async (id: number) =>
    id === 28
      ? { id: 28, src: 'https://g/x.png', width: 800, height: 592, name: 'n', comment: 'cmt' }
      : null
  ),
}))

import {
  extractImageRefs,
  piwigoIdFromRef,
  localImageSrc,
  resolveCaseStudyImages,
} from './case-study-images'

describe('extractImageRefs', () => {
  it('accepts single-quoted titles (Prettier rewrites double quotes in MDX)', () => {
    expect(extractImageRefs("![a](images/28-x.png 'cap')")).toEqual(['images/28-x.png'])
  })

  it('finds images with and without a title, deduplicated', () => {
    const src = [
      '![a](images/28-x.png "cap")',
      'text ![b](images/openessayist-y.png) more',
      '![a again](images/28-x.png)',
      '![remote](https://example.com/z.png)',
    ].join('\n')
    expect(extractImageRefs(src)).toEqual(['images/28-x.png', 'images/openessayist-y.png'])
  })
})

describe('piwigoIdFromRef', () => {
  it('reads the numeric filename prefix', () => {
    expect(piwigoIdFromRef('images/28-20140421113730-fb3528ad.png')).toBe(28)
  })
  it('returns null for local files', () => {
    expect(piwigoIdFromRef('images/openessayist-overview.png')).toBeNull()
  })
})

describe('localImageSrc', () => {
  it('maps to the public folder keyed by case directory', () => {
    expect(localImageSrc('open--ess', 'images/a.png')).toBe('/images/case-studies/open--ess/a.png')
  })
})

describe('resolveCaseStudyImages', () => {
  it('resolves Piwigo ids via the API and drops unresolvable ones', async () => {
    const map = await resolveCaseStudyImages('whatever', [
      '![a](images/28-x.png)\n![b](images/999-missing.png)\n![c](images/not-on-disk.png)',
    ])
    expect(map['images/28-x.png']).toEqual({
      src: 'https://g/x.png',
      width: 800,
      height: 592,
      comment: 'cmt',
    })
    expect(map['images/999-missing.png']).toBeUndefined()
    expect(map['images/not-on-disk.png']).toBeUndefined()
  })

  it('resolves a local image that exists in public/', async () => {
    const map = await resolveCaseStudyImages('openessayist--essay-visualisation', [
      '![o](images/openessayist-overview.png)',
    ])
    expect(map['images/openessayist-overview.png']?.src).toBe(
      '/images/case-studies/openessayist--essay-visualisation/openessayist-overview.png'
    )
  })
})
