/**
 * Validates all content JSON files against their JSON Schema definitions.
 * Run with: node scripts/validate-content.mjs
 * Intended for use in CI and as a pre-build check.
 */

import Ajv from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import { existsSync, readFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')

const ajv = new Ajv({ strict: false, allErrors: true, validateSchema: false })
addFormats(ajv)

// Load shared $defs first so $ref resolution works
const shared = JSON.parse(readFileSync(join(root, 'src/schemas/shared.schema.json'), 'utf8'))
ajv.addSchema(shared)

function loadSchema(name) {
  return JSON.parse(readFileSync(join(root, `src/schemas/${name}.schema.json`), 'utf8'))
}

function validateDir(schemaName, dir) {
  const schema = loadSchema(schemaName)
  const validate = ajv.compile(schema)
  const files = readdirSync(join(root, dir)).filter((f) => f.endsWith('.json'))

  let failures = 0
  for (const file of files) {
    const filePath = join(root, dir, file)
    const data = JSON.parse(readFileSync(filePath, 'utf8'))
    if (!validate(data)) {
      console.error(`\nFAIL: ${dir}/${file}`)
      for (const err of validate.errors) {
        console.error(`  ${err.instancePath || '(root)'}: ${err.message}`)
      }
      failures++
    } else {
      console.log(`  ok  ${dir}/${file}`)
    }
  }
  return failures
}

/**
 * Validates MDX frontmatter in a flat directory of subdirectories.
 * Each subdirectory must contain an index.mdx; its frontmatter is validated
 * against the given schema.
 */
function validateMdxDir(schemaName, dir) {
  const schema = loadSchema(schemaName)
  const validate = ajv.compile(schema)
  const entries = readdirSync(join(root, dir), { withFileTypes: true }).filter((e) =>
    e.isDirectory()
  )

  let failures = 0
  for (const entry of entries) {
    const filePath = join(root, dir, entry.name, 'index.mdx')
    if (!existsSync(filePath)) continue // skip draft/source directories without index.mdx
    const raw = readFileSync(filePath, 'utf8')
    const { data } = matter(raw)
    if (!validate(data)) {
      console.error(`\nFAIL: ${dir}/${entry.name}/index.mdx`)
      for (const err of validate.errors) {
        console.error(`  ${err.instancePath || '(root)'}: ${err.message}`)
      }
      failures++
    } else {
      console.log(`  ok  ${dir}/${entry.name}/index.mdx`)
    }
  }
  return failures
}

let totalFailures = 0

console.log('\nValidating positions...')
totalFailures += validateDir('position', 'src/content/positions')

console.log('\nValidating case studies...')
totalFailures += validateMdxDir('case-study', 'src/content/case-studies')

if (totalFailures > 0) {
  console.error(`\n${totalFailures} file(s) failed validation.`)
  process.exit(1)
} else {
  console.log('\nAll content files valid.')
}
