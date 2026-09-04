---
description: Approve a design comp — copy to .docs/design/comps/, take a screenshot, update the surface brief
license: MIT
metadata:
  author: vanch3d
  version: "1.0"
---

Approve a drafted comp and commit it as the permanent implementation reference.

**Usage:** `/comp-approve <filename>`

`<filename>` is the name of the file in `.local/design-comps/` (e.g. `homepage-comp-v1.html`).

**Steps:**

1. Verify the file exists in `.impeccable/mocks/<filename>`
2. Ensure `.docs/design/comps/` exists (create if missing)
3. Copy the file to `.docs/design/comps/<filename>` — this is the permanent, immutable record
4. Determine the surface slug from the filename (e.g. `homepage-comp-v1.html` → `src-app-page-tsx`)
5. Find the matching surface brief at `.impeccable/surfaces/<slug>.md`
6. Add or update the `**COMP:**` line in the surface brief's Direction Contract section:
   ```
   **COMP:** `.docs/design/comps/<filename>`
   ```
7. **Mark the approved option in its sidecar** — find `.impeccable/mocks/<basename>.prompt.json` and set `"approved": true` on it. If sibling versions of the same surface exist (e.g. `homepage-comp-v1.prompt.json`, `homepage-comp-v2.prompt.json`), set `"approved": false` on every other version. This makes it unambiguous which option was chosen when multiple drafts exist.
8. Report: confirmed path, surface brief updated, sidecar marked. Remind the user that the approved comp is now the spec for the nextjs-engineer — it must not be edited; new changes require a new version number.

**Note on screenshots:** If the browser tool is available, navigate to `http://localhost:5001/<filename>` and capture a screenshot to `.docs/design/comps/<basename>.png`. If not available, skip silently — the HTML file is the authoritative reference.
