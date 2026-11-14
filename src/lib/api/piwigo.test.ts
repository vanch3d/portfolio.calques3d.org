import { afterEach, describe, expect, it, vi } from 'vitest'
import { getPiwigoImage, parsePiwigoBody } from './piwigo'

const NOISE =
  '<br />\n<b>Deprecated</b>:  Function create_function() is deprecated in <b>/x.php</b> on line <b>1</b><br />\n'

const OK_BODY = JSON.stringify({
  stat: 'ok',
  result: {
    id: 28,
    name: 'c3d-wireframe',
    comment: 'Wireframe visualisation',
    width: 800,
    height: 592,
    element_url: 'https://gallery.calques3d.org/upload/2014/04/21/x.png',
  },
})

afterEach(() => vi.unstubAllGlobals())

describe('parsePiwigoBody', () => {
  it('parses clean JSON', () => {
    expect(parsePiwigoBody('{"stat":"ok"}')).toEqual({ stat: 'ok' })
  })

  it('skips PHP warning noise before the JSON', () => {
    expect(parsePiwigoBody(`${NOISE}{"stat":"ok"}`)).toEqual({ stat: 'ok' })
  })

  it('throws when there is no JSON at all', () => {
    expect(() => parsePiwigoBody('<b>fatal</b>')).toThrow()
  })
})

describe('getPiwigoImage', () => {
  it('maps a noisy ok response to a PiwigoImage', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(NOISE + OK_BODY)))
    const img = await getPiwigoImage(28)
    expect(img).toEqual({
      id: 28,
      src: 'https://gallery.calques3d.org/upload/2014/04/21/x.png',
      width: 800,
      height: 592,
      name: 'c3d-wireframe',
      comment: 'Wireframe visualisation',
    })
  })

  it('returns null when stat is fail', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"stat":"fail"}')))
    expect(await getPiwigoImage(9999)).toBeNull()
  })

  it('returns null on network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    expect(await getPiwigoImage(1)).toBeNull()
  })

  it('returns null on a non-2xx response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 500 })))
    expect(await getPiwigoImage(1)).toBeNull()
  })
})
