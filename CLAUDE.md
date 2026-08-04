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
**Content:** MDX + JSON in `src/content/` · Publications via Zotero API (ISR)

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
  commands/     # Slash commands: /validate /new-adr /new-project
  rules/        # Domain rule files (created when CLAUDE.md grows too large)
```

---

## HOW

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

| Command | Purpose |
|---|---|
| `/validate` | Run all checks and report results |
| `/new-adr <title>` | Scaffold a new ADR with correct numbering |
| `/new-project <slug> <type>` | Scaffold a new MDX project file |

### Rendering strategy (intentional — document in ADR when adding a new route)

| Section | Mode | Reason |
|---|---|---|
| `/research/[slug]` | SSG | Frozen content |
| `/engineering/[slug]` | SSG | Stable once written |
| `/research/publications` | ISR | Zotero API, on-demand revalidation |
| `/cv` | ISR | Changes with career |
| `/experiments/[slug]` | CSR | D3.js visualisations |

---

## Conventions

- **No `any` types.** All shapes in `src/types/` (generated from `src/schemas/`).
- **`page.tsx` is a thin shell.** Logic and JSX in co-located named component files.
- **Component naming:** PascalCase files, named function declaration exports.
- **Test co-location:** `ResearchProjectDetail.spec.cy.tsx` beside `ResearchProjectDetail.tsx`.
  Extract any sub-component from `page.tsx` the moment it needs a test.
- **Mermaid:** quote labels containing `/` `*` `@`. Run `/validate` before committing.
- **Content changes:** always run `/validate` after editing MDX/JSON.
- **ADRs:** one per significant decision, `NNN-short-title.md`, frontmatter required. Use `/new-adr`.
- **Scripts:** write exploratory/utility code to `scripts/*.mjs`, never inline `node -e`.
- **Accessibility:** components must pass axe-core WCAG 2.1 AA with zero violations.
  Every CT spec needs `cy.mountAccessible()` + `cy.checkA11y()`. Every E2E page needs
  `cy.injectAxe()` in `beforeEach`. See @.claude/rules/accessibility.md · ADR 007.
- **i18n:** every user-facing string must come from `messages/en.json` via next-intl.
  Pages use `getTranslations()`, Client Components use `useTranslations()`.
  Sub-components receive a typed `labels` prop resolved by the parent page.
  See @.claude/rules/i18n.md · ADR 006.

See ADR 004 (component conventions) · ADR 005 (Claude Code config) · ADR 006 (i18n) · ADR 007 (a11y) · `.docs/engineering/toolkit.md`

---

## Reference sources (content gathering)

- Old website: https://nvl.calques3d.org/ · source: https://github.com/vanch3d/nvl-slim/
- CV: `.local/vanlabeke cv (march 26).docx`
- Content issues log: `.local/content-issues.md`
- Planning log: `.local/planning/`
