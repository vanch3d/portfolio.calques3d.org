# Issue tracker: local markdown

Tickets for this repo live as committed markdown files in `.docs/issues/`. Specs live separately in `.docs/tasks/` (unchanged, pre-existing convention — see `.docs/tasks/TRACKER.md`). See ADR 025 for why (`.docs/adr/025-adopt-spec-ticket-index-model-for-engineering-progress-tracking.md`).

No GitHub Issues, no `gh` CLI. This is a solo, private repo with no external contributors — `/triage` and the GitHub/GitLab tracker backends don't apply here.

## Conventions

- One feature per directory: `.docs/issues/<feature-slug>/`
- The spec for a feature is its task doc — `.docs/tasks/<date>-<feature-slug>.md` — not a file inside `.docs/issues/`. A ticket's body should link back to the spec it came from.
- Tickets are one file per ticket at `.docs/issues/<feature-slug>/NN-<slug>.md`, numbered from `01`, never a single combined file.
- Each ticket file starts with `Status:` and, where relevant, `Blocked by: NN, NN` lines near the top.
- **Status vocabulary** (no `triage` skill installed, so the canonical triage-role strings don't apply): `open` → `claimed` → `resolved` | `wontfix`.
- Judgment calls, verification results, and decision narrative belong in the ticket file, not in `TRACKER.md`. `TRACKER.md` only carries a one-line pointer per active spec.
- Comments and conversation history append to the bottom of the file under a `## Comments` heading; the resolution answer goes under `## Answer` or `## Resolution`.

## Persistence

Tickets are **committed**, not gitignored — this deviates from the `mattpocock-skills` default (`.scratch/`, meant to be throwaway). This repo's review workflow requires durable, git-visible artifacts: Nicolas reviews the whole branch before merge, so a ticket has to survive as part of that diff.

Tickets are lifecycle-bound to their feature, not permanent like ADRs. Once a spec's work ships and its branch merges, its `.docs/issues/<feature-slug>/` directory may be deleted in a cleanup commit — git history retains it if ever needed.

## When a skill says "publish to the issue tracker"

Create a new file under `.docs/issues/<feature-slug>/` (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. Pass the path or ticket number directly rather than a bare number — a fresh session has no reliable way to resolve `#3` on its own.

## Wayfinding operations

Used by `/wayfinder`, only for genuinely foggy multi-session planning (see ADR 025's non-goals — not the default). The **map** is a file with one **child** file per ticket.

- **Map**: `.docs/issues/<effort>/map.md` (the Notes / Decisions-so-far / Fog body).
- **Child ticket**: `.docs/issues/<effort>/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `open`/`claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `.docs/issues/<effort>/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
