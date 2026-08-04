import { defineConfig } from "cypress";

export default defineConfig({
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
  },

  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents() {},
  },
});
