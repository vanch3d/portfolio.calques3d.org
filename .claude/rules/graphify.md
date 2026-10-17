# Graphify Rules of Engagement

Applies to every agent (orchestrator or subagent) with Read, Glob, Grep, or
Bash tools in this project. `graphify-out/` holds a persistent knowledge graph
of this codebase — god nodes, community structure, cross-file relationships —
built specifically so exploration doesn't have to mean raw grep/read.

---

## The hard rule

**Lead with graphify. Don't wait to be blocked.**

Before any exploratory Read, Glob, Grep, or Bash call on this codebase —
finding an existing component, tracing how two files relate, understanding a
pattern before extending it, answering "where is X" or "how does Y work" —
run one of:

```bash
graphify query "<question>"
graphify explain "<Concept>"
graphify path "<A>" "<B>"
```

and read the output before falling back to raw search. A hook exists to catch
the case where this doesn't happen (`graphify.EXE hook-guard read --strict` /
`hook-guard search`, wired in `.claude/settings.json` per ADR 022 — see that
ADR for exactly what it does and doesn't block), but the hook is a backstop,
not the workflow. Treating "lead with graphify" as the default and the hook as
a rare safety net — rather than reading/grepping first and letting the hook
redirect you — is the entire point of this rule. Leading with `Read`/`Grep`
and getting blocked into compliance is the failure mode this file exists to
close out.

Note on the hook's actual limits (learned the hard way — don't re-litigate
this): it hard-blocks at most once per session, only for `Read` of a real,
graph-indexed, non-stale file, and downgrades to an advisory nudge whenever
*any* `graphify query/explain/path` ran within the last 30 minutes (a global
timestamp, not per-session). In normal use that TTL is almost always
satisfied, so the hard block is rare by design, not broken. It is a backstop
for the worst case, not the primary enforcement mechanism — that's still you,
leading with graphify by habit.

---

## When raw file access is fine

- `graphify-out/wiki/index.md`, if it exists, for broad navigation instead of
  raw source browsing.
- `graphify-out/GRAPH_REPORT.md`, but only for broad architecture review, or
  when query/explain/path didn't surface enough context.
- Reading or editing specific lines you already know you need — once graphify
  (or prior context in this conversation) has oriented you to the right file,
  opening it directly is not a violation.

---

## After modifying code

Run `graphify update .` (AST-only, no LLM cost) so the graph reflects the new
code before the next query — yours or another agent's.

---

## Spawning subagents

If you spawn a subagent (the `Agent` tool) whose prompt involves any code
exploration, the graphify instruction must be **literally the first
substantive thing in that subagent's prompt** — not mentioned somewhere in a
background/context section. `agent-graphify-guard.mjs` mechanically enforces
this by requiring the word "graphify" within roughly the first 300 characters
of the prompt; a mention that only satisfies the hook without giving the
subagent a real, actionable instruction ("run `graphify query \"<question>\"`
before reading `X`") reproduces the exact failure this rule exists to
prevent — write the real instruction, not hook-filler.

If the subagent genuinely does no code exploration (pure writing, formatting,
or data-transform work), say so explicitly as the first line instead of
omitting graphify silently.

---

## Why this exists

Prior enforcement here went through several rounds: three overlapping,
inconsistent hooks bolted on reactively across separate sessions (only 3 of
the project's agent definitions mentioned graphify at all); a 2026-09-21
consolidation that replaced the built-in strict-mode hook with a custom
per-turn freshness guard, based on a mistaken belief that strict mode never
blocked; and a 2026-09-26 correction that restored strict mode as the single
enforcement mechanism (per ADR 022) once direct testing showed the custom
guard's own query traffic was what made strict mode look inert — and that
adding yet another custom hook layer to close that gap would repeat the exact
mistake being corrected, not fix it. The deeper problem was never a hook gap —
it was defaulting to `Read`/`Grep` and treating a hook block as the signal to
reconsider, instead of making "graphify first" the obvious, unmissable default
everywhere code exploration happens. See
`.docs/tasks/2026-09-21-graphify-rules-of-engagement-plan.md` and ADR 022 for
the full history.

A 2026-09-27 incident during the same session added two concrete failure
modes not previously documented: a bare `Skill`-tool invocation with no
graphify instruction in `args` (the tool has no separate prompt field to
carry one), and reliance on `Agent`-tool fork exemption without verifying a
fork actually followed the context it inherited. See
`.docs/tasks/2026-09-27-graphify-strict-enforcement-handoff.md` for the full
incident and the resulting binding instructions — no new hook was added; the
fix is that every spawn, by any mechanism, carries the instruction
explicitly, checked, not assumed.
