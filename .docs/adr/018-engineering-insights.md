---
number: 18
title: "Engineering Insights Document Type"
status: accepted
date: "2026-09-04"
decision-makers: vanch3d
tags: ["documentation", "process", "insights", "workflow", "site"]
---

# ADR 018 — Engineering Insights Document Type

**Date:** 2026-09-04
**Status:** Accepted

## Context

ADRs document decisions made *before* or *during* implementation. They record intent.
A different category of knowledge emerges *after* the fact: properties of a system that
were not designed, not obvious from the code, and only visible once the thing was running.

The first instance arose during the initial live run of the `pr-flow` skill (ADR 016):
the realisation that GitHub's draft PR state is a **hard merge block** — no agent can
merge a draft PR regardless of permissions. This was not a design decision; it was a
consequence of a GitHub platform constraint that happened to align perfectly with the
workflow's safety goals. Writing it into ADR 016 as if it were planned would be a
small but meaningful dishonesty.

The portfolio explicitly documents engineering process as a first-class artefact. Recording
serendipitous discoveries — prominently and honestly — is more authentic and more useful
than a curated narrative of perfect foresight.

## Decision

### New document type: Engineering Insights

Insights live in `.docs/insights/` with this frontmatter:

```yaml
---
number: <integer>
title: "<What was discovered>"
date: "YYYY-MM-DD"
discovered-during: "<Context in which the insight emerged>"
related-adr: <ADR number, if any>
tags: ["tag1", "tag2"]
---
```

Numbers are sequential within the insights series (separate from ADR numbers).
Files are named `NNN-short-title.md`.

The body must include:

1. **Discovery** — what was observed, and when/how it surfaced
2. **The insight** — the non-obvious property or principle, stated clearly
3. **Why it matters** — consequences for design, future decisions, or mental models
4. **Relation to decisions** — which ADRs it confirms, challenges, or enriches

### Relationship to ADRs

An insight is not a decision — it does not change what is built.
It enriches the understanding of something already built or decided.

Cross-reference both ways:
- The insight cites the related ADR under **Relation to decisions**
- The ADR gains a `## Insights` section at the bottom listing related insight numbers

### Site rendering and callout component

Insights are rendered as a distinct section of the site, separate from ADRs.
On any page that renders an ADR, related insights are surfaced with a visual
callout — a highlighted block clearly labelled **"Discovered in practice"** —
so they cannot be missed in the flow of reading.

The callout component (`<Insight>`) is an MDX component to be implemented when
the ADR/insight rendering route is built. Until then, insights are rendered as
standard Markdown with a blockquote prefix:

```markdown
> **Discovered in practice** — see [Insight 001](../insights/001-...)
```

### When to write an insight

Write an insight when:
- A property of the system is discovered by *running* it, not by reading the code
- The discovery is non-obvious and would not be recoverable from the ADRs alone
- The discovery changes how you would explain or teach the design to someone new

Do not write an insight for:
- Bug fixes (those belong in commit messages and PRs)
- Deliberate decisions (those belong in ADRs)
- Observations that are obvious from reading the code or ADRs

## Consequences

**Positive:**
- Honest separation between intent (ADRs) and discovery (insights) — the portfolio
  makes no claim of perfect foresight.
- Serendipitous realisations are recorded at the moment they happen, not lost.
- The "Discovered in practice" callout gives insights visual prominence without
  inflating the ADR record with retrospective retrofitting.
- Future agents have a place to record non-obvious findings without polluting ADRs.

**Negative / Trade-offs:**
- A second document series to maintain alongside ADRs.
- The `<Insight>` callout component does not yet exist — site rendering is deferred
  until the ADR/insight route is built.
- The boundary between "insight" and "ADR amendment" requires judgement. Rule of
  thumb: if it changes what you'd build, it's an amendment; if it only changes how
  you'd explain it, it's an insight.

## Alternatives considered

**Add a `## Serendipitous Insights` section to each ADR**
Keeps everything co-located but conflates decision records with post-hoc discoveries.
ADRs are written before merge; insights emerge after. Mixing timelines in one document
muddies both.

**Use a running log file (INSIGHTS.md)**
A single flat file is simpler but not site-renderable as individual pages, not
linkable from specific ADRs, and grows unwieldy. Separate files with frontmatter
give the same structure as ADRs and compose with the site's content pipeline.

**Record insights only in commit messages or PR comments**
Already done (the discovery appears in PR #29's review thread). But that record
is buried in GitHub and not rendered on the site. Insights deserve their own
surfacing.

## Related

- ADR 005 — Claude Code Project Configuration (`.docs/` as first-class artefact)
- ADR 016 — PR Snapshot Review Workflow (the ADR that produced the first insight)
- ADR 017 — ADR Conventions and Lifecycle
- Insight 001 — Draft PR as Hard Agent Containment Boundary (first instance)
