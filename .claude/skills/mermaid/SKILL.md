---
name: mermaid
description: >
  Mermaid diagram authoring rules for this repo.
  Trigger: When writing or editing any Mermaid diagram block (```mermaid) in .md or .mdx files —
  even if the user just says "add a diagram", "update the flowchart", or "draw the relationship".
  Always load this skill before producing any Mermaid syntax.
license: MIT
metadata:
  author: vanch3d
  version: "1.0"
---

## Why this matters

Mermaid is sensitive to special characters in labels. An unquoted `/`, `*`, or `@` silently breaks
the diagram — the parse fails at build time or in the IDE preview with no clear error message.
This repo validates all diagrams via `pnpm run validate:diagrams` before commit; catching problems
at authoring time saves a round-trip.

---

## Step 1 — Choose the right diagram type

| Type | Use for | Validation in this repo |
|---|---|---|
| `flowchart` | System/data flow, architecture, decision trees | Structural only |
| `sequenceDiagram` | Interaction flows, API call sequences | Structural only |
| `erDiagram` | Entity relationships (content model, schema) | Structural only |
| `gitGraph` | Branch/commit history | Full parse via `@mermaid-js/parser` |

Use `flowchart` not `graph` — `graph` is deprecated and produces warnings.

```
✅  flowchart LR
❌  graph LR
```

---

## Step 2 — Quote labels containing special characters

Always wrap node labels, edge labels, and subgraph titles in double quotes when they contain
any of these characters: `/` `*` `@` `.` `(` `)` `[` `]` `{` `}`

The validator will catch unquoted specials, but it's faster to get it right first.

```
✅  MDX["src/content/*.mdx"]
❌  MDX[src/content/*.mdx]

✅  IA["/api/revalidate"]
❌  IA[/api/revalidate]

✅  Auth["@/lib/auth"]
❌  Auth[@/lib/auth]

✅  edge -->|"calls (async)"| Handler
❌  edge -->|calls (async)| Handler
```

When in doubt, quote it. Quoted labels that don't need quotes are harmless; unquoted labels
that do need quotes break silently.

---

## Step 3 — Verify

After writing the diagram, run:

```bash
pnpm run validate:diagrams
```

This invokes the bundled validator at `.claude/skills/mermaid/scripts/validate-diagrams.mjs`.
Fix any reported errors before considering the diagram done. If validation passes in the
terminal but the diagram looks wrong in the IDE preview (WebStorm Mermaid plugin), trust
the terminal — the plugin occasionally has rendering quirks that don't reflect real parse errors.
