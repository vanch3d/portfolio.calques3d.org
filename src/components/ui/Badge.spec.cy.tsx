import React from "react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders default variant without a11y violations", () => {
    cy.mountAccessible(<Badge>Active</Badge>);
    cy.contains("Active").should("be.visible");
    cy.checkA11y();
  });

  it("renders all variants without a11y violations", () => {
    cy.mountAccessible(
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <Badge variant="default">Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="muted">Muted</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    );
    cy.checkA11y();
  });

  it("applies role=status when status changes dynamically", () => {
    cy.mountAccessible(<Badge role="status" variant="success">Published</Badge>);
    cy.get("[role='status']").should("contain.text", "Published");
    cy.checkA11y();
  });
});
