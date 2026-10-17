---
name: pr-flow
description: >
  Full PR creation workflow: takes screenshots, writes the PR description,
  creates a draft PR, runs a two-axis code review, and posts it as a formal
  GitHub review comment. Use this whenever the user asks to open a PR or
  create a pull request. Replaces the old pr-snapshots PR-creation flow.
license: MIT
metadata:
  author: vanch3d
  version: "1.1"
---

# PR Flow Skill

Orchestrates the full pull request lifecycle for this repo (see ADR 016):

```
[screenshots →] description → draft PR → code review → review comment
```

Screenshots are **optional** — omit them for `chore`, `docs`, or any branch
that touches no UI routes. The PR is always created as a **draft**. The owner
reviews the code-review findings and runs `gh pr ready <number>` manually.

**Usage:** `/pr-flow [--routes <routes>] [--capture viewport|fullPage] [--before] [--dry-run]`

- `--routes` — comma-separated app routes to snapshot. If omitted, you will be
  asked; answer with an empty reply (or "none") to skip screenshots entirely.
- `--capture` — `viewport` (default) | `fullPage`.
- `--before` — also take before-snapshots from the base branch (fix/refactor only).
- `--dry-run` — stop after step 5: write `.local/tmp/pr-body.md` and print its
  contents, but do **not** create the PR, run the code review, or post any comment.

---

## Steps

### 1. Detect branch type and base branch

```bash
git rev-parse --abbrev-ref HEAD
```

Branch prefix → type:
- `feat/*` or `feature/*` → `feature`
- `fix/*` → `fix`
- `refactor/*`, `chore/*`, `docs/*` → `refactor`

**Base branch — derive from git, not branch names:**

Collect candidates: `main` plus any local `epic/*` branches
(excluding the current branch itself):

```bash
git branch --list epic/* --format='%(refname:short)'
```

For each candidate, compute how many commits the current branch has
on top of it:

```bash
git rev-list --count <candidate>..HEAD
```

The candidate with the **lowest count** (fewest commits ahead = closest
ancestor) is the true parent branch. Use it as `--base`.

If two candidates produce the same count (genuine ambiguity), **ask**:
> "I can't determine the base branch automatically — is this PR targeting
> `<candidate-A>` or `<candidate-B>`?"

Never infer the base from branch-name patterns alone.

### 2. Determine routes (optional)

If `--routes` was not passed, ask:
> "Which routes should I snapshot? (Enter routes like `/lab/design-system,/cv`, or press Enter to skip screenshots — e.g. for a chore/docs branch.)"

If the user provides no routes (empty reply, "none", "skip", or "n/a"), set
`ROUTES_PROVIDED=false` and skip steps 3 and 4a entirely.

For **fix/refactor** with `--before` (and routes provided): both before and
after snapshots are needed. **Do not stash + checkout the base branch** — use
a git worktree so the base branch runs in isolation on a second port:

1. `git worktree add ../pr-before-worktree <base-branch>`
2. In the worktree: `pnpm install && pnpm dev -- --port 3001`
3. Take before-snapshots via the `pr-snapshots` script with `--port 3001 --label before`
4. `git worktree remove ../pr-before-worktree` (kills the port-3001 server)
5. Take after-snapshots on the main server (port 3000, `--label after`) as normal

For all other cases with routes: after-snapshots only.

### 3. Check dev server (skip if no routes)

> Skip this step entirely if `ROUTES_PROVIDED=false`.

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

If not 200, tell the user to run `pnpm dev` and re-invoke.

### 4. Screenshots and description (parallel)

Run both in parallel — they are independent:

**4a. Screenshots — skip if `ROUTES_PROVIDED=false`**

Spawn the `pr-snapshot-runner` agent (via the Agent tool) with `routes`,
`capture` (`fullPage` if requested), and `label: after` — it runs on a cheap
model and keeps Cypress's console output out of this context. Capture its
returned JSON: `[{ route, url }]`.

**4b. PR description**:

Spawn the `pr-description-writer` agent (via the Agent tool) with `base`
(the resolved base branch from step 1) — it runs the full `git diff`/`git log`
analysis and template discovery on Sonnet but keeps the raw diff output out
of this context. Capture its returned markdown body: Summary, Changes,
Testing, Breaking Changes (if applicable), Related Issues, Checklist. The
returned body will **not** include a Snapshots section — injected in step 5.

