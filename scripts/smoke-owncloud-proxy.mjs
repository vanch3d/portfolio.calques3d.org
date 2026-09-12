/**
 * Smoke test: fetches a known PDF directly from ownCloud using the same
 * logic as /api/pdf-proxy to verify credentials and URL construction work.
 *
 * Usage: node scripts/smoke-owncloud-proxy.mjs
 * Requires: .env.local with OWNCLOUD_API, OWNCLOUD_USERNAME, OWNCLOUD_TOKEN, OWNCLOUD_COLLECTION
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const root = join(fileURLToPath(import.meta.url), '../..')
const env = Object.fromEntries(
  readFileSync(join(root, '.env.local'), 'utf-8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const { OWNCLOUD_API, OWNCLOUD_USERNAME, OWNCLOUD_TOKEN, OWNCLOUD_COLLECTION } = env

const base = (OWNCLOUD_API ?? '').replace(/\/$/, '')
const collection = OWNCLOUD_COLLECTION ?? '/'
const auth = 'Basic ' + Buffer.from(`${OWNCLOUD_USERNAME}:${OWNCLOUD_TOKEN}`).toString('base64')

const testFiles = ['2016.IMS.myPAL.pdf', '2015.NHS.backpack.pdf', '2009.ITAG.Intrinsic.pdf']

for (const filename of testFiles) {
  const url = `${base}${collection}${encodeURIComponent(filename)}`
  const res = await fetch(url, { headers: { Authorization: auth } })
  const contentType = res.headers.get('content-type') ?? ''
  const bytes = res.headers.get('content-length') ?? 'unknown'
  const ok = res.status === 200 && contentType.includes('pdf')
  console.log(ok ? '✓' : '✗', res.status, filename, `(${bytes} bytes, ${contentType})`)
}
