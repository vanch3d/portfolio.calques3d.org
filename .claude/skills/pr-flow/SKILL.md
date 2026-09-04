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
  version: "1.0"
---

# PR Flow Skill

Orchestrates the full pull request lifecycle for this repo (see ADR 016):

```
screenshots → description → draft PR → code review → review comment
```

The PR is always created as a **draft**. The owner reviews the code-review
findings and runs `gh pr ready <number>` manually when satisfied.

**Usage:** `/pr-flow [--routes <routes>] [--capture viewport|fullPage] [--before] [--dry-run]`

- `--routes` — comma-separated app routes to snapshot. Ask if not provided.
- `--capture` — `viewport` (default) | `fullPage`.
- `--before` — also take before-snapshots from the base branch (fix/refactor only).
- `--dry-run` — stop after step 5: write `.local/tmp/pr-body.md` and print its contents,
  but do **not** create the PR, run the code review, or post any comment.
  Use this to inspect the description and snapshot table before committing to a PR.

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

Base branch: `main` unless an `epic/*` branch exists locally — ask if unclear.

### 2. Determine routes

If `--routes` was not passed, ask:
> "Which routes should I snapshot? (e.g. `/lab/design-system,/lab/design-system/colors`)"

For **fix/refactor** with `--before`: both before and after snapshots are
needed. **Do not stash + checkout the base branch** — that tears down the
running dev server and risks losing WIP context. Instead, use a git worktree
so the base branch runs in isolation on a second port while the main dev
server stays up:

1. `git worktree add ../pr-before-worktree <base-branch>`
2. In the worktree: `pnpm install && pnpm dev -- --port 3001`
3. Take before-snapshots via the `pr-snapshots` script with `--port 3001 --label before`
4. `git worktree remove ../pr-before-worktree` (kills the port-3001 server)
5. Take after-snapshots on the main server (port 3000, `--label after`) as normal

For all other cases: after-snapshots only.

### 3. Check dev server

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

If not 200, tell the user to run `pnpm dev` and re-invoke.

### 4. Take screenshots and generate description (parallel)

Run both in parallel — they are independent:

**4a. Screenshots** (via `pr-snapshots` skill script):
```bash
node .claude/skills/pr-snapshots/scripts/take-snapshots.mjs \
  --routes <routes> [--capture fullPage] [--label after]
```
Capture the output JSON: `[{ route, url }]`.

**4b. PR description** (via `pr-description-writer` skill):

Invoke the `meriley-claude-code-skills-pr-description-writer` skill in
**Create mode**:
- Analyse `git diff <base>...HEAD` and commit history
- Discover any PR template in `.github/`
- Generate verified body markdown (Summary, Changes, Testing, Checklist)
- The description must not include a Snapshots section — that is injected next

### 5. Inject snapshot table

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

**Injection rules** (in order):

1. If the generated body contains a `## Screenshots` or `## Snapshots` section,
   replace that section's content with the snapshot block (keep the heading,
   replace everything up to the next `##` or end of file).
2. Otherwise, insert the snapshot block immediately **before** the `## Changes`
   section.
3. If neither a screenshots section nor a `## Changes` section exists, append
   the snapshot block before the closing attribution line.

Append the Claude Code attribution line last:
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

Format the review body with an attribution header:

```markdown
🤖 Claude Code Review — mattpocock/code-review skill

## Standards

<standards findings>

## Spec

<spec findings or "No surface doc found — Spec axis skipped.">

---
*One-line summary: N Standards findings, M Spec findings. Worst: <worst issue per axis>.*
```

Post as a formal GitHub review event (not a plain comment):

```bash
gh pr review <number> --comment --body-file .local/tmp/pr-review.md
```

Write the review body to `.local/tmp/pr-review.md` first (Write tool).

### 9. Inform the user

Return:
- The draft PR URL
- A summary of review findings (one line per axis)
- The command to promote when ready:
  ```bash
  gh pr ready <number>
  ```

---

## Skills used

| Step | Skill / script |
|---|---|
| Screenshots | `pr-snapshots` → `scripts/take-snapshots.mjs` |
| Description | `meriley-claude-code-skills-pr-description-writer` |
| Code review | `mattpocock-skills/code-review` |
| PR mechanics | `github-pr` (conventional commit title conventions) |

## Related

- ADR 016 — Agentic PR Snapshot and Review Workflow
- ADR 010 — Agentic Code Review Workflow
