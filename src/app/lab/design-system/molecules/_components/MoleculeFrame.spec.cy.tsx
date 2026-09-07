/**
 * MoleculeFrame — Cypress CT spec
 *
 * Tests the molecule documentation frame in isolation.
 * The component receives all strings as props — no translation context needed.
 *
 * Coverage:
 *   - Renders the molecule name above the heavy top rule
 *   - Renders the description paragraph
 *   - Renders decision rows with label and note text
 *   - Renders children inside the specimen zone
 *   - a11y: default state with decisions
 *   - className prop merges onto root element
 */

import { MoleculeFrame } from "./MoleculeFrame";

const DECISIONS = [
  { label: "Toolbar layout", note: "Search anchored left, TAGS trigger in centre." },
  { label: "Frequency encoding", note: "Five type-size tiers encode tag frequency at a glance." },
];

describe("MoleculeFrame", () => {
  it("renders the molecule name", () => {
    cy.mountAccessible(
      <MoleculeFrame
        name="Empty / idle state"
        description="No tags selected."
        decisions={[]}
      >
        <div>specimen</div>
      </MoleculeFrame>
    );
    cy.findByTestId("molecule-frame-name").should("contain.text", "Empty / idle state");
  });

  it("renders the description paragraph", () => {
    cy.mountAccessible(
      <MoleculeFrame
        name="Frame"
        description="This is the description of the molecule specimen."
        decisions={[]}
      >
        <div>child</div>
      </MoleculeFrame>
    );
    cy.findByTestId("molecule-frame-description").should(
      "contain.text",
      "This is the description of the molecule specimen."
    );
  });

  it("renders decision rows with correct labels and notes", () => {
    cy.mountAccessible(
      <MoleculeFrame
        name="Frame"
        description="A description."
        decisions={DECISIONS}
      >
        <div>child</div>
      </MoleculeFrame>
    );
    cy.findAllByTestId("decision-label").should("have.length", 2);
    cy.findAllByTestId("decision-label").first().should("contain.text", "Toolbar layout");
    cy.findAllByTestId("decision-note").first().should("contain.text", "Search anchored left");
    cy.findAllByTestId("decision-label").last().should("contain.text", "Frequency encoding");
  });

  it("renders children inside the specimen zone", () => {
    cy.mountAccessible(
      <MoleculeFrame
        name="Frame"
        description="A description."
        decisions={[]}
      >
        <div data-testid="inner-child">live component here</div>
      </MoleculeFrame>
    );
    cy.findByTestId("molecule-frame-specimen").within(() => {
      cy.findByTestId("inner-child").should("contain.text", "live component here");
    });
  });

  it("has no axe accessibility violations (default state with decisions)", () => {
    cy.mountAccessible(
      <MoleculeFrame
        name="Empty / idle state"
        description="No tags selected, drawer closed."
        decisions={DECISIONS}
      >
        <div>specimen content</div>
      </MoleculeFrame>
    );
    cy.checkA11y();
  });

  it("merges className prop onto the root element", () => {
    cy.mountAccessible(
      <MoleculeFrame
        name="Frame"
        description="desc"
        decisions={[]}
        className="custom-class"
      >
        <div>child</div>
      </MoleculeFrame>
    );
    cy.findByTestId("molecule-frame").should("have.class", "custom-class");
  });
});
