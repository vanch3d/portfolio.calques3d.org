import React from "react";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders default variant without a11y violations", () => {
    cy.mountAccessible(<Tag>React</Tag>);
    cy.contains("React").should("be.visible");
    cy.checkA11y();
  });

  it("renders mono variant without a11y violations", () => {
    cy.mountAccessible(<Tag variant="mono">TypeScript</Tag>);
    cy.contains("TypeScript").should("be.visible");
    cy.checkA11y();
  });

  it("renders a list of tags without a11y violations", () => {
    const tags = ["React", "TypeScript", "Next.js", "Tailwind"];
    cy.mountAccessible(
      <ul style={{ display: "flex", gap: "4px", listStyle: "none", padding: 0 }}>
        {tags.map((t) => (
          <li key={t}>
            <Tag>{t}</Tag>
          </li>
        ))}
      </ul>
    );
    cy.checkA11y();
  });
});
