# Case Studies Surface — Design Investigation

---

## Brief

Case studies are project-scoped, long-form portfolio narratives — orthogonal to a project's
factual record (positions, publications, repos) and the only part of the content model that is
genuinely open-ended in structure.

There are two sets of examples:

1. The first one (`src/content/case-studies/hivemq-edge--design-retro/`, `status: draft`), written as an
   `index.mdx` + six prose chapter files (`Portfolio_NN_*.md`) importing a `ChapterList` component
   in `mode="anchor"`, with `[!NOTE]` placeholders marking where screenshots are still needed. This
   is work in progress, not a finished reference — the design must be inferred from it, not treated
   as a locked spec.
2. Then there is a set of shorter cases, all extracted from the research projects they are highlighting.
   Their format is still MDX but as a single document. Note that the pictures relevant to the case have been extracted in the
3. subdirectory, with their refernces.

Two aspects, scoped by Nicolas as **one combined design session**, judged as a single coherent
system rather than sequential surfaces:

1. **Navigation/discoverability** — how the existence and identity of a case study is signalled
   and how a reader gets to one, across every tier: homepage project list → `/projects` listing →
   `/projects/[slug]` detail → the case study itself. `CaseStudiesBlock.tsx` already renders
   preview cards on the project page (`src/app/projects/[slug]/_components/CaseStudiesBlock.tsx`)
   linking via `caseStudyHref()` — but the destination route doesn't exist yet, so this is a live
   dead link today, not a placeholder to design from scratch.
2. **Classic rendering** — the section-based `/case-studies/[project]/[slug]` page itself: short
   text sections + illustrations (screenshots, Figma captures, etc.), inside the existing
   "Construction on Tracing Paper" world, but with room for a qualitatively different register
   than the engineering/factual surfaces (`/projects/[slug]`) — this is the portfolio-voice part
   of the site.

### What's already decided (do not re-open without flagging)

- Content model: MDX, `{project}--{slug}` flat directory, frontmatter
  `{slug, project, title, status, featured, tags}` — ADR 012, ADR 014.
- Route: `/case-studies/[project]/[slug]`, SSG, chapters auto-discovered by file presence — ADR
  012, ADR 020.
- Component rendering-classification rule (Client-with-own-i18n or plain sync Server, nothing
  async below `page.tsx`) — ADR 021. Applies to any new `_components/` built for this surface.
- `src/components/case-studies/ChapterList.tsx` and `Aside.tsx` exist today as **bare, unstyled
  scaffolding** (no design system tokens, no i18n, no a11y treatment) — placeholders to redesign
  or replace, not a starting visual direction.

### Open to this design session

- How case-study existence is signalled at each nav tier (badge/mark on a project card? a
  distinct section? nothing until the project page?).
- The classic page's section grammar — text/illustration pairing patterns, image treatment
  (screenshots vs. Figma captures vs. diagrams) within the Compass Grammar / One Red Rule /
  Flat-by-Construction rules in `DESIGN.md`.
- Whether the narrative-exploration concepts replace, sit alongside, or gate into the classic
  page — and whether that implies a second route/rendering mode (an IA question to flag, not
  silently decide inside a comp).
- A front matter for the whole case study section, using the src/content/case-studies/INTRO.md content (static page)

## Approval gate (binding — see `.claude/rules/feedback_impeccable_approval_gate.md` memory)

When the design phase closes (comp(s) approved, surface brief(s) written, direction contract
recorded), stop and present: what was decided, what the engineer would build, and the explicit
question "Ready to proceed to implementation?" **Do not** spawn `nextjs-engineer` or start any
build step without an explicit go-ahead in this session.

## Related

- ADR 012 — Case Study Content Architecture
- ADR 013 — Case Study Content Location (open)
- ADR 014 — Content Model
- ADR 020 — Rendering Strategy for `/projects/[slug]`
- ADR 021 — Component Rendering Strategy and Unified Timeline Molecule
- `.docs/tasks/2026-09-08-project-surface.md` — Track P, prior art for project-surface IA framing
- `.docs/design/comps/project-detail-comp-specimen.html` — approved visual precedent to stay
  consistent with (not to copy wholesale — case studies are explicitly allowed a different
  register per the brief above)

---

## Plan of action (proposed 2026-11-13, awaiting review)

Track P2 in `TRACKER.md`. Status: **plan formalised, not yet approved. `/impeccable` not yet triggered.**

### Findings that shaped the plan

