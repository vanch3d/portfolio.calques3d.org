Scaffold a new Architecture Decision Record (ADR).

## Arguments

`$ARGUMENTS` — short title for the ADR (e.g. "state management" or "image hosting")

## Steps

1. Read `.docs/adr/` to find the highest existing ADR number. The new number is that + 1.
2. Format the filename as `NNN-<kebab-case-title>.md` (e.g. `006-state-management.md`).
3. Create the file at `.docs/adr/<filename>` with this template:

```markdown
---
number: <N>
title: "<Title Case Title>"
status: proposed
date: "<today's date as YYYY-MM-DD>"
tags: []
supersedes: []
---

# ADR <N> — <Title Case Title>

**Date:** <today's date>
**Status:** Proposed

## Context

<!-- What is the situation and why does a decision need to be made? -->

## Decision

<!-- What is the decision? -->

## Consequences

**Positive:**
-

**Negative / Trade-offs:**
-

## Related

-
```

4. Tell the user the filename and remind them to:
   - Fill in the context, decision, and consequences
   - Change status from `proposed` to `decided` when agreed
   - Add relevant tags
   - Link related ADRs in the Related section
