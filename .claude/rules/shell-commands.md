# Shell Command Rules

These patterns repeat. Do not reproduce them. New rejections go in `.local/safety-log.md`.

---

## No `cd`

Shell state does not persist between Bash tool calls. `cd` has zero effect on the next call.
Use absolute paths or command-native flags instead.

```bash
# Wrong
cd /c/Users/Nicolas/WebstormProjects/nextjs-vanch-website && pnpm test

# Right
pnpm --dir /c/Users/Nicolas/WebstormProjects/nextjs-vanch-website test
git -C /c/Users/Nicolas/WebstormProjects/nextjs-vanch-website status
```

---

## No heredoc / inline multiline strings

A `#`-prefixed line after a quoted newline (markdown headings, co-author lines) triggers
the permission line-scanner and rejects the command.

Write content to a file with the Write tool first, then reference it:

```bash
git -C /c/Users/... commit -F /c/Users/Nicolas/WebstormProjects/nextjs-vanch-website/.local/commit-msg.txt
gh pr create --title "..." --body-file /c/Users/Nicolas/WebstormProjects/nextjs-vanch-website/.local/pr-body.md
```

Files: `.local/commit-msg.txt` and `.local/pr-body.md` (gitignored). Never use `.git/`.

---

## No `/tmp/` for files passed to external tools

Windows tools (`gh.exe`) receive the Windows-mapped path and cannot resolve `/tmp/`.
Always use the full `C:/Users/Nicolas/WebstormProjects/nextjs-vanch-website/.local/` path
when writing files that will be passed via flags to `gh` or other external tools.

---

## No `npm` — use `pnpm`

```bash
pnpm install / pnpm run build / pnpm dlx ...
```

---

## No long inline `node -e`

Write to `scripts/*.mjs` using the Write tool, then `node scripts/my-task.mjs`.
