# ADR Tag Taxonomy

This file is the canonical reference for tags used in ADR frontmatter. It exists to prevent tag sprawl — the slow accumulation of near-synonyms and one-off spellings that make filters useless. Before tagging a new ADR, read this file first. Before adding a new tag, check that no existing tag already covers the concept.

---

## Authoring Rules

1. **Check TAGS.md first.** Before tagging a new ADR, scan the taxonomy table below. If a tag exists that covers the concept, use it. Do not create a new tag for the same concept under a different spelling.

2. **Tag normalisation.** All tags must be lowercase and hyphenated — no spaces, no dots where avoidable. Good: `ci-cd`, `design-system`. Bad: `CI/CD`, `design system`, `next.js` (prefer `nextjs`).

3. **No singletons from synonyms.** `a11y` must not coexist with `accessibility`. `ci` must not coexist with `ci-cd`. If you are tempted to add a synonym, use the canonical tag instead. If the canonical tag genuinely needs updating, raise the merge in ADR 017 and record it in the Merge History section below.

4. **Maximum 6 tags per ADR.** Tags are for filtering, not for comprehensive annotation. If you have more than 6, some are probably redundant with the title or the ADR's context section.

5. **New tag protocol.** If no existing tag fits and a new concept genuinely needs a tag: (a) add it here in TAGS.md with a description and the ADR number, (b) confirm no existing tag covers it, (c) apply it consistently in all ADRs where it applies — not just the one being written.

6. **The Single Reference group is a curation prompt.** The tag filter UI groups tags with count=1 under "Single reference" with the note "near-synonyms cluster here". Seeing two near-synonyms in that group is a signal to merge them, not to leave both in place.

---

## Canonical Tag Taxonomy