- `src/lib/content/case-studies.ts` exists and reads `index.mdx` only. `getCaseStudyBySlug` looks for the
  folder `${project}--${slug}`, which breaks on the new content (e.g. folder `auditorygames--intrinsic-motivation`
  has `slug: auditory-games`; `calques3d--wireframe-geometry` has `slug: calques3d`; OpenEssayist has
  `project: safesea`).
- No `/case-studies/...` route exists. `CaseStudiesBlock` links to it today (live dead link).
- `src/lib/routes.ts` builds the flat `/case-studies/${project}--${slug}`, which contradicts ADR 012 and
  this brief (nested).
- The 4 short cases are a single `index.mdx` each. HiveMQ is `index.mdx` + `Portfolio_NN_*.md`
  chapters. The `ChapterList` slugs in its index do not match the chapter filenames. The chapters have
  no frontmatter and no images yet, only 9 `[!NOTE]` placeholders. `Portfolio_MakingOf.md` is not in the list.
- Images are written as `![alt](images/<piwigoId>-<stamp>.png "caption")`. Relative paths do not
  resolve in `@next/mdx` today. Most images come from Piwigo (`gallery.calques3d.org`); `_index.md`
  manifests map filename, Piwigo id, name, comment and size.
- OpenEssayist's 4 images (`openessayist-*.png`) have no Piwigo id and no manifest.
- Piwigo API checked 2026-11-13: reachable (v2.9.2). `pwg.images.getInfo` returns dimensions, comment,
  `element_url` and derivatives. **Every response is prefixed with PHP `Deprecated` HTML warnings
  before the JSON**, because Piwigo is too old. A plain `res.json()` fails.
  ADR 003 still lists Piwigo as "Deferred".
- ADR 021 forbids async work below `page.tsx`, so image ids must be resolved at page level.
- `INTRO.md` has no frontmatter; it feeds the landing page.

### Decisions

| Topic                      | Decision                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| URL                        | Nested `/case-studies/[project]/[slug]`; chapters at `/case-studies/[project]/[slug]/[chapter]` |
| Slug / project source      | Frontmatter. Folder names are only filesystem labels. No content files change                   |
| Flat vs chaptered          | Both supported; detected by whether `index.mdx` declares `chapters`                             |
| Image source               | Piwigo API at build time, resolved at page level, passed to a sync `CaseFigure`                 |
| Piwigo wrapper             | Marked **TEMPORARY** (workaround for the outdated Piwigo; remove after upgrade)                 |
| Images without a Piwigo id | Copied to `public/images/case-studies/...`, served from there                                   |
| Drafts                     | Visible on the deployed site with a "draft" mark; marker disappears on `status: published`      |
| Chapter metadata           | Open to refactoring (see below)                                                                 |

**Chapter metadata, proposal:** replace the hand-written `ChapterList` in the MDX body with a `chapters:`
array in `index.mdx` frontmatter: `{file, slug, title, teaser}`, validated by a JSON schema in
`src/schemas/`. Explicit, no edits to the chapter files, and a missing `file` fails `/validate` instead
of 404ing. The hub page renders the list. Unlisted files (`MakingOf`) are excluded.

### Phase 0: setup

- Create the feature branch first; check whether `epic/design-compass-app` exists before choosing the PR base.
- Write the Track P2 section in `TRACKER.md` with one tick per planned commit, before any `src/` commit
  (the tracker pre-commit hook blocks otherwise).
- Update `CONTEXT.md` if "flat case" / "chaptered case" are new domain terms.

### Phase 1: data layer (no design dependency, Vitest)

1. `src/lib/api/piwigo.ts`: parse JSON after skipping the PHP warning prefix, `unstable_cache`, and a
   clear "TEMPORARY workaround" comment. Update ADR 003 from "Deferred" to "Implemented with workaround".
2. Rewrite `case-studies.ts`: frontmatter-based lookup and params (flat + chapter), chapter loader,
   draft flag, image-reference scan with Piwigo id resolution and `public/` fallback, INTRO reader.
3. `CaseStudy` type and schema (with `chapters`), `/validate` coverage, fix `caseStudyHref` and its test.

### Phase 2: design (`/impeccable shape`, then comps)

- Landing page comp: INTRO + case list, draft mark.
- Detail comp: flat page, chaptered hub, chapter page with prev/next.
- `CaseFigure` image treatment (caption, aspect, screenshots vs diagrams) and the `[!NOTE]` placeholder look.
- Navigation markers: homepage under each project, `/projects` listing, project page block.
- **Stop at the approval gate.** Present decisions, what the engineer will build, and ask
  "Ready to proceed to implementation?" before spawning `nextjs-engineer`.

