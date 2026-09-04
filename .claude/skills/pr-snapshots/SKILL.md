---
name: pr-snapshots
description: >
  Take Cypress screenshots of app routes, upload to GitHub CDN, and return
  a JSON array of { route, url }. Use this skill standalone when you only
  need visual evidence of a route. When creating a full PR with description
  and code review, use the pr-flow skill instead — it calls this internally.
license: MIT
metadata:
  author: vanch3d
  version: "2.0"
---

# PR Snapshots Skill

Takes Cypress screenshots of one or more app routes, uploads them to the
GitHub CDN (no PNGs committed to git), and returns `[{ route, url }]`.

This skill is a **capture-only primitive**. PR creation, description writing,
and code review are the responsibility of the `pr-flow` skill.

**Usage:** `/pr-snapshots [routes] [--capture viewport|fullPage] [--label before|after]`

- `routes` — comma-separated app routes. Ask if not provided.
- `--capture` — `viewport` (default) | `fullPage`. Use `fullPage` for long pages.
- `--label` — optional suffix for before/after pairs (fix/refactor PRs).

---

## Steps

### 1. Determine routes

If routes were not passed, ask:
> "Which routes should I snapshot? (e.g. `/lab/design-system,/lab/design-system/colors`)"

For **fix/refactor**: ask if before/after snapshots are needed.
- If yes: see "Before snapshots" section below.
- If no: after snapshots only.

For **feature**: after snapshots only.

### 2. Check dev server

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

If not 200, tell the user to run `pnpm dev` and re-invoke.

### 3. Take and upload snapshots

```bash
node .claude/skills/pr-snapshots/scripts/take-snapshots.mjs --routes <routes>
```

With capture mode or label:
```bash
node .claude/skills/pr-snapshots/scripts/take-snapshots.mjs \
  --routes <routes> \
  --capture fullPage \
  --label after
```

The script outputs a JSON array of `{ route, url }` where `url` is a
`github.com/user-attachments/assets/...` CDN URL — works for private repos.

Return the URLs to the caller (or show to the user if invoked standalone).

---

## Before snapshots (fix/refactor only)

Only when the user explicitly asks for before/after comparison.

1. Create a worktree at the base branch:
   ```bash
   git worktree add ../pr-before-worktree <base-branch>
   ```
2. Install deps and start a second dev server on port 3001:
   ```bash
   pnpm --dir ../pr-before-worktree install
   pnpm --dir ../pr-before-worktree dev -- --port 3001
   ```
3. Run with `--label before --port 3001`:
   ```bash
   node .claude/skills/pr-snapshots/scripts/take-snapshots.mjs \
     --routes <routes> --label before --port 3001
   ```
4. Clean up:
   ```bash
   git worktree remove ../pr-before-worktree
   ```

---

## Script reference

`scripts/take-snapshots.mjs`:
- Runs `cypress/pr-snapshots/pr-snapshots.cy.ts` via pnpm
- Viewport fixed at **1280px wide** (Tailwind `xl` breakpoint — update if theme changes)
- Uploads each PNG to GitHub CDN (`uploads.github.com`)
- Deletes local PNGs after upload
- Outputs `[{ route, url }]` to stdout

Options: `--routes`, `--label`, `--capture`, `--port` (default 3000).
