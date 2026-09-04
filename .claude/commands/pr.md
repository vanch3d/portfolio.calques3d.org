---
description: Open a pull request with screenshots and a rich description
license: MIT
metadata:
  author: vanch3d
  version: "1.0"
---

Open a PR for the current branch with a visual summary tailored to the PR type.

**Usage:** `/pr [type] [routes]`

- `type` — `feature` | `fix` | `refactor` (auto-detected from branch prefix if omitted)
- `routes` — comma-separated list of app routes to screenshot (e.g. `/lab/design-system,/lab/design-system/colors`)
  If omitted, you will be asked.

**Branch prefix → type mapping:**
- `feat/*` or `feature/*` → feature
- `fix/*` → fix
- `refactor/*` or `chore/*` or `docs/*` → refactor/improvement

---

## Steps

### 1. Determine PR type and base branch

Read the current branch name:
```bash
git rev-parse --abbrev-ref HEAD
```

Auto-detect type from prefix. If ambiguous, ask the user.

Determine the base branch:
- Default: `epic/design-compass-app` if it exists, else `main`.
- Ask the user if unclear.

### 2. Determine routes to screenshot

If `routes` was not passed as an argument, ask:
> "Which routes should I screenshot for the PR? (e.g. `/lab/design-system,/lab/design-system/colors`)"

For **fix/refactor PRs**: also ask if before/after is needed.
- If yes: first take "before" screenshots by checking out the base branch in a worktree
  (see "Before screenshots" section below), then take "after" screenshots from the current branch.
- If no: take "after" screenshots only.

For **feature PRs**: "after" screenshots only.

### 3. Take screenshots

Make sure the Next.js dev server is running on port 3000.
Check: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
If not running, tell the user: "Start the dev server with `pnpm dev` then re-run `/pr`."

Run the screenshot script:
```bash
node scripts/pr-screenshots.mjs --routes <routes> [--label after]
```

The script outputs a JSON array of `{ route, file, rawUrl }` objects.

### 4. Commit and push screenshots

Stage the `.docs/screenshots/` directory:
```bash
git add .docs/screenshots/
```

Commit:
```bash
git commit -m "chore: add PR screenshots for <branch>"
```

Push the branch (including the screenshots commit):
```bash
git push -u origin HEAD
```

### 5. Write the PR description

**For feature PRs**, use this template:

```markdown
## What this adds

<!-- 1–3 sentences from the user's perspective: what is now visible/usable that wasn't before -->

## Design summary

<!-- One paragraph: visual language decisions, which comp it implements, named rules applied -->

## Screenshots

| Route | Preview |
|---|---|
| `/route` | ![route](rawUrl) |

## Test plan

- [ ] `pnpm validate` green
- [ ] CT specs pass (`pnpm test:ct`)
- [ ] E2E specs pass (`pnpm test:e2e`)
- [ ] WCAG 2.1 AA — zero axe violations
- [ ] Fonts render correctly (STIX Two, Spectral, Departure Mono)
- [ ] Reviewed at 1280px and 375px

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**For fix/refactor PRs**, use this template:

```markdown
## What changed

<!-- 1–3 sentences: what was wrong or suboptimal, what is now correct -->

## Why

<!-- The rule or standard this enforces, or the review finding that triggered it -->

## Screenshots

### After

| Route | Preview |
|---|---|
| `/route` | ![route](rawUrl) |

<!-- If before screenshots were taken:
### Before
| Route | Preview |
|---|---|
| `/route` | ![route](before-rawUrl) |
-->

## Test plan

- [ ] `pnpm validate` green
- [ ] All specs still pass (same counts as before)
- [ ] No visual regression

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Fill in the template using:
- The commit log (`git log base...HEAD --oneline`) for "What changed"
- The code review findings (if this PR was triggered by a review) for "Why"
- The `rawUrl` values from the screenshot script output for the screenshot table

### 6. Create the PR

This step uses the built-in `github-pr` skill conventions for commit analysis, title format, and `gh` CLI invocation. The difference is the body: use the visual template from Step 5 (with screenshot table) instead of a plain bullet list.

Write the body to `/tmp/pr-body.txt` first (Write tool), then:

```bash
gh pr create \
  --title "<type>(<scope>): <short summary>" \
  --base <base-branch> \
  --body-file /tmp/pr-body.txt
```

Follow the standard commit analysis steps from the `github-pr` skill (read `git diff`, `git log`, recent commit style) to fill in "What this adds" / "What changed". The visual template wraps that analysis — it does not replace it.

Return the PR URL to the user.

---

## Before screenshots (fix/refactor, optional)

To capture the state before the changes:

1. Create a temporary worktree at the base branch:
   ```bash
   git worktree add /tmp/pr-before-worktree <base-branch>
   ```
2. Start a second dev server on port 3001:
   ```bash
   cd /tmp/pr-before-worktree && pnpm install && pnpm dev -- --port 3001
   ```
3. Run the screenshot script against port 3001:
   ```bash
   node scripts/pr-screenshots.mjs --routes <routes> --label before
   ```
4. Kill the second dev server and remove the worktree:
   ```bash
   git worktree remove /tmp/pr-before-worktree
   ```

This approach is complex and requires pnpm install on the worktree. Only do this when the user explicitly asks for before/after screenshots — do not attempt it by default.

---

## Notes

- Screenshots are committed to `.docs/screenshots/{branch-slug}/` and referenced via `raw.githubusercontent.com` URLs. They become part of the branch history and are preserved after merge.
- The `cypress/screenshots/` directory is not gitignored in this project but PR screenshots are moved out of it by the script before committing.
- `cypress/snapshots/pr-screenshots.cy.ts` is outside the `cypress/e2e/` specPattern and is never run in CI.
