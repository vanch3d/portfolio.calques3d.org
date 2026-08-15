import React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { MobileNavTrigger } from "./MobileNavTrigger";

describe("MobileNavTrigger", () => {
  it("has no a11y violations when closed", () => {
    cy.mountAccessible(
      <Drawer.Root>
        <MobileNavTrigger open={false} label="Open navigation menu" />
      </Drawer.Root>
    );
    cy.checkA11y();
  });

  it("has no a11y violations when open", () => {
    cy.mountAccessible(
      <Drawer.Root open={true}>
        <MobileNavTrigger open={true} label="Close navigation menu" />
      </Drawer.Root>
    );
    cy.checkA11y();
  });

  it("has aria-label and aria-expanded=false when closed", () => {
    cy.mountAccessible(
      <Drawer.Root>
        <MobileNavTrigger open={false} label="Open navigation menu" />
      </Drawer.Root>
    );
    cy.get("button[aria-label='Open navigation menu']")
      .should("have.attr", "aria-expanded", "false");
  });

  it("has aria-expanded=true when open", () => {
    cy.mountAccessible(
      <Drawer.Root open={true}>
        <MobileNavTrigger open={true} label="Close navigation menu" />
      </Drawer.Root>
    );
    cy.get("button")
      .should("have.attr", "aria-expanded", "true");
  });
});
