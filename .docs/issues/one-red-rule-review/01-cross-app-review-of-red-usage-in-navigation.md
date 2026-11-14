Status: open

# Review the One Red Rule across the whole app, starting with navigation

Raised while settling `.docs/issues/case-studies-surface/03-hand-rolled-breadcrumb-bars.md`.

## Problem

The One Red Rule (a single `--color-active` element per surface) is under pressure from navigation that is no longer simple:

- **Project page** (`/projects/[slug]`): red on the breadcrumb's current crumb, red on the "present"/ongoing status tag in the classification header, and red again in the footer's career ruler.
- **Case-study chapter page**: the breadcrumb's current crumb is red together with the chapter rail's red tick.
- **ADR register**: the page previously kept its current crumb `text-ink` to stay within the rule; moving to the shared `Breadcrumb` makes it red like every other route.

The decision taken for the page-shell work (ADR 029): the breadcrumb's current crumb keeps its red everywhere, and the rule is reviewed as a whole instead of patched surface by surface.

## Scope

- Inventory every use of `active-mark` / `text-active` / `bg-active` / `border-active` by surface, and mark which are navigation (breadcrumb, rail, pager) and which are status or data.
- Decide what the rule means on a multi-region page: one red per page, per region, or per kind of signal.
- Update `DESIGN.md`, the design-system "Named rules" card (`NamedRuleCard`) and the E2E assertions that count `.active-mark` (`design-system.cy.ts`, `lab.cy.ts`, `adr.cy.ts`) to match the outcome.

## Related

- `.docs/adr/029-shared-page-shell-and-skip-nav-for-every-route.md`
- `.docs/issues/case-studies-surface/03-hand-rolled-breadcrumb-bars.md`
