/**
 * Validates all content JSON files against their JSON Schema definitions.
 * Run with: node scripts/validate-content.mjs
 * Intended for use in CI and as a pre-build check.
 */

import Ajv from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import { readFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

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
  const files = readdirSync(join(root, dir)).filter(f => f.endsWith('.json'))

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

let totalFailures = 0

console.log('\nValidating positions...')
totalFailures += validateDir('position', 'src/content/positions')

// Future: add project and other content dirs as files are added
// console.log('\nValidating research projects...')
// totalFailures += validateDir('project', 'src/content/research')

if (totalFailures > 0) {
  console.error(`\n${totalFailures} file(s) failed validation.`)
  process.exit(1)
} else {
  console.log('\nAll content files valid.')
}
