import React from "react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("empty variant renders without a11y violations", () => {
    cy.mountAccessible(
      <EmptyState
        variant="empty"
        heading="No projects yet"
        description="Projects will appear here once added."
      />
    );
    cy.contains("No projects yet").should("be.visible");
    cy.get("[role='status']").should("exist");
    cy.checkA11y();
  });

  it("filtered variant renders without a11y violations", () => {
    cy.mountAccessible(
      <EmptyState
        variant="filtered"
        heading="No results"
        description="Try adjusting your filters."
        action={{ label: "Clear filters", onClick: () => {} }}
      />
    );
    cy.contains("Clear filters").should("be.visible");
    cy.checkA11y();
  });

  it("with href action renders an anchor link", () => {
    cy.mountAccessible(
      <EmptyState
        heading="Nothing here"
        action={{ label: "Go home", href: "/" }}
      />
    );
    cy.contains("Go home").should("have.attr", "href", "/");
    cy.checkA11y();
  });

  it("without action renders without a11y violations", () => {
    cy.mountAccessible(
      <EmptyState heading="Empty" />
    );
    cy.checkA11y();
  });
});
