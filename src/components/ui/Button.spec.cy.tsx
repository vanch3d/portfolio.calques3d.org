import React from "react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with default variant and size", () => {
    cy.mountAccessible(<Button>Click me</Button>);
    cy.contains("Click me").should("be.visible");
    cy.checkA11y();
  });

  it("renders all variants without a11y violations", () => {
    cy.mountAccessible(
      <div style={{ display: "flex", gap: "8px" }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    );
    cy.checkA11y();
  });

  it("renders all sizes", () => {
    cy.mountAccessible(
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    );
    cy.checkA11y();
  });

  it("is disabled when disabled prop is set", () => {
    cy.mountAccessible(<Button disabled>Disabled</Button>);
    cy.get("button").should("be.disabled");
    cy.checkA11y();
  });

  it("shows loading state with aria-busy", () => {
    cy.mountAccessible(<Button loading>Loading</Button>);
    cy.get("button").should("have.attr", "aria-busy", "true");
    cy.get("button").should("be.disabled");
    cy.checkA11y();
  });

  it("calls onClick when clicked", () => {
    const onClick = cy.stub().as("onClick");
    cy.mountAccessible(<Button onClick={onClick}>Click</Button>);
    cy.get("button").click();
    cy.get("@onClick").should("have.been.calledOnce");
  });
});
