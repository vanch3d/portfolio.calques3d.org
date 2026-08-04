// Cypress component testing support file.
// Runs before each component spec.

import { mount } from "cypress/react";
import "axe-core";
import "./commands";

// Make cy.mount() available in all CT specs
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add("mount", mount);
