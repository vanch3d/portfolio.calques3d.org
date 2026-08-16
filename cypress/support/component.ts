// Cypress component testing support file.
// Runs before each component spec.
//
// CT helpers live in cypress/support/ as co-located files:
//   IntlWrapper.tsx  — NextIntlClientProvider wrapper for useTranslations() components

import { mount } from "cypress/react";
import { wrapWithIntl } from "./commands/IntlWrapper";
import "axe-core";
import "./commands";
import "../../src/app/globals.css";
import installLogsCollector from "cypress-terminal-report/src/installLogsCollector";

// ─── Animation freeze for accessibility testing ───────────────────────────────
// See cypress/support/e2e.ts and ADR 011 for the full rationale.
// Short form: collapse animation durations so axe always sees the final
// (resting) state of components, not a transient opacity-0 frame.
Cypress.on("window:before:load", (win) => {
  const style = win.document.createElement("style");
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-delay: 0ms !important;
    }
  `;
  win.document.documentElement.appendChild(style);
});

installLogsCollector({ collectTypes: ["cy:log", "cy:command"] });

type MountParams = Parameters<typeof mount>;

function mountWithIntl(
  component: MountParams[0],
  options?: MountParams[1] & { messages?: Record<string, unknown> }
): ReturnType<typeof mount> {
  const { messages = {}, ...mountOptions } = options ?? {};
  return mount(wrapWithIntl(component, messages), mountOptions);
}

// Make cy.mount(), cy.mountWithIntl(), and cy.mountAccessible() available in all CT specs
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      mountWithIntl(
        component: MountParams[0],
        options?: MountParams[1] & { messages?: Record<string, unknown> }
      ): Chainable;
      mountAccessible(component: MountParams[0]): Chainable;
    }
  }
}

Cypress.Commands.add("mount", mount);
Cypress.Commands.add("mountWithIntl", mountWithIntl);
