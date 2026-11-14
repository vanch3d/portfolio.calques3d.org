---
name: pr-commits
description: >
  How this repo plans, writes and orders the commits of a branch: commit plan
  document first, conventional-commit messages, what rides with a feature commit,
  one TRACKER tick per src commit, splitting shared files across commits, never
  committing to main, graphify committed after review and push. Use whenever the user asks
  for "the commits", "semantic commits", a commit plan, or before staging or
  committing a branch's work. Not for opening the PR: that is pr-flow.
license: MIT
metadata:
  author: vanch3d
  version: "1.1"
---

# PR commits

Turns the working tree of a feature branch into a reviewed, ordered series of
commits. Commits go on the **feature branch only**; the user merges. This skill
ends where `pr-flow` begins.

**Usage:** `/pr-commits`. The base branch is derived as in `pr-flow` step 1: the
candidate (`main` or a local `epic/*`) the branch is the fewest commits ahead of.

---

## 1. The approval gate (hard rule)

- **Never stage, commit or push without explicit approval.** Staging is not a safe
  in-between step. Present a plan, wait.
- A "go" covers the **named work only**. "The CI is failing" or "X is broken" is a
  report, not a go-ahead: fix in the working tree if useful, show the diff, ask.
- Approval *does* exist for a named sequence: "go" on an agreed commit plan, "you can
  push now", "commit graphify and push".
- **Never commit directly to `main`, and never push to it.** Work on a feature branch
  (`feat/`, `fix/`, `chore/`, `docs/`, `refactor/`, `test/`), created before the first
  commit. `branch-guard` blocks commits and pushes on `main` locally.
- Never run `gh pr ready` or merge: draft = the owner's approval gate.
- If a subagent touched git, verify with `git log --oneline` and `git status`
  before relaying its summary.

## 2. Process

0. **Format**: `pnpm lint:prettier:write` on the whole repo (section 7). It modifies files,
   so it comes before the survey and the plan, which then include its changes.
1. **Survey** (read-only): `git status --short`, `git diff --stat`, new files, deletions.
   Anything unrelated to the task (generated files such as `graphify-out/`, leftovers) is
   called out in the plan, not silently included. Formatting changes are never "unrelated":
   see section 7.
2. **Write the plan** to `.local/tmp/<YYYY-MM-DD>-<slug>-commit-plan.md` (gitignored,
   throwaway: it is only there to be reviewed and shared, and is cleaned up later):
   - the hook constraints that apply (section 6);
   - a table: `# | subject | files | TRACKER tick`;
   - a draft message per commit;
   - open points. Do not run any `git add` yet.
3. **Wait for review.** Adjust the plan; the user says "go".
4. **Execute**, one commit at a time (sections 3 and 6): stage, write the message to
   `.local/tmp/commit-msgs/NN.txt`, `git commit -F <file>`, from the repo root.
5. **Verify**: `git log --oneline <base>..HEAD`, and `git status --short` is clean (except
   what is deliberately left, see graphify in section 7).
6. **Push only on approval**, then hand over to `pr-flow`.

Do **not** re-run tsc/Vitest/Cypress for each commit: they are run once on the final
tree before the PR; CI covers the rest.

## 3. Message format (conventional commits)

```
type(scope): lower-case imperative subject, no trailing period

Prose body wrapped near 78 columns saying WHAT changed and WHY, not how.
Mention ticket or ADR paths when relevant (ADR 029,
.docs/issues/<feature>/NN-<slug>.md). No bullet lists unless the change is
a list.

<attribution trailer>
```

- **Types:** `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `content`.
  Scope = the surface or module (`ui`, `routes`, `projects`, `case-studies`,
  `layout`, `e2e`, `graphify`, `agents`, `skills`...).
- **Subject:** 60-90 characters is normal here; lower-case after the colon.
- **Trailer:** the one the session reminder gives for commits, on every commit. Its shape
  is `Co-Authored-By: Claude <model> <noreply@anthropic.com>`; never hard-code the model.
- A pure `chore(graphify)` commit may have no body, only the trailer.
- Tickets: refer by path, never `#123` (no GitHub Issues, ADR 025).

## 4. What rides with a feature commit

- Its **tests** (CT spec, Vitest, or the E2E that covers it).
- Its **ADR**, in the same commit as the code it records (and `.docs/adr/TAGS.md` if the
  ADR adds a reference to a tag).
- Its **`messages/en.json` keys**: added in the commit that first uses them, removed in
  the commit after which no code reads them.
- Its **`TRACKER.md` tick**: one checklist line per `src/` commit.
- **Formatting**: already inside each commit, including every intermediate version of a
  split file (`stage-version.mjs` checks them, section 6). The only formatting commit is
  `style: prettier applied`, for files unrelated to the branch, if a repo-wide pass was needed.
- **Not** with a feature commit: tickets and design docs (a `docs` commit),
  `graphify-out/` (after push).

## 5. Ordering rules

Order so every commit compiles on its own:

1. New components first, before anything uses them (with their specs).
2. Then one route / surface family per commit.
3. Switch global behaviour on (root layout, flags) only after every page it needs is ready.
4. End-state test (E2E) after the code it asserts.
5. Message keys: added before use, removed after the last reader is gone.
6. `docs` (tickets, tracker follow-ups).
7. `chore(graphify)` after review and push (section 7).

## 6. Hooks that shape the commits

Commit-time (PreToolUse on Bash, `.claude/settings.json`):

