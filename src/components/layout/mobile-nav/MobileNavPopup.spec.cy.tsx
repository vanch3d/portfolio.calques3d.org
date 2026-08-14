import React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { MobileNavPopup } from "./MobileNavPopup";
import type { NavLink } from "../NavLinkItem";

const links: NavLink[] = [
  { href: "/research", label: "Research" },
  { href: "/engineering", label: "Engineering" },
  { href: "/cv", label: "CV" },
];

function PopupWrapper({ pathname = null }: { pathname?: string | null }) {
  return (
    <Drawer.Root open={true}>
      <Drawer.Portal>
        <MobileNavPopup
          links={links}
          pathname={pathname}
          closeLabel="Close navigation menu"
          wordmark="nvl"
          mobileNavLabel="Mobile navigation"
        />
      </Drawer.Portal>
    </Drawer.Root>
  );
}

describe("MobileNavPopup", () => {
  it("has no a11y violations", () => {
    cy.mountAccessible(<PopupWrapper />);
    cy.checkA11y();
  });

  it("renders all nav links", () => {
    cy.mountAccessible(<PopupWrapper />);
    cy.get("nav[aria-label='Mobile navigation']").within(() => {
      cy.contains("Research").should("exist");
      cy.contains("Engineering").should("exist");
      cy.contains("CV").should("exist");
    });
  });

  it("marks the active link when pathname matches", () => {
    cy.mountAccessible(<PopupWrapper pathname="/research" />);
    cy.get("a[href='/research']").should("have.attr", "aria-current", "page");
    cy.get("a[href='/engineering']").should("not.have.attr", "aria-current");
  });
});
