import React from "react";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    // Ensure a clean light-mode state before each test.
    cy.document().then((doc) => {
      doc.documentElement.classList.remove("dark");
    });
    localStorage.removeItem("theme");
  });

  it("renders without a11y violations (light mode)", () => {
    cy.mountAccessible(<ThemeToggle />);
    cy.checkA11y();
  });

  it("has a descriptive aria-label in light mode", () => {
    cy.mountAccessible(<ThemeToggle />);
    cy.get("button").should("have.attr", "aria-label", "Switch to dark mode");
  });

  it("toggles to dark mode on click and updates aria-label", () => {
    cy.mountAccessible(<ThemeToggle />);
    cy.get("button").click();
    cy.document().its("documentElement.classList").should("contain", "dark");
    cy.get("button").should("have.attr", "aria-label", "Switch to light mode");
    cy.checkA11y();
  });

  it("toggles back to light mode on second click", () => {
    cy.mountAccessible(<ThemeToggle />);
    cy.get("button").click().click();
    cy.document().its("documentElement.classList").should("not.contain", "dark");
    cy.get("button").should("have.attr", "aria-label", "Switch to dark mode");
  });

  it("persists theme preference to localStorage", () => {
    cy.mountAccessible(<ThemeToggle />);
    cy.get("button").click();
    cy.wrap(localStorage).invoke("getItem", "theme").should("eq", "dark");
  });
});
