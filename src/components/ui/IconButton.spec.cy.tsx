import React from "react";
import { IconButton } from "./IconButton";

const StarIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

describe("IconButton", () => {
  it("renders with required aria-label", () => {
    cy.mountAccessible(<IconButton aria-label="Favourite"><StarIcon /></IconButton>);
    cy.get("button").should("have.attr", "aria-label", "Favourite");
    cy.checkA11y();
  });

  it("renders ghost and outline variants without a11y violations", () => {
    cy.mountAccessible(
      <div style={{ display: "flex", gap: "8px" }}>
        <IconButton aria-label="Ghost action" variant="ghost"><StarIcon /></IconButton>
        <IconButton aria-label="Outline action" variant="outline"><StarIcon /></IconButton>
      </div>
    );
    cy.checkA11y();
  });

  it("renders all sizes", () => {
    cy.mountAccessible(
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <IconButton aria-label="Small" size="sm"><StarIcon /></IconButton>
        <IconButton aria-label="Medium" size="md"><StarIcon /></IconButton>
        <IconButton aria-label="Large" size="lg"><StarIcon /></IconButton>
      </div>
    );
    cy.checkA11y();
  });

  it("is keyboard focusable", () => {
    cy.mountAccessible(<IconButton aria-label="Focus test"><StarIcon /></IconButton>);
    cy.get("button").focus().should("be.focused");
  });
});
