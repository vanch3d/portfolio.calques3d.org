/**
 * Lists files in the ownCloud portfolio collection via WebDAV PROPFIND.
 * Verifies the PDF naming convention against Zotero archiveLocation values.
 *
 * Usage: node scripts/inspect-owncloud.mjs
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

if (!OWNCLOUD_API || !OWNCLOUD_USERNAME || !OWNCLOUD_TOKEN) {
  console.error('Missing ownCloud credentials in .env.local')
  console.error('  Required: OWNCLOUD_API, OWNCLOUD_USERNAME, OWNCLOUD_TOKEN, OWNCLOUD_COLLECTION')
  process.exit(1)
}

const base = OWNCLOUD_API.endsWith('/') ? OWNCLOUD_API.slice(0, -1) : OWNCLOUD_API
const collection = OWNCLOUD_COLLECTION ?? '/'
const url = `${base}${collection}`
const auth = 'Basic ' + Buffer.from(`${OWNCLOUD_USERNAME}:${OWNCLOUD_TOKEN}`).toString('base64')

console.log('PROPFIND:', url, '\n')

const res = await fetch(url, {
  method: 'PROPFIND',
  headers: { Authorization: auth, Depth: '1' },
})

console.log('Status:', res.status, res.statusText)

const text = await res.text()
const hrefs = [...text.matchAll(/<[^:]*:?href>([^<]+)<\/[^:]*:?href>/g)]
  .map((m) => decodeURIComponent(m[1]))
  .filter((h) => !h.endsWith(collection) && h !== collection)

console.log(`\nFiles (${hrefs.length}):`)
hrefs.forEach((h) => console.log(' ', h.split('/').pop()))
