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

const IMAGE_MD = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g

/**
 * Image references of one case-study folder that cannot resolve: a path that
 * does not start with `images/`, or a local (non-Piwigo) file missing from
 * public/images/case-studies/<folder>/. Piwigo images (numeric id prefix) are
 * resolved at build time and are not checked here.
 */
function imageProblems(folderPath, folderName) {
  const problems = []
  const files = readdirSync(folderPath).filter((f) => /\.mdx?$/.test(f))
  for (const file of files) {
    const source = readFileSync(join(folderPath, file), 'utf8')
    for (const match of source.matchAll(IMAGE_MD)) {
      const ref = match[1]
      if (/^https?:\/\//.test(ref)) continue
      if (!ref.startsWith('images/')) {
        problems.push(`${file}: image path must start with "images/": ${ref}`)
        continue
      }
      const name = ref.split('/').pop()
      if (/^\d+-/.test(name)) continue
      if (!existsSync(join(root, 'public/images/case-studies', folderName, name))) {
        problems.push(
          `${file}: local image not found in public/images/case-studies/${folderName}/: ${name}`
        )
      }
    }
  }
  return problems
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
      // Chaptered cases: every referenced file must exist, chapter slugs must be unique.
      const referenced = [
        data.intro,
        data.outro,
        ...(data.chapters ?? []).map((c) => c.file),
      ].filter(Boolean)
      const missing = referenced.filter(
        (f) =>
          !existsSync(join(root, dir, entry.name, `${f}.md`)) &&
          !existsSync(join(root, dir, entry.name, `${f}.mdx`))
      )
      const slugs = (data.chapters ?? []).map((c) => c.slug)
      const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i)
      const imageIssues = imageProblems(join(root, dir, entry.name), entry.name)
      if (missing.length || dupes.length || imageIssues.length) {
        console.error(`\nFAIL: ${dir}/${entry.name}/index.mdx`)
        for (const f of missing) console.error(`  chapter file not found: ${f}`)
        for (const s of dupes) console.error(`  duplicate chapter slug: ${s}`)
        for (const p of imageIssues) console.error(`  ${p}`)
        failures++
      } else {
        console.log(`  ok  ${dir}/${entry.name}/index.mdx`)
      }
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
