import { defineConfig } from "cypress";
import installLogsPrinter from "cypress-terminal-report/src/installLogsPrinter";

export default defineConfig({
  // Disable browser access to Cypress.env() — use cy.env() for sensitive values.
  // See: https://on.cypress.io/cypress-env-migration
  allowCypressEnv: false,

  component: {
    // App Router component testing — Next.js framework, webpack bundler.
    // See: next/dist/docs/01-app/02-guides/testing/cypress.md
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    // Co-located spec files: ComponentName.spec.cy.tsx beside ComponentName.tsx
    specPattern: "src/**/*.spec.cy.{ts,tsx}",
    supportFile: "cypress/support/component.ts",
    setupNodeEvents(on) {
      installLogsPrinter(on, { printLogsToConsole: "onFail" });
    },
  },

  e2e: {
    baseUrl: "http://localhost:3000",
    // cypress/e2e/ — regular specs (run in CI)
    // cypress/pr-snapshots/ — PR snapshot specs (manual only; skip when routes env is empty)
    specPattern: ["cypress/e2e/**/*.cy.{ts,tsx}", "cypress/pr-snapshots/**/*.cy.{ts,tsx}"],
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on) {
      installLogsPrinter(on, { printLogsToConsole: "onFail" });
    },
  },
});