| Tag              | Description                                                                 | Used in                                              |
| ---------------- | --------------------------------------------------------------------------- | ---------------------------------------------------- |
| `accessibility`  | WCAG compliance, screen readers, axe-core integration                       | ADR 007, ADR 011                                     |
| `adr`            | ADR format, lifecycle, and conventions themselves                           | ADR 017, ADR 019                                     |
| `agents`         | Claude Code sub-agents, agent orchestration patterns                        | ADR 005, ADR 010, ADR 016                            |
| `animation`      | Motion, transitions, reduced-motion preferences                             | ADR 011                                              |
| `api`            | External API integration, HTTP clients                                      | ADR 003                                              |
| `architecture`   | Cross-cutting structural decisions                                          | ADR 003, ADR 013, ADR 014                            |
| `axe-core`       | axe-core library specifically (distinct from the broader accessibility tag) | ADR 007, ADR 011                                     |
| `case-studies`   | Engineering case-study content type                                         | ADR 012                                              |
| `ci-cd`          | Continuous integration and deployment pipelines                             | ADR 002, ADR 008                                     |
| `claude-code`    | Claude Code CLI configuration, hooks, tooling                               | ADR 005, ADR 010, ADR 016                            |
| `cms`            | Content management approach, headless CMS decisions                         | ADR 013                                              |
| `code-review`    | Automated or agent-assisted code review workflow                            | ADR 010, ADR 016                                     |
| `components`     | React component conventions, co-location, prop typing                       | ADR 004                                              |
| `content`        | Content pipeline, MDX authoring, content types                              | ADR 012, ADR 013, ADR 014                            |
| `conventions`    | Coding conventions, naming rules, file structure standards                  | ADR 004, ADR 017                                     |
| `css`            | CSS authoring, cascade, custom properties                                   | ADR 009                                              |
| `cypress`        | Cypress CT or E2E testing                                                   | ADR 002, ADR 008, ADR 011, ADR 016                   |
| `dark-mode`      | Dark theme, colour-scheme switching                                         | ADR 009                                              |
| `data-fetching`  | Data loading strategies, SWR, server-side fetch                             | ADR 003                                              |
| `deployment`     | Hosting, deploy targets, release process                                    | ADR 001                                              |
| `design-system`  | Design tokens, component library, visual language                           | ADR 009, ADR 015                                     |
| `documentation`  | Documentation strategy, document types, authoring guidance                  | ADR 017, ADR 018                                     |
| `dx`             | Developer experience, tooling ergonomics                                    | ADR 005, ADR 010, ADR 016                            |
| `eslint`         | ESLint configuration and rule choices                                       | ADR 004                                              |
| `github-actions` | GitHub Actions workflow files                                               | ADR 008                                              |
| `hosting`        | Server, CDN, infrastructure choice                                          | ADR 001                                              |
| `i18n`           | Internationalisation, locale routing, message extraction                    | ADR 006                                              |
| `infrastructure` | Infrastructure decisions (hosting, DNS, server config)                      | ADR 001                                              |
| `insights`       | Engineering Insights document type                                          | ADR 018, ADR 019                                     |
| `isr`            | Incremental Static Regeneration rendering mode                              | ADR 013                                              |
| `lab`            | The `/lab` section of the site                                              | ADR 015, ADR 019                                     |
| `markdown`       | Markdown rendering, remark/rehype pipeline                                  | ADR 019                                              |
| `mdx`            | MDX authoring and component injection                                       | ADR 012, ADR 013, ADR 014, ADR 019                   |
| `motion`         | CSS or JS animation, motion accessibility                                   | ADR 011                                              |
| `next-intl`      | next-intl library specifically                                              | ADR 006                                              |
| `nextjs`         | Next.js framework decisions (App Router, rendering modes)                   | ADR 015                                              |
| `openapi`        | OpenAPI schema, API contract, type generation                               | ADR 003                                              |
| `playwright`     | Playwright E2E testing                                                      | ADR 002, ADR 008                                     |
| `pr`             | Pull request workflow, PR conventions                                       | ADR 016                                              |
| `process`        | Engineering process, workflow conventions                                   | ADR 017, ADR 018                                     |
| `projects`       | The `/projects/[slug]` project-detail surface                               | ADR 020, ADR 021                                     |
| `quality`        | Code quality gates, linting, static analysis                                | ADR 002                                              |
| `rendering`      | Next.js rendering strategy (SSG, SSR, ISR, CSR)                             | ADR 015, ADR 019                                     |
| `routing`        | Next.js App Router routing, dynamic segments                                | ADR 012                                              |
| `schema`         | JSON Schema, content schema, validation                                     | ADR 014                                              |
| `site`           | Portfolio site as a whole, cross-cutting site decisions                     | ADR 018                                              |
| `skills`         | Claude Code slash commands and skill scripts                                | ADR 005                                              |
| `ssg`            | Static Site Generation rendering mode                                       | ADR 012, ADR 015, ADR 019                            |
| `tanstack-query` | TanStack Query (React Query) library                                        | ADR 003                                              |
| `testing`        | Testing strategy, test tooling, test conventions                            | ADR 002, ADR 004, ADR 007, ADR 008, ADR 011, ADR 019 |
| `theming`        | Theme tokens, light/dark switching                                          | ADR 009                                              |
| `tokens`         | Design tokens, CSS custom properties as a system                            | ADR 009                                              |
| `tooling`        | Developer tooling choices (bundlers, formatters, etc.)                      | ADR 005, ADR 006                                     |
| `types`          | TypeScript type generation, type safety                                     | ADR 014                                              |
| `ux`             | User experience decisions, interaction patterns                             | ADR 006                                              |
| `vercel`         | Vercel platform, deploy hooks, preview URLs                                 | ADR 001, ADR 008                                     |
| `wcag`           | WCAG standard version and conformance level                                 | ADR 007                                              |
| `workflow`       | Agent or human workflow patterns                                            | ADR 005, ADR 010, ADR 016, ADR 017, ADR 018          |

---

## Merge History

Tags that were found in frontmatter and merged into a canonical form. Record merges here so the rationale is not lost.

| Removed tag | Merged into     | Date       | ADR affected |
| ----------- | --------------- | ---------- | ------------ |
| `a11y`      | `accessibility` | 2026-09-06 | ADR 007      |
| `ci`        | `ci-cd`         | 2026-09-06 | ADR 008      |
| `next.js`   | `nextjs`        | 2026-09-06 | ADR 015      |
