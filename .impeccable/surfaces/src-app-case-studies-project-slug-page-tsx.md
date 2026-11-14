---
version: 1
slug: 'src-app-case-studies-project-slug-page-tsx'
primary_target: 'src/app/case-studies/[project]/[slug]/page.tsx'
related_targets:
  - 'src/app/case-studies/[project]/[slug]/[chapter]/page.tsx'
  - 'src/app/case-studies/_components/'
  - 'src/components/case-studies/ChapterList.tsx'
  - 'src/content/case-studies/'
---

## Surface

Routes: `/case-studies/[project]/[slug]` (flat case, or chaptered hub) and `/case-studies/[project]/[slug]/[chapter]`.
Visitor mode: **Read**
Audience: A recruiter or peer arriving from a project page or the case-studies landing, reading a long-form design retrospective.

## Job / Task / Proof

The visitor reads one case, flat or chaptered, and leaves able to judge the reasoning behind the work. The proof is the figures: every claim sits beside the screenshot that evidences it.

## Constraints

- Flat and chaptered cases share one section grammar; chaptered adds a hub, a chapter page and prev/next.
- Headline title scale only (sentence-length titles). No reading time (parked: see task doc).
- Reading guide on the hub renders only when the `index.mdx` body supplies text. No generic copy.
- Chapter-scoped subsection numbers (3.1, 3.2) on chapter pages. Flat cases use 1, 2, 3.
- Margin plates on lg. Inline plates below lg. Each plate is grouped with its paragraph and top-aligned (needs a remark/rehype grouping step).
- Chapter rail (sticky, aligned, 6 chapters plus Closing END node) renders on chapter pages only, not on the hub, **behind an internal feature flag**. The page must be complete and coherent with the rail off (variant B: a plain "Chapter n of 6" label).
- Chapter 6's next links to the hub's Closing.
- Authoring-state blocks: pending plate for `[!NOTE]`, work-in-progress block, draft mark. None use red. The note body is an authoring instruction and is never rendered.
- Blockquote renders roman (Incline Rule). `###` headings are demoted to `##` at render.
- One Red Rule: the current-chapter tick is the only red on a chapter page. Flat cases and the hub carry none.
- WCAG 2.1 AA zero violations. Strings via next-intl, one namespace per component.

## Direction Contract

**THESIS:** The case study as a numbered plate series on the Construction on Tracing Paper sheet: prose in the reading column, evidence in the margin.

**OWN-WORLD:** Construction on Tracing Paper (DESIGN.md), headline-scale titles, margin plates with numbered frames, ruled chapter rail.

**COMP:** `.docs/design/comps/case-study-page-comp-v2.html`

**FEATURE FLAG:** the chapter rail is conditional on an internal flag so it can be removed outright or A/B tested. An app-level flag mechanism is under consideration (see the task doc).

**Proposed tokens:** `--margin-plate-w` (280px) and a pager max-width. The repo's `--text-caption` is 0.875rem, so the comp's older 0.9375rem value should be reconciled to the repo.
