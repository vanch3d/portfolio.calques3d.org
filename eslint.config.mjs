import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Non-source directories — hooks, scripts, design tooling, docs
    '.claude/**',
    'scripts/**',
    '.impeccable/**',
    '.docs/**',
    '.local/**',
  ]),
  // Cypress support files use `declare global { namespace Cypress { ... } }` for
  // global type augmentation — the officially recommended Cypress pattern.
  // allowDeclarations permits declare-only namespaces; namespace implementations
  // remain blocked everywhere.
  {
    files: ['cypress/support/**/*.ts'],
    rules: {
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
    },
  },
])

export default eslintConfig
