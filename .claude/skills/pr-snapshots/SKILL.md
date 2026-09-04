---
name: pr-snapshots
description: >
  Create a GitHub pull request with Cypress snapshots uploaded to GitHub CDN.
  Use this skill whenever the user asks to open a PR, create a pull request, or
  run /pr-snapshots. Auto-detects PR type from branch prefix. Takes snapshots
  via Cypress, uploads them to GitHub (no files committed), and creates the PR
  with a visual description.
license: MIT
metadata:
  author: vanch3d
  version: "1.0"
---

# PR Snapshots Skill

Opens a PR for the current branch with a visual description and Cypress snapshots
uploaded to GitHub CDN (no PNGs committed to git).

**Usage:** `/pr-snapshots [type] [routes]`

- `type` — `feature` | `fix` | `refactor` (auto-detected from branch prefix if omitted)
- `routes` — comma-separated routes to snapshot (e.g. `/lab/design-system,/lab/design-system/colors`).
  Ask if not provided.

---

## Steps

### 1. Detect PR type and base branch

```bash
git rev-parse --abbrev-ref HEAD
```

Branch prefix → type:
- `feat/*` or `feature/*` → `feature`
- `fix/*` → `fix`
- `refactor/*`, `chore/*`, `docs/*` → `refactor`

Base branch: `epic/design-compass-app` if it exists locally, else `main`. Ask if unclear.

### 2. Determine routes

If routes were not passed, ask:
> "Which routes should I snapshot? (e.g. `/lab/design-system,/lab/design-system/colors`)"

For **fix/refactor PRs**: ask if before/after snapshots are needed.
- If yes: see "Before snapshots" section below.
- If no: after snapshots only.

For **feature PRs**: after snapshots only.

### 3. Check dev server

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

If not 200, tell the user to run `pnpm dev` and re-invoke the skill.

### 4. Take and upload snapshots

Run the script (it handles Cypress + upload to GitHub CDN):

```bash
node .claude/skills/pr-snapshots/scripts/take-snapshots.mjs --routes <routes>
```

With a label (before/after):
```bash
node .claude/skills/pr-snapshots/scripts/take-snapshots.mjs --routes <routes> --label after
```

The script outputs a JSON array of `{ route, url }` where `url` is a
`github.com/user-attachments/assets/...` CDN URL — works for private repos,
no files committed to git.

### 5. Write and create the PR

Write the PR body to `/tmp/pr-body.md` (Write tool), then:

```bash
gh pr create --title "<type>(<scope>): <summary>" --base <base-branch> --body-file /tmp/pr-body.md
```

Use `git log <base>...HEAD --oneline` and `git diff <base>...HEAD` to fill in the description.

**Feature PR template:**

```markdown
## What this adds

<!-- 1–3 sentences from the user's/design perspective: what is now visible that wasn't before -->

## Design summary

<!-- Visual language decisions, which comp it implements, named rules applied -->

## Snapshots

| Route | Preview |
|---|---|
| `/route` | <img width="1200" alt="route" src="URL"> |

## Test plan

- [ ] `pnpm validate` green
- [ ] CT specs pass (`pnpm test:ct`)
- [ ] E2E specs pass (`pnpm test:e2e`)
- [ ] WCAG 2.1 AA — zero axe violations
- [ ] Fonts render correctly (STIX Two, Spectral, Departure Mono)
- [ ] Reviewed at 1280px and 375px

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**Fix/refactor PR template:**

```markdown
## What changed

<!-- 1–3 sentences: what was wrong or suboptimal, what is corrected -->

## Why

<!-- The rule, standard, or review finding that triggered this -->

## Snapshots

### After

| Route | Preview |
|---|---|
| `/route` | <img width="1200" alt="route" src="URL"> |

<!-- ### Before (if taken)
| Route | Preview |
|---|---|
| `/route` | <img width="1200" alt="route" src="BEFORE_URL"> |
-->

## Test plan

- [ ] `pnpm validate` green
- [ ] All specs still pass (same counts as before)
- [ ] No visual regression

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Return the PR URL to the user.

---

## Before snapshots (optional, fix/refactor only)

Only do this when the user explicitly asks for before/after comparison.

1. Create a worktree at the base branch:
   ```bash
   git worktree add /tmp/pr-before-worktree <base-branch>
   ```
2. Start a second dev server on port 3001 in the worktree:
   ```bash
   cd /tmp/pr-before-worktree && pnpm install && pnpm dev -- --port 3001
   ```
3. Run the script with `--label before` and `--port 3001`:
   ```bash
   node .claude/skills/pr-snapshots/scripts/take-snapshots.mjs --routes <routes> --label before --port 3001
   ```
4. Clean up:
   ```bash
   git worktree remove /tmp/pr-before-worktree
   ```

---

## Script reference

`scripts/take-snapshots.mjs` — co-located script that:
1. Runs `cypress/pr-snapshots/pr-snapshots.cy.ts` via pnpm
2. Uploads each snapshot to GitHub CDN via the `uploads.github.com` asset endpoint
3. Deletes the local PNG files
4. Outputs `[{ route, url }]` to stdout
