import { defineConfig } from "cypress";

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
      webpackConfig: {
        devServer: {
          // Suppress "Invalid Host/Origin header" noise in Cypress browser console.
          // CT runs against localhost with a dynamic port — allowedHosts must be permissive.
          allowedHosts: "all",
        },
      },
    },
    // Co-located spec files: ComponentName.spec.cy.tsx beside ComponentName.tsx
    specPattern: "src/**/*.spec.cy.{ts,tsx}",
    supportFile: "cypress/support/component.ts",
    // Custom HTML: provides a real <head> element so next-style-loader can inject
    // <style> tags, and a structural scaffold (<main>, hidden <h1>) so page-level
    // axe rules (landmark-one-main, page-has-heading-one) don't fail in CT.
    indexHtmlFile: "cypress/support/component-index.html",
  },

  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents() {},
  },
});
