# TODO — Deferred issues to revisit

Items here are not blocking current work. They are flagged for a future pass once the
prerequisite content or routes exist.

---

## Navigation

### Top navigation bar — responsive layout

**Status:** deferred — needs more routes and real content to design against
**Prerequisite:** homepage and at least one content section (Research or Engineering) rendered

The nav breadcrumb / label bar in the lab section does not adapt well enough to
narrower viewports. The current implementation assumes a horizontal layout that
breaks on mobile. Once more routes and actual page content are in place, review:

- Breakpoint strategy (collapse to a single row? hamburger? scroll?)
- Whether the breadcrumb pattern holds at mobile or needs a different treatment
- Spacing and font-size at 375px vs 768px
- Consistent behaviour across lab sub-pages and eventual main-site pages
