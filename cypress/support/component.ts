// Cypress component testing support file.
// Runs before each component spec.

import { mount } from "cypress/react";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import "axe-core";
import "./commands";

// ── i18n wrapper ─────────────────────────────────────────────────────────
// CT specs pass explicit label strings directly as props (the labels pattern).
// Components that call useTranslations() internally need NextIntlClientProvider.
// This wrapper supplies a flat en messages object so CT specs work without
// importing the full messages/en.json file.

type MountParams = Parameters<typeof mount>;

function mountWithIntl(
  component: MountParams[0],
  options?: MountParams[1] & { messages?: Record<string, unknown> }
): ReturnType<typeof mount> {
  const { messages = {}, ...mountOptions } = options ?? {};
  return mount(
    React.createElement(NextIntlClientProvider, {
      locale: "en",
      messages,
      children: component,
    }),
    mountOptions
  );
}

// Make cy.mount() and cy.mountAccessible() available in all CT specs
declare global {
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