| Hook | Effect |
|---|---|
| `branch-guard` | blocks `git commit` / `git push` on `main`; regex `^git (commit\|push)\b` |
| `pre-commit-validate` | runs `pnpm validate` before each commit; regex `^git commit\b` |
| `tracker-commit-guard` | any commit staging a `src/` file must also stage `.docs/tasks/TRACKER.md`: plan one tick per src commit up front; regex `\bgit\b.*\bcommit\b` |

The first two only match a command that **starts with** `git commit` / `git push`, so
`cd x && git commit` or `git -C x commit` slip past them. Always run `git commit` as the
first word, from the repo root.

While editing (PostToolUse, advisory, Write/Edit **tools** only):

| Hook | Effect |
|---|---|
| `prettier-guard` | formats the edited file; changes made through Bash (`sed`, `cat >>`, node scripts, `cp`) are not covered, hence step 0 |
| `eslint-guard` | runs ESLint on the edited file |
| `ts-guard` | runs `tsc --noEmit` after a TypeScript file is edited |
| `test-file-check` | warns when a component or utility has no co-located test |
| `tracker-reminder` | PostToolUse on Bash: after `pnpm test`, `pnpm validate` or `cypress run`, reminds to update the tracker (commit-time enforcement is `tracker-commit-guard`) |

Also active: `agent-graphify-guard` and `skill-graphify-guard` (an `Agent` prompt, or a
`Skill` call with args, must mention graphify in its first ~300 characters) and the
graphify search/read guards (a `graphify query` is expected before exploring code).

Practicalities:

- Message via file: `git commit -F .local/tmp/commit-msgs/NN.txt`. No heredocs.
- One Bash call to stage, one to commit; avoid `&&` chains (approval friction).
- A user-level hook (outside this repo) may rewrite a Bash command; the harness then
  denies it with "issue the call again with exactly this input". Re-issue that input
  unchanged, alone in the response.
- **TRACKER shape:** a checklist block per branch, one tick per `src/` commit. No commit
  hashes in the ticks: ADR 025 allows a SHA in an index line, but adding one needs another
  `src/` commit, so the ticks stay hash-free here. Example (the block is inserted before
  an existing anchor line of `.docs/tasks/TRACKER.md`):

  ```
  - Track P5 — Page shell + skip nav (ADR 029). Branch: `feat/page-shell`.
    - [x] SkipNav
    - [ ] PageShell + ADR 029
    - [ ] routes on the shell
    - Follow-ups: `.docs/issues/<feature>/01-<slug>.md`
  ```

### Splitting a shared file across commits

When one file (`messages/en.json`, `TRACKER.md`) needs different content in several
commits, build the cumulative versions, then stage each one without touching the working
tree.

1. In a throwaway script under `.local/tmp/`, read the base with `git show HEAD:<file>`
   and apply the edits step by step, writing one version per commit. Make every edit an
   exact-match replacement that must match **once** (fail otherwise), and write the new
   text already formatted:

   ```js
   let text = execSync('git show HEAD:messages/en.json', { encoding: 'utf8' })
   const steps = [(s) => replaceOnce(s, 'old text', 'new text') /* , one per commit */]
   steps.forEach((step, i) => {
     text = step(text) // cumulative
     writeFileSync(`.local/tmp/stages/en.step${i + 1}.json`, text)
   })
   ```

2. Stage version N just before commit N (from the repo root; `<repo-path>` is relative to
   the root):

   ```bash
   node .claude/skills/pr-commits/scripts/stage-version.mjs messages/en.json .local/tmp/stages/en.step2.json
   # the LAST version of the series must equal the file on disk:
   node .claude/skills/pr-commits/scripts/stage-version.mjs messages/en.json .local/tmp/stages/en.step4.json --final
   ```

The helper refuses to stage a path git does not know, a version that is not
Prettier-formatted for that path (`--no-format-check` to skip), and, with `--final`, a
version that differs from the working-tree file. See the script header for the details.

## 7. Formatting and graphify

- **Prettier, and why it is step 0.** The author's IDE (WebStorm) formats on every save,
  so the author's changes are clean. An agent's edits are not formatted automatically:
  `prettier-guard` only fires on the Write/Edit tools, so anything changed another way
  (`sed -i`, `cat >>`, node scripts, `cp`, version staging) is missed, and Markdown /
  MDX / JSON files are the usual casualties. Therefore the whole-repo pass
  (`pnpm lint:prettier:write`) runs **before** surveying and planning, never after the plan
  is reviewed. It honours `.prettierignore` (and `.gitignore`): `.claude/`, `graphify-out/`
  and other listed paths are skipped by design, so format those by hand if they matter.
  Whatever the pass changes is part of this branch and is the agent's responsibility.
  - Changes to files the branch already touches go into the planned commits they belong to.
  - Changes to files unrelated to the branch go into **one** commit, `style: prettier
    applied`: no body, no list of files.
  - Never revert, exclude or work around files it touches, even if they look unrelated.
- **`chore(graphify): refresh the knowledge graph`**: leave `graphify-out/` out of the
  feature commits (it is already modified before the branch starts). After review and
  push, run `graphify update .`, commit the six files, push. Do this once, not per commit.

## 8. Pitfalls seen

- `git add -A -- <dir>` stages deletions inside a directory; `git status` collapses
  untracked directories, so list paths explicitly before staging.
- Stage and commit in two separate calls, and confirm with `git diff --cached --stat` that
  exactly the planned files are staged before running `git commit`.

## Related

- `pr-flow` (open the draft PR, review, comment), ADR 016 and ADR 010.
- `.docs/tasks/TRACKER.md`, ADR 025 (spec / ticket / index model).
