import { GlassPanel } from "./GlassPanel";

describe("GlassPanel", () => {
  it("renders sidebar variant with children", () => {
    cy.mountAccessible(
      <GlassPanel variant="sidebar">
        <p>Sidebar content</p>
      </GlassPanel>
    );
    cy.contains("Sidebar content");
  });

  it("renders notice variant with children", () => {
    cy.mountAccessible(
      <GlassPanel variant="notice">
        <p>Notice content</p>
      </GlassPanel>
    );
    cy.contains("Notice content");
  });

  it("defaults to sidebar variant", () => {
    cy.mountAccessible(
      <GlassPanel>
        <p>Default content</p>
      </GlassPanel>
    );
    cy.contains("Default content");
  });

  it("applies additional className", () => {
    cy.mountAccessible(
      <GlassPanel className="custom-class">
        <p>Content</p>
      </GlassPanel>
    );
    cy.get(".custom-class").should("exist");
  });

  it("has no axe accessibility violations (sidebar)", () => {
    cy.mountAccessible(
      <GlassPanel variant="sidebar">
        <dl>
          <dt>Period</dt>
          <dd>2023-04 – present</dd>
        </dl>
      </GlassPanel>
    );
    cy.checkA11y();
  });

  it("has no axe accessibility violations (notice)", () => {
    cy.mountAccessible(
      <GlassPanel variant="notice">
        <h2>Proprietary Work</h2>
        <p>This project was completed under commercial confidentiality.</p>
      </GlassPanel>
    );
    cy.checkA11y();
  });
});
