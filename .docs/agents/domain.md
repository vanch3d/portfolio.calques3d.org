# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root if it exists
- **`.docs/adr/`**: read ADRs that touch the area you're about to work in

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront.

## File structure

Single-context repo:

```
/
├── CONTEXT.md
├── .docs/
│   ├── adr/               ← Architecture Decision Records (NNN-short-title.md)
│   ├── agents/            ← Agent skill configuration (this directory)
│   ├── design/            ← Design specs
│   └── engineering/       ← Engineering notes (toolkit, conventions)
└── src/
```

> Note: this repo uses `.docs/` (dot-prefixed) rather than the conventional `docs/`.
> All ADR and agent-config paths use `.docs/` accordingly.

## ADR conventions

- Filename: `NNN-short-title.md` (three-digit prefix, e.g. `012-case-study-content-architecture.md`)
- Frontmatter required: `title`, `status` (`proposed`|`accepted`|`deprecated`|`superseded`), `date`

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-007 (…), but worth reopening because…_
