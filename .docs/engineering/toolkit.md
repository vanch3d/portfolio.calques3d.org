# Engineering Toolkit

Documentation of the tools, agents, skills, and workflow conventions used in the development of this project.

---

## AI-assisted development

### Claude Code

This project uses [Claude Code](https://claude.ai/code) (CLI + WebStorm integration) as the primary AI engineering assistant.

**Model:** Claude Sonnet 4.6
**Session management:** Sessions are scoped to the project directory. Resume with:
```bash
claude --resume <session-id>
```
Session memory is persisted in `~/.claude/projects/<project>/memory/` and loaded automatically in future sessions.

**Skills configured:** *(none yet — scaffold below)*

**Agents used:**
- `Explore` — codebase exploration, multi-file search, external URL fetching
- `Plan` — architecture and implementation planning
- `claude-code-guide` — questions about Claude Code features and APIs
- `general-purpose` — research tasks, multi-step investigations

---

## Local scripts

All scripts live in `scripts/` and are registered in `package.json`.

| Script | Command | Purpose |
|---|---|---|
| Content validation | `npm run validate:content` | Validates JSON content files against JSON Schema |
| Diagram validation | `npm run validate:diagrams` | Checks Mermaid diagrams for syntax errors |
| Full validation | `npm run validate` | Runs both of the above |
| Type generation | `npm run generate:types` | *(placeholder)* Will generate `src/types/` from JSON Schema |

---

## Validation pipeline

### Content validation (`scripts/validate-content.mjs`)
- Uses AJV 8 (draft 2020-12) with `ajv-formats`
- Validates all `.json` files in `src/content/` against schemas in `src/schemas/`
- Extend by uncommenting additional `validateDir()` calls as new content dirs are added

### Diagram validation (`scripts/validate-diagrams.mjs`)
- Scans `src/content/` and `.docs/` for ` ```mermaid ` blocks
- Uses `@mermaid-js/parser` for types it supports (gitGraph, pie, packet, architecture, etc.)
- Uses structural checks for DOM-dependent types (flowchart, sequenceDiagram, etc.)
- **Migration path:** once Playwright is installed for E2E tests, switch to `rehype-mermaid` in `next.config.ts` for build-time SVG rendering — this also provides full parse validation at build time

---

## Mermaid conventions

> Mermaid diagrams are used in MDX content files and ADRs.

**Always quote node labels containing:** `/` `*` `@`

These characters cause parse errors when unquoted. The diagram validator will catch them.

```
WRONG:  MDX[src/content/*.mdx]
RIGHT:  MDX["src/content/*.mdx"]

WRONG:  IA[/api/revalidate]
RIGHT:  IA["/api/revalidate"]
```

**Supported diagram types in content:**
- `flowchart` — system/data flow diagrams (structural validation only)
- `sequenceDiagram` — interaction flows (structural validation only)
- `gitGraph` — full parse validation via `@mermaid-js/parser`

---

## WebStorm configuration

- **Mermaid plugin:** Install the [Mermaid plugin for JetBrains](https://plugins.jetbrains.com/plugin/20146-mermaid) for live diagram preview in `.md` and `.mdx` files. This is the primary way to catch diagram parse errors in the IDE before commit.
- **ESLint:** Configured via `eslint-config-next` — runs on save
- **TypeScript:** Strict mode, no `any` types

---

## Planned additions

- [ ] Claude Code skills for common workflows (e.g. `validate`, `new-adr`, `new-project`)
- [ ] GitHub Actions CI workflow integrating `npm run validate` and `npm run build`
- [ ] Playwright install and migration to `rehype-mermaid` for build-time diagram rendering
- [ ] `json-schema-to-typescript` pipeline to generate `src/types/` from `src/schemas/`
- [ ] OpenAPI specs (`src/openapi/`) and generated API clients

---

## Decision log

Architecture decisions are documented as ADRs in `.docs/adr/`. See the [ADR index](./../adr/) for the full list.

Key decisions relevant to the toolkit:
- **ADR 002** — Testing strategy (Vitest, Cypress, Playwright, MSW)
- **ADR 003** — API layer (OpenAPI specs, generated clients, TanStack Query for CSR)
