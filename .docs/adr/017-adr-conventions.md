---
number: 17
title: 'ADR Conventions and Lifecycle'
status: accepted
date: '2026-09-04'
decision-makers: vanch3d
tags: ['documentation', 'process', 'adr', 'workflow']
---

# ADR 017 — ADR Conventions and Lifecycle

**Date:** 2026-09-04
**Status:** Accepted

## Context

Architecture Decision Records have been in use since the first commit of this project
(ADR 001, 2026-08-03). Sixteen ADRs have accumulated without a formal record of the
conventions governing them — format, lifecycle, when to write one, and how they relate
to other documentation. This creates a gap: agents and contributors must infer the rules
from examples rather than read them explicitly.

This ADR formalises the existing practice and adds the relationship to the new Engineering
Insights document type (ADR 018).

## Decision

### Format

Every ADR is a Markdown file in `.docs/adr/` with this frontmatter:

```yaml
---
number: <integer>
title: '<Decision title>'
status: proposed | accepted | deprecated | superseded
date: 'YYYY-MM-DD'
decision-makers: vanch3d
tags: ['architecture', 'conventions']
---
```

The body must include these sections in order:

1. **Context** — the problem or pressure that required a decision
2. **Decision** — what was decided and why (subsections allowed)
3. **Consequences** — positive outcomes and trade-offs
4. **Alternatives considered** — what was evaluated and rejected, with reasons
5. **Related** — links to other ADRs, source files, or external references

### Naming and numbering

Files are named `NNN-short-title.md` with a zero-padded three-digit number.
Numbers are sequential and permanent — no gaps, no reuse. The next ADR always
takes `max(existing) + 1`.

### Status lifecycle

| Status       | Meaning                                                               |
| ------------ | --------------------------------------------------------------------- |
| `proposed`   | Written but not yet in effect — used during the PR that introduces it |
| `accepted`   | The decision is in force                                              |
| `deprecated` | Superseded by a later decision; kept for historical record            |
| `superseded` | Explicitly replaced — add `superseded-by: NNN` to frontmatter         |

An ADR's status must be updated to `accepted` in the same PR that ships the
change it documents. `proposed` in a merged PR is a bug.

### Amendments

Significant changes to an accepted decision are recorded as a dated **Amended**
note in the body heading (`**Date:** YYYY-MM-DD · **Amended:** YYYY-MM-DD`),
not as a new ADR. A new ADR is warranted only when the decision itself changes,
not when implementation details are refined.

### When to write an ADR

Write an ADR for any decision that:

- affects multiple files or systems
- would be hard to reverse
- has non-obvious trade-offs
- a future agent or contributor would reasonably ask "why was this done this way?"

Do not write ADRs for implementation details, naming preferences within a file,
or choices that are trivially reversible.

### Tooling

Use the `adr-skill` with `--dir .docs/adr` (not the skill's default detection path).
The skill scaffolds the frontmatter and section headings.

### Site rendering

ADRs are rendered as a section of the portfolio site. They are a first-class
engineering artefact — not internal documentation. Write them for a technical
audience who has not seen the codebase.

## Consequences

**Positive:**

- Agents have an authoritative source for ADR conventions rather than inferring
  from examples — reduces format drift over time.
- Status lifecycle is explicit: `proposed` in a merged PR is now a detectable error.
- The amendment pattern avoids ADR proliferation for minor updates.

**Negative / Trade-offs:**

- Formalising retrospectively means early ADRs may not fully conform. They are
  not worth rewriting — the convention applies from ADR 017 forward.

## Alternatives considered

**Rely on CLAUDE.md conventions section**
CLAUDE.md already mentions ADRs but only from an agent-instruction perspective
("use adr-skill", "pass --dir .docs/adr"). That is insufficient as a source of
truth for humans reading the site or for agents writing new ADRs.

**External ADR tooling (adr-tools, log4brains)**
Rejected. These impose directory structures and formats that conflict with the
site's rendering approach. The project's custom `adr-skill` is sufficient.

## Related

- ADR 005 — Claude Code Project Configuration (`.docs/` as first-class artefact)
- ADR 018 — Engineering Insights document type (companion document type)
- `.claude/skills/adr-skill/` — scaffolding tool
