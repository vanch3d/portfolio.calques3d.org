import { PublicationItem } from "./PublicationItem";
import type { Publication } from "@/types/content";

const labels = { abstract: "Abstract" };

const withDoi: Publication = {
  key: "PUB001",
  type: "conferencePaper",
  title: "Towards an Adaptive Feedback Framework",
  authors: ["Van Labeke, Nicolas", "Whitelock, Denise"],
  year: 2016,
  venue: "Proceedings of LAK 2016",
  doi: "10.1145/2883851.2883950",
  abstract: "This paper presents an adaptive feedback framework.",
  tags: ["safesea"],
};

const withoutDoi: Publication = {
  key: "PUB002",
  type: "report",
  title: "Preliminary Evaluation Report",
  authors: ["Van Labeke, Nicolas"],
  year: 2008,
  tags: [],
};

const citationFull =
  "Van Labeke, N., and Whitelock, D. (2016). Towards an Adaptive Feedback Framework. In <i>Proceedings of LAK 2016</i> (Edinburgh, UK).";

const citationSimple = "Van Labeke, N. (2008). Preliminary Evaluation Report.";

describe("PublicationItem — citation HTML", () => {
  it("renders the formatted citation HTML", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withDoi} citationHtml={citationFull} labels={labels} /></ul>);
    cy.contains("Van Labeke, N., and Whitelock, D.").should("exist");
  });

  it("renders italic venue from citation HTML", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withDoi} citationHtml={citationFull} labels={labels} /></ul>);
    cy.get("i").contains("Proceedings of LAK 2016").should("exist");
  });

  it("renders plain citation text", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withoutDoi} citationHtml={citationSimple} labels={labels} /></ul>);
    cy.contains("Van Labeke, N. (2008)").should("exist");
  });
});

describe("PublicationItem — DOI link", () => {
  it("renders a DOI link when doi is present", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withDoi} citationHtml={citationFull} labels={labels} /></ul>);
    cy.get(`a[href="https://doi.org/10.1145/2883851.2883950"]`)
      .should("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer");
  });

  it("omits the DOI link when doi is absent", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withoutDoi} citationHtml={citationSimple} labels={labels} /></ul>);
    cy.get("a[href*='doi.org']").should("not.exist");
  });
});

describe("PublicationItem — abstract toggle", () => {
  it("shows abstract toggle when abstract is present", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withDoi} citationHtml={citationFull} labels={labels} /></ul>);
    cy.get("details summary").contains("Abstract").should("exist");
  });

  it("reveals abstract text on click", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withDoi} citationHtml={citationFull} labels={labels} /></ul>);
    cy.get("details summary").click();
    cy.contains("This paper presents an adaptive feedback framework.").should("exist");
  });

  it("omits abstract toggle when abstract is absent", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withoutDoi} citationHtml={citationSimple} labels={labels} /></ul>);
    cy.get("details").should("not.exist");
  });
});

describe("PublicationItem — accessibility", () => {
  it("has no axe violations (with DOI and abstract)", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withDoi} citationHtml={citationFull} labels={labels} /></ul>);
    cy.checkA11y();
  });

  it("has no axe violations (no DOI, no abstract)", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withoutDoi} citationHtml={citationSimple} labels={labels} /></ul>);
    cy.checkA11y();
  });
});
