import React from "react";
import { SkeletonLoader } from "./SkeletonLoader";

describe("SkeletonLoader", () => {
  it("text variant is aria-hidden and has no a11y violations", () => {
    cy.mountAccessible(
      <div aria-busy="true" aria-label="Loading content">
        <SkeletonLoader variant="text" />
      </div>
    );
    cy.get("[aria-hidden='true']").should("exist");
    cy.checkA11y();
  });

  it("card variant renders without a11y violations", () => {
    cy.mountAccessible(
      <div aria-busy="true" aria-label="Loading project card">
        <SkeletonLoader variant="card" />
      </div>
    );
    cy.checkA11y();
  });

  it("timeline-entry variant renders without a11y violations", () => {
    cy.mountAccessible(
      <div aria-busy="true" aria-label="Loading timeline">
        <SkeletonLoader variant="timeline-entry" />
      </div>
    );
    cy.checkA11y();
  });
});
