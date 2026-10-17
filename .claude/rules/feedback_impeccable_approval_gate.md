---
name: Stop at comp-approved gate before engineering handoff
description: After /impeccable approves a comp, always pause and present a summary for user approval before spawning nextjs-engineer or any implementation agent
type: feedback
---

After the impeccable design phase closes (comp approved, surface brief written, direction contract recorded), always stop and present:
- What was decided (direction name, comp path, key constraints)
- What the engineer will build (routes, components, data layer)
- Explicit question: "Ready to proceed to implementation?"

Do NOT spawn nextjs-engineer or start the hero build gate without an explicit user go-ahead.

**Why:** User was interrupted at the "handing off to engineer" moment and wanted to review the plan first. The design phase is a natural checkpoint; the engineering handoff is a separate commitment.

**How to apply:** After writing the surface brief and before any `build-phase.mjs` or `nextjs-engineer` invocation, post a clean summary and wait for confirmation.
