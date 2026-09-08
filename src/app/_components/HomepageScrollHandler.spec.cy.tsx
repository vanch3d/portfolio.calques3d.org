import { HomepageScrollHandler } from "./HomepageScrollHandler";

function ScrollTestHarness() {
  return (
    <>
      <HomepageScrollHandler />
      <div id="hero" style={{ height: "200px" }} />
      <nav id="site-nav" aria-label="Site navigation" />
      <h1 id="canvas-name">Dr Nicolas Van Labeke</h1>
    </>
  );
}

describe("HomepageScrollHandler", () => {
  it("renders null — no element output from the component itself", () => {
    cy.mountAccessible(<HomepageScrollHandler />);
    cy.get("[data-testid]").should("not.exist");
  });

  it("site-nav does not have nav-visible class before scroll", () => {
    cy.mountAccessible(<ScrollTestHarness />);
    cy.get("#site-nav").should("not.have.class", "nav-visible");
  });

  it("canvas-name has opacity 1 before scroll", () => {
    cy.mountAccessible(<ScrollTestHarness />);
    cy.get("#canvas-name").should("have.css", "opacity", "1");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<ScrollTestHarness />);
    cy.checkA11y();
  });
});
