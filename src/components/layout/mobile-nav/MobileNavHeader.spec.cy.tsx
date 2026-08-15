import React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { MobileNavHeader } from "./MobileNavHeader";

describe("MobileNavHeader", () => {
  it("has no a11y violations", () => {
    cy.mountAccessible(
      <Drawer.Root>
        <MobileNavHeader wordmark="nvl" closeLabel="Close navigation menu" />
      </Drawer.Root>
    );
    cy.checkA11y();
  });

  it("renders the wordmark text", () => {
    cy.mountAccessible(
      <Drawer.Root>
        <MobileNavHeader wordmark="nvl" closeLabel="Close navigation menu" />
      </Drawer.Root>
    );
    cy.contains("nvl").should("exist");
  });

  it("renders the close button with the correct aria-label", () => {
    cy.mountAccessible(
      <Drawer.Root>
        <MobileNavHeader wordmark="nvl" closeLabel="Close navigation menu" />
      </Drawer.Root>
    );
    cy.get("button[aria-label='Close navigation menu']").should("exist");
  });
});
