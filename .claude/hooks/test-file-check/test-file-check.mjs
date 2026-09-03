#!/usr/bin/env node
/**
 * test-file-check.mjs
 *
 * @author  vanch3d
 * @version 1.0
 *
 * Claude Code PostToolUse hook — after a component or utility file is written,
 * checks that a co-located test file exists. Warns if missing.
 *
 * Convention (from nextjs-engineer agent):
 *   src/components/<domain>/Foo.tsx  →  src/components/<domain>/Foo.cy.tsx
 *   src/lib/my-util.ts               →  src/lib/my-util.test.ts
 *
 * Input:  JSON on stdin  { tool_name, tool_input: { file_path } }
 * Output: JSON on stdout { systemMessage } when test file is missing (advisory)
 * Exit:   0 always — this is a reminder, not a hard block.
 *
 * Skips: test files themselves, page.tsx / layout.tsx / loading.tsx / error.tsx,
 *        type-only files, files outside src/components and src/lib.
 */

import fs from 'node:fs';
import path from 'node:path';

const COMPONENT_RE = /src[\\/]components[\\/].+\.tsx$/;
const LIB_RE       = /src[\\/]lib[\\/].+\.ts$/;
const SKIP_RE      = /\.(cy|test|spec)\.(ts|tsx)$|[\\/](page|layout|loading|error|not-found|template)\.(tsx?)$/;
const TYPE_RE      = /\.d\.ts$/;

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf-8');
}

const raw = await readStdin();
let data;
try { data = JSON.parse(raw); } catch { process.exit(0); }

const filePath = (data?.tool_input?.file_path ?? '').replace(/\\/g, '/');

if (!filePath || TYPE_RE.test(filePath) || SKIP_RE.test(filePath)) {
  process.exit(0);
}

let expectedTest = null;

if (COMPONENT_RE.test(filePath)) {
  // Foo.tsx → Foo.cy.tsx
  expectedTest = filePath.replace(/\.tsx$/, '.cy.tsx');
} else if (LIB_RE.test(filePath)) {
  // my-util.ts → my-util.test.ts
  expectedTest = filePath.replace(/\.ts$/, '.test.ts');
} else {
  process.exit(0);
}

const absPath = path.resolve(process.cwd(), expectedTest);
if (fs.existsSync(absPath)) {
  process.exit(0); // test file present — silent pass
}

console.log(JSON.stringify({
  systemMessage: `No co-located test file found for ${filePath}.\nExpected: ${expectedTest}\nWrite the test file now (pragmatic TDD — see nextjs-engineer agent).`,
}));
process.exit(0);
