import { ObfuscatedEmail } from "./ObfuscatedEmail";

const email = "nicolas@calques3d.org";
const reversed = email.split("").reverse().join("");

describe("ObfuscatedEmail", () => {
  it("renders an anchor element", () => {
    cy.mountAccessible(<ObfuscatedEmail email={email} />);
    cy.get("a").should("exist");
  });

  it("has a mailto href with the real address", () => {
    cy.mountAccessible(<ObfuscatedEmail email={email} />);
    cy.get("a").should("have.attr", "href", `mailto:${email}`);
  });

  it("renders the reversed address as visible text (CSS reversal)", () => {
    cy.mountAccessible(<ObfuscatedEmail email={email} />);
    cy.get("a").should("have.text", reversed);
  });

  it("uses the email as aria-label by default", () => {
    cy.mountAccessible(<ObfuscatedEmail email={email} />);
    cy.get("a").should("have.attr", "aria-label", email);
  });

  it("accepts a custom aria-label", () => {
    cy.mountAccessible(
      <ObfuscatedEmail email={email} label="Send me an email" />
    );
    cy.get("a").should("have.attr", "aria-label", "Send me an email");
  });

  it("accepts a className", () => {
    cy.mountAccessible(
      <ObfuscatedEmail email={email} className="text-accent-hover" />
    );
    cy.get("a").should("have.class", "text-accent-hover");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<ObfuscatedEmail email={email} />);
    cy.checkA11y();
  });
});
