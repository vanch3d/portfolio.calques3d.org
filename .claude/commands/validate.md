Run all project validation checks and report results.

## Steps

1. Run `npm run validate:content` — validates all JSON files in `src/content/` against their JSON Schema definitions in `src/schemas/`.
2. Run `npm run validate:diagrams` — checks all Mermaid diagrams in `src/content/` and `.docs/` for syntax errors.
3. Run `npx tsc --noEmit` — TypeScript type check with no output files.
4. Report a summary: how many checks passed, any failures with file and line references.

If any check fails, show the exact error and suggest a fix before proceeding. Do not commit or push if validation fails.
