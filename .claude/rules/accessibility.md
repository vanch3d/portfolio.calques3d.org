# Accessibility Rules

Components and pages MUST be accessible in the widest range of scenarios
possible. Accessibility is not a post-launch concern — it is enforced
continuously in the test pipeline. See ADR 007.

---

## The hard rule

**Every component and page must pass axe-core WCAG 2.1 AA checks with zero violations.**

Violations must be fixed. Exclusions (`.checkA11y(null, { rules: { ... } })`) are only
permitted with a code comment citing the specific reason and a ticket to resolve it.
"We'll fix it later" is not a reason.

---

## Semantic fitness (a judgement call, not a lint rule)

axe checks that markup is *valid*. It cannot tell that markup is *under-specified*: a
`<p>` label beside a `<p>` value passes every rule. Choosing the element that says what the
content *is* is the author's job. Apply these when writing or reviewing a component.

| If the content is… | Use | Not |
|---|---|---|
| A label paired with a value (metadata, specs, state + description) | `<dl>` of `<div><dt/><dd/></div>` groups | two `<p>`s |
| A visual section label (uppercase "PUBLICATIONS", "RESTRICTED") | a heading: `SectionLabel as="h2"` / `"h3"` | `<p className="label">` |
| A run of sibling items (chips, link rows, counts, prev/next) | `<ul>`/`<li>`, with `aria-label` when nothing visible names it | `<div>`/`<span>` run |
| A caption naming a specimen, image or diagram | `<figure>` + `<figcaption>` | a `<p>` above or below |
| A region a heading names | `<section aria-labelledby={headingId}>` | a `<div>` |

**Heading levels.** The page title is the one `h1`. Section labels are `h2`; anything inside a
section (cards, specimen names) is `h3`. Never skip a level to get a size, because the size
comes from the class, not the element. Headings inherit the base layer's italic display style,
so `SectionLabel` resets it. Use it rather than `h2.label`.

**When a plain `<p>` is correct.** Do not over-structure:
- prose and descriptions
- an eyebrow above an `h1` (era label, "404")
- an inline meta strip whose items may be absent (an empty `<li>` is worse than a `<p>`)
- empty-state and status text

**Check by reading the tree, not the page.** Ask what a screen reader user would hear: a
heading outline, named lists, term/definition pairs, or an undifferentiated run of text. If it
is the last one, the markup is under-specified even though axe is green. Test the structure in
CT with role queries (`findByRole('list', { name })`, `contains('dt', …)`), not `find('p')`.

Keep `list-none` on lists whose bullets are not part of the design, and keep the old
paragraph's bottom margin when swapping `<p>` for `<dd>`: the base layer styles `p` only.

---

## Tooling

| Layer | Tool | Standard |
|---|---|---|
| Cypress CT | `cypress-axe` — `cy.checkA11y()` | WCAG 2.1 AA |
| Cypress E2E | `cypress-axe` — `cy.checkA11y()` | WCAG 2.1 AA |
| Playwright | `@axe-core/playwright` — `AxeBuilder.withTags([...]).analyze()` | WCAG 2.1 AA |

All three use axe-core (Deque open-source edition). The commercial Deque edition
adds additional checks (e.g. best practices, experimental rules) but is not required.

---

## Cypress CT pattern

Every component spec must include at least one axe check. Test the default
state AND key variants (e.g. optional fields populated, empty states).

```tsx
it("has no axe accessibility violations (default state)", () => {
  cy.mountAccessible(<ProjectCard project={base} labels={labels} />);
  cy.checkA11y();
});

it("has no axe accessibility violations (with optional fields)", () => {
  cy.mountAccessible(
    <ProjectCard project={{ ...base, funding: "EPSRC" }} labels={labels} />
  );
  cy.checkA11y();
});
```

Use `cy.mountAccessible()` (defined in `cypress/support/commands.ts`) rather than
`cy.mount()` + `cy.injectAxe()` — it's a single call.

### The mount scaffold already provides landmarks and headings

`cy.mountAccessible()` wraps the component in a scaffold that supplies `<main>`, an `h1`,
and a visually hidden `h2` (from `wrapWithSection`). Specs must work with that:

- Never wrap a fixture in `<main>`. It duplicates the landmark and fails axe
  (`landmark-main-is-top-level`, `landmark-no-duplicate-main`, `landmark-unique`). Use a `<div>`.
- Never query a bare `cy.get('h1')` or `cy.get('h2')`: the scaffold's headings match too.
  Scope the query to the component's `data-testid`, or use `cy.contains('h1', 'text')`.

---

## Cypress E2E pattern

Inject axe in `beforeEach` (after `cy.visit()`) so it covers every test in the
block. Add a dedicated `it("has no axe accessibility violations")` at the top.

```ts
beforeEach(() => {
  cy.visit("/research");
  cy.injectAxe();
});

it("has no axe accessibility violations", () => {
  cy.checkA11y();
});
```

---

## Playwright pattern

Add a dedicated accessibility test per page. Use `withTags` to pin to WCAG 2.1 AA.

```ts
import AxeBuilder from "@axe-core/playwright";

test("page: no accessibility violations", async ({ page }) => {
  await page.goto("/research");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

---

## Next.js App Router considerations

- **Server Components** render to static HTML. axe runs against the final DOM in
  the browser, so Server Component output is covered automatically — no special setup needed.
- **`cy.injectAxe()`** must be called *after* the page/component has fully rendered.
  For pages with async data loading, add a `cy.wait()` or element assertion before injecting.
- **Hydration**: the CT iframe and E2E browser both see post-hydration DOM.
  Hydration-introduced accessibility regressions (e.g. missing attributes added
  client-side) will be caught by the axe checks.

---

## What counts as a "user-facing scenario"

Test axe on:
- Default/empty state
- With all optional fields populated
- Error states and empty states
- Different content lengths (short title, long title)

Do NOT test purely visual states (colour contrast with custom themes, focus rings)
unless using `cy.configureAxe` to enable those rules explicitly.

---

## Authoring checklist

When writing a new component:
- [ ] Semantic HTML elements (`<article>`, `<section>`, `<nav>`, `<header>`, etc.)
- [ ] Passes the "Semantic fitness" table: label/value → `dl`, section label → heading, sibling runs → list, caption → `figcaption`
- [ ] All images have `alt` text
- [ ] All interactive elements are keyboard-reachable
- [ ] All form inputs have `<label>` or `aria-label`
- [ ] `aria-label` or `aria-labelledby` on landmark regions where heading is not present
- [ ] Colour contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)
- [ ] CT spec includes at least one `cy.checkA11y()` call
