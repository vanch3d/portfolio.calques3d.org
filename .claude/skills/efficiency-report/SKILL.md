---
name: efficiency-report
description: >
  Measure whether graphify and RTK are actually reducing token/context cost,
  using this project's own Claude Code session transcripts as ground truth
  rather than each tool's self-reported numbers. Use when the user asks about
  usage-limit risk, token savings, or whether a devx tool (graphify, rtk,
  a new agent) is earning its keep.
license: MIT
metadata:
  author: vanch3d
  version: "1.0"
---

# Efficiency Report

Answers "is this thing actually saving tokens?" for graphify and rtk, using real transcript data instead of vibes.

**Usage:** `/efficiency-report`

## Steps

### 1. Run the analyzer

```bash
node .claude/skills/efficiency-report/scripts/analyze.mjs
```

This parses every `*.jsonl` transcript under
`~/.claude/projects/<encoded-cwd>/` (Claude Code's own session logs — real
tool calls, real result sizes, no self-reporting), classifies each tool call
as `read` / `grep` / `glob` / `bash-search` / `bash-other` / `graphify` /
`rtk`, and buckets by before/after the graphify hook install date
(`2026-09-12T15:09:39Z` — commit `f0018fb`, hardcoded in the script; update
it if the hook is ever re-installed or the project moves).

Token counts are `chars / 4` on tool_result content — a proxy, not the real
Anthropic tokenizer. Good for relative comparison, not for reconciling
against a bill.

### 2. Run RTK's own tracker alongside it

```bash
rtk gain --history
```

RTK ships a real savings tracker (it can diff its output against what the
raw command would have produced) — this is ground truth for RTK specifically,
the analyzer script above should not try to duplicate it.

### 3. Normalize before comparing before/after

The before/after windows are almost never the same length. Always divide by
elapsed days before comparing volume:

```bash
node -e "console.log((afterTotalTokens/afterDays) / (beforeTotalTokens/beforeDays))"
```

A raw before/after call-count comparison is misleading on its own.

### 4. Check adoption, not just volume

The script prints an "adoption ratio": `graphify` calls as a share of all
source-lookup calls (`read` + `grep` + `glob` + `bash-search`) in the after
period. This is the number that actually explains a volume drop or its
absence — the graphify pre-tool-use hook only *injects a reminder*, it does
not block the raw Read/Grep/Glob call, so low adoption despite the hook
firing is a real, expected failure mode to watch for, not a bug in the
script.

### 5. Report honestly

Give the user:
- Per-day token-volume before vs after (normalized)
- Adoption ratio for graphify
- RTK's own `gain` numbers
- An explicit caveat when the after-window is short (a few days) — small
  samples swing on workload mix, not just tool adoption. Do not present a
  volume drop as caused by graphify unless the adoption ratio is also high
  enough to plausibly explain it.

Re-run this periodically (weekly is reasonable) so the after-window grows
and the comparison gets more reliable.
