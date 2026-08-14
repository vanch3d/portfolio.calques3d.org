import React from "react";
import { SkeletonLoader } from "./SkeletonLoader";

// The wrapper uses <section> (implicit role "region") which accepts aria-label.
// A plain <div> has implicit role "generic" — aria-label is prohibited on generic
// per ARIA 1.2, which axe enforces. This is intentional usage guidance, not a
// SkeletonLoader bug: consumers must wrap the skeleton in a labelled landmark.

describe("SkeletonLoader", () => {
  it("text variant is aria-hidden and has no a11y violations", () => {
    cy.mountAccessible(
      <section aria-busy="true" aria-label="Loading content">
        <SkeletonLoader variant="text" />
      </section>
    );
    cy.get("[aria-hidden='true']").should("exist");
    cy.checkA11y();
  });

  it("card variant renders without a11y violations", () => {
    cy.mountAccessible(
      <section aria-busy="true" aria-label="Loading project card">
        <SkeletonLoader variant="card" />
      </section>
    );
    cy.checkA11y();
  });

  it("timeline-entry variant renders without a11y violations", () => {
    cy.mountAccessible(
      <section aria-busy="true" aria-label="Loading timeline">
        <SkeletonLoader variant="timeline-entry" />
      </section>
    );
    cy.checkA11y();
  });
});
