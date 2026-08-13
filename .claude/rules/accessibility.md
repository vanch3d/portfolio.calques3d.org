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
- [ ] All images have `alt` text
- [ ] All interactive elements are keyboard-reachable
- [ ] All form inputs have `<label>` or `aria-label`
- [ ] `aria-label` or `aria-labelledby` on landmark regions where heading is not present
- [ ] Colour contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)
- [ ] CT spec includes at least one `cy.checkA11y()` call
