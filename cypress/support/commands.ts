// Custom Cypress commands.
// cypress-axe extends cy with: injectAxe(), configureAxe(), checkA11y()
import "cypress-axe";

// Convenience: mount + inject axe in one step for CT specs.
// Use cy.mountAccessible(jsx) instead of cy.mount(jsx) + cy.injectAxe()
// when the first thing you want is an accessibility check.
Cypress.Commands.add(
  "mountAccessible",
  (component: Parameters<typeof cy.mount>[0]) => {
    cy.mount(component);
    cy.injectAxe();
  }
);

declare global {
  namespace Cypress {
    interface Chainable {
      mountAccessible(component: Parameters<typeof cy.mount>[0]): Chainable;
    }
  }
}
