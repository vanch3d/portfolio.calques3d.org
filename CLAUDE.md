@AGENTS.md

# CLAUDE.md — nextjs-vanch-website

> Project constitution for Claude Code. Overrides all default Claude behavior.
> Keep this file under 200 lines. Deep dives live in `.docs/` and `.claude/rules/`.

---

## WHY

Personal professional portfolio for Nicolas Van Labeke with two goals:

1. **Showcase** — academic R&D (publications, AIED projects 1996–2017) and frontend engineering career
2. **Learn** — each site section intentionally uses a different Next.js rendering mode (SSG, SSR, ISR, CSR) as a hands-on exercise

The site is itself an engineering artefact: the GitHub repo, CI pipeline, ADRs, and test coverage are part of what is being demonstrated.

---

## WHAT

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
**Deploy:** Vercel (primary) → `portfolio.calques3d.org` · GitHub: `vanch3d/portfolio.calques3d.org`
**Content:** MDX + JSON in `src/content/` · Publications via Zotero API (SSG + `unstable_cache`)

```
src/
  app/          # App Router: thin page.tsx shells + co-located components
  components/   # Shared UI primitives (src/components/ui/)
  lib/
    content/    # Local file readers (positions, research, engineering)
    api/        # External API wrappers (Zotero, Piwigo, Speakerdeck)
  types/        # TypeScript types (generated from src/schemas/ — see generate:types)
  schemas/      # JSON Schema definitions — source of truth for content types
  content/
    positions/  # Employment/academic positions (JSON)
    research/   # Research project narratives (MDX)
    engineering/# Engineering project case studies (MDX)
    cv/         # Skills and education (JSON)
.docs/
  adr/          # Architecture Decision Records — also rendered on the site
  design/       # Design specs
  engineering/  # Engineering notes (toolkit, conventions)
.claude/
  commands/     # Slash commands: /validate
  rules/        # Domain rule files (created when CLAUDE.md grows too large)
```

---

## HOW

### graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

### Key commands

```bash
npm run dev              # local dev server
npm run build            # production build
npm run validate         # run all validation (content schema + Mermaid diagrams + tsc)
npm run validate:content # JSON schema validation only
npm run validate:diagrams# Mermaid syntax check only
npm run test:zotero      # test live Zotero API fetch + transformation
```

### Slash commands

| Command     | Purpose                           |
| ----------- | --------------------------------- |
| `/validate` | Run all checks and report results |

### Rendering strategy (intentional — document in ADR when adding a new route)

| Section               | Mode | Reason                                                            |
| --------------------- | ---- | ----------------------------------------------------------------- |
| `/research/[slug]`    | SSG  | Frozen content                                                    |
| `/engineering/[slug]` | SSG  | Stable once written                                               |
| `/publications`       | SSG  | Zotero API via `unstable_cache`, on-demand revalidation (ADR 023) |
| `/cv`                 | ISR  | Changes with career                                               |
| `/experiments/[slug]` | CSR  | D3.js visualisations                                              |

---

## Conventions

- **No `any` types.** All shapes in `src/types/` (generated from `src/schemas/`).
- **`page.tsx` is a thin shell.** Logic and JSX in co-located named component files.
- **Component naming:** PascalCase files, named function declaration exports.
- **Test co-location:** `ResearchProjectDetail.spec.cy.tsx` beside `ResearchProjectDetail.tsx`.
  Extract any sub-component from `page.tsx` the moment it needs a test.
- **Mermaid:** use the `/mermaid` skill when authoring any diagram. Run `/validate` before committing.
- **Content changes:** always run `/validate` after editing MDX/JSON.
- **ADRs:** one per significant decision, `NNN-short-title.md`, frontmatter required. Use `adr-skill`.
  **ADR directory:** `.docs/adr/` — always pass `--dir .docs/adr` to adr-skill scripts (not in the skill's default detection list).
- **Scripts:** write **exploratory**/utility code to `scripts/*.mjs`, never inline `node -e`.
- **Temp files:** use `.local/tmp/` for ephemeral agent-generated files (bodies, reports). Never use `/tmp/` — it does not exist on Windows. `.local/` is gitignored; `.local/tmp/` is not cleaned by the OS but is safe to delete at any time.
- **Git worktrees:** place at `../pr-before-worktree` (sibling to the project root). Never use `/tmp/` paths for worktrees — same Windows reason.
- **Accessibility:** components must pass axe-core WCAG 2.1 AA with zero violations.
  Every CT spec needs `cy.mountAccessible()` + `cy.checkA11y()`. Every E2E page needs
  `cy.injectAxe()` in `beforeEach`. See @.claude/rules/accessibility.md · ADR 007.
- **i18n:** every user-facing string must come from `messages/en.json` via next-intl.
  Every component owns its own namespace — Server Components use `getTranslations()`,
  Client Components use `useTranslations()`. No labels props.
  `cy.mountAccessible()` provides the i18n context in CT automatically.
  See @.claude/rules/i18n.md · ADR 006.
- **Components:** `_components/` prefix inside App Router dirs; Props suffix on all prop types;
  only export types imported by other files; className for `@theme` values, style for the rest.
  See @.claude/rules/components.md · ADR 004.
- **Tailwind & tokens:** every style value must trace back to a design token — no raw hex, no
  magic numbers, no `var()` inside className. Three-tier architecture: primitive → semantic →
  `@theme inline`. Custom utilities use `@utility` with plain CSS (no `@apply`).
  See @.claude/rules/tailwind.md.

See ADR 004 (component conventions) · ADR 005 (Claude Code config) · ADR 006 (i18n) · ADR 007 (a11y) · `CONTRIBUTING.md`

---

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for `vanch3d/portfolio.calques3d.org` (`gh` CLI). PRs are also a request surface. See `.docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` at repo root, ADRs in `.docs/adr/`. See `.docs/agents/domain.md`.

### Specialised agents

Three project agents defined in `.claude/agents/`:

| Agent             | When to invoke                                                                  |
| ----------------- | ------------------------------------------------------------------------------- |
| `design-director` | Creating or iterating on design comps, impeccable workflow, comp approval       |
| `nextjs-engineer` | Implementing components, pages, utilities — owns the full PR process            |
| `tester`          | Spawned by `nextjs-engineer` after writing a component + spec; makes tests pass |

Two commands in `.claude/commands/`:

- `/comp-server [start|stop|status]` — manage the comp preview server at port 5001
- `/comp-approve <filename>` — approve a draft comp, commit it, update the surface brief

### Engineering process

**Pragmatic TDD:** every component and utility ships with a co-located test. The test narrative is written when the component is created. Test execution is delegated to the `tester` sub-agent and runs in parallel. See `.claude/agents/nextjs-engineer.md` for the full process and done criteria.

**Comp-led development:** no coding session starts on a new surface without an approved comp in `.docs/design/comps/`. See `.claude/agents/design-director.md` for the comp lifecycle.

---

## Reference sources (content gathering)

- Old website: https://nvl.calques3d.org/ · source: https://github.com/vanch3d/nvl-slim/
- CV: `.local/vanlabeke cv (march 26).docx`
- Content issues log: `.local/content-issues.md`
- Planning log: `.local/planning/`
