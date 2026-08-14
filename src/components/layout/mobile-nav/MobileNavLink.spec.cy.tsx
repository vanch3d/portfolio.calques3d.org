import React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { MobileNavLink } from "./MobileNavLink";

describe("MobileNavLink", () => {
  it("has no a11y violations when inactive", () => {
    cy.mountAccessible(
      <Drawer.Root>
        <MobileNavLink href="/research" label="Research" isActive={false} />
      </Drawer.Root>
    );
    cy.checkA11y();
  });

  it("has no a11y violations when active", () => {
    cy.mountAccessible(
      <Drawer.Root>
        <MobileNavLink href="/research" label="Research" isActive={true} />
      </Drawer.Root>
    );
    cy.checkA11y();
  });

  it("renders a link with the correct href and label", () => {
    cy.mountAccessible(
      <Drawer.Root>
        <MobileNavLink href="/research" label="Research" isActive={false} />
      </Drawer.Root>
    );
    cy.get("a[href='/research']").should("contain.text", "Research");
  });

  it("sets aria-current=page when active", () => {
    cy.mountAccessible(
      <Drawer.Root>
        <MobileNavLink href="/research" label="Research" isActive={true} />
      </Drawer.Root>
    );
    cy.get("a[href='/research']").should("have.attr", "aria-current", "page");
  });

  it("does not set aria-current when inactive", () => {
    cy.mountAccessible(
      <Drawer.Root>
        <MobileNavLink href="/research" label="Research" isActive={false} />
      </Drawer.Root>
    );
    cy.get("a[href='/research']").should("not.have.attr", "aria-current");
  });
});
