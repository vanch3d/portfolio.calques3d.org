# Code Review Protocol

Applies to all coding work in this project. See ADR 010 for rationale.

---

## Before every commit

Spawn `vanch-code-reviewer` with `mode: commit`.

The agent reviews staged files (`git diff --cached`), applies the
appropriate skill per technology layer, and returns a verdict.

**If verdict is `NEEDS CHANGES`:** fix all violations before committing.
Do not commit and plan to fix later.

**If verdict is `PASS` or `PASS WITH SUGGESTIONS`:** proceed with commit.
Suggestions may be noted in `.local/content-issues.md` for future work.

### Hook enforcement

This protocol is also enforced mechanically via a `PreToolUse` hook in
`.claude/settings.json`. The hook intercepts `git commit` commands and
blocks them unless `vanch-code-reviewer` has written `.local/.review-done`.

**To disable the hook and rely on this rule file alone:**
1. Remove or comment out the `PreToolUse` entry in `.claude/settings.json`
2. The rule file still applies — Claude will follow it as instruction
3. Document the reason in `.local/content-issues.md`

**Emergency bypass (without editing settings.json):**
```bash
VANCH_SKIP_REVIEW_GATE=1 git commit ...
```

---

## Before every PR

Spawn `vanch-code-reviewer` with `mode: pr`.

The agent reviews the full branch diff (`git diff main...HEAD`), applies
all applicable skills, and writes its report to `/tmp/pr-review.md`.

Use that report as the source for the PR description sections:
- "What was built"
- "Key decisions"
- "Test results"

Do not write the PR description independently of the review report.

There is no hook for PR creation — the rule file is the enforcement mechanism.

---

## Skill coverage (current)

| Technology | Skill |
|---|---|
| TypeScript | `/typescript` |
| Next.js App Router | `/masanao-ohba-claude-manifests-code-reviewer` |
| Tailwind CSS v4 | `/tailwind-4` |
| Playwright E2E | `/playwright` |
| Cypress CT/E2E | Manual review (no skill yet) |

Update this table when new skills are added.