### 5. Finalise PR body

**If `ROUTES_PROVIDED=true` — inject snapshot table:**

Build the snapshot block:

For **after-only**:
```markdown
## Snapshots

| Route | Preview |
|---|---|
| `/route` | <img width="1280" alt="route" src="URL"> |
```

For **before/after**:
```markdown
## Snapshots

### Before

| Route | Preview |
|---|---|
| `/route` | <img width="1280" alt="route" src="BEFORE_URL"> |

### After

| Route | Preview |
|---|---|
| `/route` | <img width="1280" alt="route" src="AFTER_URL"> |
```

Injection rules (in order):
1. If the body has a `## Screenshots` or `## Snapshots` section, replace its
   content (keep heading, replace up to next `##` or end of file).
2. Otherwise, insert immediately **before** `## Changes`.
3. Otherwise, append before the attribution line.

**If `ROUTES_PROVIDED=false` — no snapshot block.** If the description
template left a `## Screenshots` or `## Snapshots` placeholder, remove that
section entirely. Do not insert a partial or empty snapshot table.

Append the attribution line last:
```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Write the full body to `.local/tmp/pr-body.md` (Write tool).

> **`--dry-run` halt point.** If `--dry-run` was passed, stop here.
> Print the contents of `.local/tmp/pr-body.md` to the user and exit.
> Do not proceed to steps 6, 7, or 8.

### 6. Create the draft PR

```bash
gh pr create \
  --draft \
  --title "<type>(<scope>): <short description>" \
  --base <base-branch> \
  --body-file .local/tmp/pr-body.md
```

Title follows conventional commits (`github-pr` skill). Capture the PR number
from the output URL (last path segment).

### 7. Run code review

Invoke the `mattpocock-skills/code-review` skill:
- Fixed point: `<base-branch>` (three-dot diff: `git diff <base>...HEAD`)
- **Spec source**: scan `.docs/design/` for a surface brief or approved comp
  whose name matches the branch or changed routes. Pass the path if found;
  if not found, note "no surface doc found" and the Spec axis will be skipped.
- **Standards sources**: CLAUDE.md, `.claude/rules/` (components, i18n, a11y)

Capture the full review output (Standards + Spec sections).

### 8. Post review comment

Format the review body with an attribution header.

**Table column order:** always `Severity | File | Finding`. GitHub allocates
table width left-to-right; putting Severity first ensures it gets its natural
width and Finding gets the remaining space. Never put Severity last.

```markdown
🤖 Claude Code Review — mattpocock/code-review skill

## Standards

| Severity | File | Finding |
|---|---|---|
| error | `path/to/file` | Description of the issue. |
| warning | `path/to/file` | Description of the issue. |

## Spec

<spec findings (same column order) or "No surface doc found — Spec axis skipped.">

---
*One-line summary: N Standards findings, M Spec findings. Worst: <worst issue per axis>.*

---
> **This PR is a draft pending your review of the findings above.**
> Address any blockers, then click **Ready for Review** (or run `gh pr ready <number>`)
> to signal that you have reviewed the findings and the PR is approved for merge.
> In this workflow, "Ready for Review" means **approved** — not "please review".
```

Write the review body to `.local/tmp/pr-review.md` first (Write tool), then post:

```bash
gh pr review <number> --comment --body-file .local/tmp/pr-review.md
```

### 9. Inform the user

Return:
- The draft PR URL
- A summary of review findings (one line per axis)
- A reminder of what "Ready for Review" means in this workflow:

> PR #N is a draft. The agentic review is posted as a comment.
> Read the findings, address any blockers, then approve for merge with:
> `gh pr ready <number>` — or click **Ready for Review** in the GitHub UI.
> **In this workflow that button means approved, not "please review".**

---

## Skills used

| Step | Skill / script |
|---|---|
| Screenshots | `pr-snapshots` → `scripts/take-snapshots.mjs` |
| Description | `pr-description-writer` agent (wraps `meriley-claude-code-skills-pr-description-writer`'s Create-mode workflow) |
| Code review | `mattpocock-skills/code-review` |
| PR mechanics | `github-pr` (conventional commit title conventions) |

## Related

- ADR 016 — Agentic PR Snapshot and Review Workflow
- ADR 010 — Agentic Code Review Workflow
