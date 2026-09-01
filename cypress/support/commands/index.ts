// Custom Cypress commands.
// cypress-axe extends cy with: injectAxe(), configureAxe(), checkA11y()
import "cypress-axe";
import type { Result, NodeResult } from "axe-core";
import { wrapWithSection } from "./A11yWrapper";
import { wrapWithRouter, type RouterWrapperOptions } from "./RouterWrapper";
import { wrapWithIntl } from "./IntlWrapper";
import messages from "../../../messages/en.json";

// ── Axe violation logger ──────────────────────────────────────────────────
// Passed to cy.checkA11y() as the violationCallback so that CI logs show
// the full rule ID, impact, description, and affected selectors — not just
// a count. Without this, failures are impossible to debug in headless runs.
function logA11yViolations(violations: Result[]): void {
  violations.forEach((violation) => {
    const selectors = violation.nodes
      .map((node: NodeResult) => node.target.join(", "))
      .join("\n  ");

    Cypress.log({
      name: `a11y [${violation.impact}]`,
      message: `${violation.id}: ${violation.description}`,
      consoleProps: () => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes,
      }),
    });

    // Also cy.log so the violation appears inline in the CI command log.
    cy.log(
      `**a11y violation** [${violation.impact}] \`${violation.id}\`\n` +
        `${violation.description}\n` +
        `Affected: ${selectors}`
    );
  });
}

// ── cy.checkA11y ──────────────────────────────────────────────────────────
// Override: always attach logA11yViolations so violations are readable in CI.
// Signature matches cypress-axe — context and options are optional pass-through.
Cypress.Commands.overwrite(
  "checkA11y",
  (
    originalFn: (
      context?: Parameters<typeof cy.checkA11y>[0],
      options?: Parameters<typeof cy.checkA11y>[1],
      violationCallback?: Parameters<typeof cy.checkA11y>[2],
      skipFailures?: Parameters<typeof cy.checkA11y>[3]
    ) => void,
    context?: Parameters<typeof cy.checkA11y>[0],
    options?: Parameters<typeof cy.checkA11y>[1],
    violationCallback?: Parameters<typeof cy.checkA11y>[2],
    skipFailures?: Parameters<typeof cy.checkA11y>[3]
  ) => {
    // Compose: call any caller-supplied callback first, then our logger.
    const combinedCallback = violationCallback
      ? (violations: Result[]) => {
          violationCallback(violations);
          logA11yViolations(violations);
        }
      : logA11yViolations;

    return originalFn(context, options, combinedCallback, skipFailures);
  }
);

// ── cy.mountAccessible ────────────────────────────────────────────────────
// Convenience: mount + inject axe in one step for CT specs.
// Applies two wrappers:
// 1. wrapWithRouter — provides mock Next.js AppRouterContext + PathnameContext
//    so components using usePathname() / useRouter() work in CT without a
//    real Next.js server. Default pathname is "/".
// 2. wrapWithSection — inserts a visually-hidden h2 between the scaffold h1
//    and the component, giving heading hierarchy h1 → h2 → h3 (component).
// Use cy.mountAccessible(jsx) instead of cy.mount(jsx) + cy.injectAxe().
Cypress.Commands.add(
  "mountAccessible",
  (component: Parameters<typeof cy.mount>[0], routerOptions?: RouterWrapperOptions) => {
    cy.mount(wrapWithIntl(wrapWithRouter(wrapWithSection(component), routerOptions), messages));
    cy.injectAxe();
  }
);

declare global {
  namespace Cypress {
    interface Chainable {
      mountAccessible(
        component: Parameters<typeof cy.mount>[0],
        routerOptions?: RouterWrapperOptions
      ): Chainable;
    }
  }
}
