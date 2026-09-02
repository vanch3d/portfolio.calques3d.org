# branch-guard

Claude Code `PreToolUse` hook that blocks `git commit` and `git push` when the
current branch is `main`.

## Purpose

Enforces the feature-branch workflow at the agent level, mirroring the branch
protection rules applied at the GitHub repository level. The hook fires _before_
Claude Code executes the tool call, so the commit never happens rather than
needing to be reverted.

## How it works

1. Receives the `Bash` tool call as JSON on stdin
2. Ignores anything that isn't `git commit` or `git push`
3. Reads the current branch via `git symbolic-ref --short HEAD`
4. If the branch is `main`, outputs `{ "decision": "block", "reason": "..." }`
   and exits 2 — Claude Code surfaces the reason and does not run the command

## Connection to GitHub branch protection

The same rule is enforced at three layers:

| Layer | Mechanism | Blocks |
|---|---|---|
| Agent (this hook) | Claude Code `PreToolUse` | commit / push attempts by Claude |
| Repository | GitHub branch protection ruleset | direct pushes to `main` by anyone |
| CI | `ci.yml` `push` trigger on non-main only | prevents CI from running on direct pushes |

The GitHub ruleset (`main` → require PR, no direct push) is deferred until the
repo goes public or the account is upgraded to GitHub Pro. See
`project_branch_protection.md` in the project memory.

## Registration

Registered in `.claude/settings.json` as a `PreToolUse` hook on the `Bash` matcher:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "node .claude/hooks/branch-guard/branch-guard.mjs" }]
      }
    ]
  }
}
```

## Testing

```bash
# Should block (on main):
echo '{"tool_input":{"command":"git commit -m test"}}' | node .claude/hooks/branch-guard/branch-guard.mjs
echo $?   # → 2

# Should pass through (wrong subcommand):
echo '{"tool_input":{"command":"git status"}}' | node .claude/hooks/branch-guard/branch-guard.mjs
echo $?   # → 0
```
