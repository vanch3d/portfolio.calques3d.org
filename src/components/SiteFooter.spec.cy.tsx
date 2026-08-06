import { SiteFooter, type SiteFooterLabels } from "./SiteFooter";

const labels: SiteFooterLabels = {
  role: "Lead Frontend Engineer at HiveMQ",
  githubLabel: "GitHub",
  emailLabel: "Email",
};

describe("SiteFooter", () => {
  beforeEach(() => {
    cy.mountAccessible(<SiteFooter labels={labels} />);
  });

  it("has no axe accessibility violations", () => {
    cy.checkA11y();
  });

  it("renders the GitHub link", () => {
    cy.get("nav[aria-label='Footer links']")
      .contains("a", labels.githubLabel)
      .should("have.attr", "href", "https://github.com/vanch3d")
      .and("have.attr", "rel", "noopener noreferrer");
  });

  it("renders the email as an obfuscated mailto link", () => {
    cy.get("nav[aria-label='Footer links']")
      .find("a[href='mailto:nicolas@calques3d.org']")
      .should("have.attr", "aria-label", labels.emailLabel);
  });

  it("does not expose the plain email address as visible text", () => {
    cy.get("nav[aria-label='Footer links']")
      .find("a[href='mailto:nicolas@calques3d.org']")
      .invoke("text")
      .should("not.equal", "nicolas@calques3d.org");
  });

  it("renders the role in the copyright line", () => {
    cy.contains(labels.role).should("exist");
  });
});
