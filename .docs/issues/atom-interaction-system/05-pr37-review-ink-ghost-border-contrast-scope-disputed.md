Status: open
Type: task

# PR #37 review flagged 3 more `ink-ghost` borders — scope contradicts the recorded design decision

Spec: `.docs/design/2026-09-14-critique-ink-ghost-contrast-and-atom-affordance.md` (Finding 1)

The `.local/tmp/pr-review.md` code review for PR #37 raised an error-level finding: the PR's sitewide `ink-ghost` → `ink-secondary` contrast fix migrated text but left `border-medium border-ink-ghost` (or `border-ghost border-ink-ghost`) untouched on three components —

- `src/app/projects/[slug]/_components/RestrictedBlock.tsx:17` — the section's whole-block resting border
- `src/app/lab/adr/_components/InsightCalloutStrip.tsx:44,55` — tag-chip `<li>` borders and the related-ADR box border
- `src/app/lab/adr/_components/AdrRegisterHeader.tsx:75,81` — dimension-line tick borders

The review reads this as CI staying green while contradicting the PR's own stated fix (axe's `color-contrast` rule only checks text, not borders).

## Why this wasn't applied as a blind fix

The critique doc that scoped the original fix explicitly carves out this exact pattern:

> Static, non-interactive documentation framing — `NamedRuleCard`'s `border-medium border-ink-ghost`, `MoleculeFrame`'s `border-b-medium border-ink-ghost` — is lower risk: 1.4.11 targets UI components and meaningful graphical objects, not decorative content dividers, so these read as acceptable "construction guide" framing per DESIGN.md's own definition. Not a required fix, but worth a second look once the interactive cases are settled.

All three of `RestrictedBlock`, `InsightCalloutStrip`, and `AdrRegisterHeader`'s flagged borders are the same pattern: static, non-interactive, informational/decorative framing (a notice box, a tag list, a technical-drawing dimension line) — not an interactive control boundary like `FilterInput` or the `TagFilterDrawer` chip buttons, which the critique's Recommendation 4 explicitly required to move to `ink-secondary` and which this PR already does.

## Question

Does Nicolas want this exemption extended to these three, per the critique's own stated scope (in which case the review finding is a false positive, close as not-required) — or does he want the border-contrast bar raised project-wide regardless of interactivity (in which case this needs a design pass, not just three border-color swaps, since `AdrRegisterHeader`'s dimension line and `InsightCalloutStrip`'s ghost rule are explicitly built as "construction guide" framing per DESIGN.md)?

## Answer

_pending_
