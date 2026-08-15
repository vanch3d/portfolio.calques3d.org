#!/usr/bin/env python
"""
Pre-commit review gate for vanch-code-reviewer.

Reads the Bash tool input from stdin (JSON), intercepts git commit commands,
and checks whether the vanch-code-reviewer has already run for this commit.

Exit codes (Claude Code convention):
  0 — allow the tool call to proceed
  2 — block the tool call; message printed to stdout is shown to Claude

The reviewer signals completion by writing .local/.review-done.
This hook consumes that flag on success (one flag per commit).

To disable hook enforcement and rely on the rule file alone:
  Set VANCH_SKIP_REVIEW_GATE=1 in your environment, or remove the
  PreToolUse hook entry from .claude/settings.json (see ADR 010).
"""

import sys
import json
import os
import pathlib

# Allow escape hatch for emergencies
if os.environ.get("VANCH_SKIP_REVIEW_GATE") == "1":
    sys.exit(0)

try:
    data = json.load(sys.stdin)
except (json.JSONDecodeError, EOFError):
    sys.exit(0)

cmd = data.get("command", "")

# Only intercept git commit commands (covers `git commit` and `git -C <path> commit`)
if "commit" not in cmd or "git" not in cmd:
    sys.exit(0)

# Ignore non-commit uses of the word "commit" (e.g. reading commit history)
# A real commit command always has `commit` as a git subcommand
import re
if not re.search(r"git\b.*\bcommit\b(?!\s*--\s*\w+\s*|hash|log|message|sha)", cmd):
    sys.exit(0)

flag = pathlib.Path(".local/.review-done")
if flag.exists():
    flag.unlink()  # consume — valid for one commit only
    sys.exit(0)

print("CODE REVIEW REQUIRED before committing.")
print("Spawn vanch-code-reviewer with mode: commit, then retry the commit.")
print("(Set VANCH_SKIP_REVIEW_GATE=1 to bypass in an emergency.)")
sys.exit(2)
