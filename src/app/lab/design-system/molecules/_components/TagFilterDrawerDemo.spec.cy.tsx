/**
 * TagFilterDrawerDemo — Cypress CT spec
 *
 * Tests the client-side wrapper that holds useState for the molecules page.
 * Verifies that the demo renders TagFilterDrawer correctly and that state
 * updates propagate visibly in the UI.
 *
 * Coverage:
 *   - Renders TagFilterDrawer with the provided tags
 *   - initialActiveTags appear as active chips in the chip zone
 *   - Clicking a chip remove button removes that chip from the active zone
 *   - a11y: default state (no active tags)
 */

import { TagFilterDrawerDemo } from "./TagFilterDrawerDemo";
import type { TagWithCount } from "@/components/ui/TagFilterDrawer";

const SAMPLE_TAGS: TagWithCount[] = [
  { tag: "testing",  count: 5 },
  { tag: "a11y",     count: 2 },
  { tag: "workflow", count: 4 },
];

describe("TagFilterDrawerDemo", () => {
  it("renders TagFilterDrawer with provided tags", () => {
    cy.mountAccessible(
      <TagFilterDrawerDemo tags={SAMPLE_TAGS} />
    );
    cy.findByTestId("tag-filter-drawer").should("exist");
    cy.findByTestId("drawer-toggle").should("be.visible");
  });

  it("shows initialActiveTags as chips in the active chips zone", () => {
    cy.mountAccessible(
      <TagFilterDrawerDemo
        tags={SAMPLE_TAGS}
        initialActiveTags={["testing", "a11y"]}
      />
    );
    cy.findByTestId("active-chip-testing").should("be.visible");
    cy.findByTestId("active-chip-a11y").should("be.visible");
  });

  it("removes a chip when its remove button is clicked", () => {
    cy.mountAccessible(
      <TagFilterDrawerDemo
        tags={SAMPLE_TAGS}
        initialActiveTags={["testing", "a11y"]}
      />
    );
    cy.findByTestId("active-chip-remove-testing").click();
    cy.findByTestId("active-chip-testing").should("not.exist");
    cy.findByTestId("active-chip-a11y").should("be.visible");
  });

  it("has no axe accessibility violations (default state)", () => {
    cy.viewport(1024, 768);
    cy.mountAccessible(<TagFilterDrawerDemo tags={SAMPLE_TAGS} />);
    cy.checkA11y();
  });
});