### Phase 3: build (`nextjs-engineer` + `tester`)

- `/case-studies` landing page (SSG).
- Detail route and chapter route (SSG).
- `mdx-components` overrides: `CaseFigure` (fed by the page-level image map), blockquote / `[!NOTE]`,
  headings, links.
- Hub chapter list and prev/next navigation components.
- Markers and links: homepage under each project, `/projects`, `CaseStudiesBlock`.
- All strings via `messages/en.json` namespaces; axe + Cypress CT per component, one E2E per page.
- `graphify update .` after code changes.

### Phase 4: the 5 core cases live

- Convert OpenEssayist's local images.
- HiveMQ `[!NOTE]` placeholders filled as screenshots arrive (content work, not code).
- `pnpm validate` and the full test run before each PR.
- One PR per phase; pause between PRs for go-ahead.

### Phase 5: only after the 5 core cases are live

- The `src/content/case-studies/TODOedge/` Edge cases. Done 2026-11-13: four converted
  (`hivemq-edge--mapping-editor`, `--policy-designer`, `--theme-and-identity`,
  `--accessible-drag-and-drop`), `TODOedge/` deleted. `case-identity-and-flows.md` was not converted
  (superseded by the theme case, still carried TODO markers).

### Design decisions log (Stage 1 review, 2026-11-13)

- Title scale: headline only.
- Reading time: dropped from the case-study page. **Parked concept:** reading time may return later, introduced
  in a principled way (derived from word count, shown consistently on the landing page and hub, not a
  per-page estimate). It needs a source of truth before it is shown.
- Hub reading guide: renders only when `index.mdx` body supplies text. No generic copy (it would read as patronising).
- Chapter-scoped subsection numbers (3.1, 3.2): accepted.
- Chapter 6 "next": decided in practice; v2 comp shows a link to the hub's Closing.
- Ruled chapter line: v1 rejected. Ticks and numerals were misaligned, the last tick had no label, and it did
  not stick, so it had no affordance and its removal cost nothing. v2 compares a sticky aligned rail against no rail.
- Figures: grouped with their paragraph and top-aligned. Margin plates on lg; inline on mobile. Blank gaps accepted.
- Heading levels: demote `###` to `##` at render. A case-study validation script is wanted once the format settles.
- Block styles: the blockquote renders roman, not italic. Add authoring-state blocks (`[!NOTE]` pending plate and TODO / work in progress).

### Stage 1 approved (2026-11-13)

- Comp `case-study-page-comp-v2.html` approved, copied to `.docs/design/comps/`; surface brief
  `.impeccable/surfaces/src-app-case-studies-project-slug-page-tsx.md`. Not committed.
- Rail kept on chapter pages only, not the hub, behind an **internal feature flag** (removable, A/B-ready).
- **Open for the build phase:** a formal app-level feature-flag mechanism (Nicolas recalls earlier ad-hoc flags; inventory them first, the graph query found none). It needs its own ADR and decision before the engineer starts. Scope: typed registry, one read path for server and client, build-time default.

### Stage 2 approved (2026-11-13)

- Landing comp `case-studies-landing-comp-v1.html` approved and copied to `.docs/design/comps/`; brief
  `.impeccable/surfaces/src-app-case-studies-page-tsx.md`. Not committed.
- Grouped by era (Engineering, Research), not by project: every case has a distinct project, so project grouping gives five single-item groups.
- `INTRO.md` renamed to `src/content/case-studies/index.mdx` (placeholder text, Nicolas rewrites later).
- Content follow-ups: project display-name lookup (slug to title), `summary` frontmatter for each case, remove the authoring H1 in `index.mdx`.

### Stage 3 approved (2026-11-13)

- Comp `case-studies-entry-points-comp-v1.html` approved, copied to `.docs/design/comps/`; brief
  `.impeccable/surfaces/src-app-case-studies-entry-points.md` carries the amendments. Not committed.
- Featured placement A (band above the timeline). Era links anchor to the era's group on the landing.
  "All case studies" link in the project block's heading rule. No Draft mark on home featured cells.
- Nav link on desktop only. Mobile collapse split out: `.docs/issues/case-studies-surface/01-site-nav-mobile-collapse.md`.
- A formal feature-flag mechanism is still an open decision (see Stage 1).

### Open questions awaiting answer

1. Is the plan approved to proceed to `/impeccable shape`?
2. May Phase 1 (data layer) start in parallel with the design phase?
3. Should `Portfolio_00_Thesis` and `Portfolio_07_Closing` be the hub's intro and outro rather than normal chapters?
