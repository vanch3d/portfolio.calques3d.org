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

const withoutAbstract: Publication = {
  key: "PUB003",
  type: "journalArticle",
  title: "Formative e-Assessment of Essay Writing",
  authors: ["Whitelock, Denise", "Van Labeke, Nicolas"],
  year: 2014,
  venue: "Assessment & Evaluation in Higher Education",
  doi: "10.1080/02602938.2014.998628",
  tags: [],
};

describe("PublicationItem — title and metadata", () => {
  it("renders title", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withDoi} labels={labels} /></ul>);
    cy.contains("Towards an Adaptive Feedback Framework").should("exist");
  });

  it("renders authors and year", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withDoi} labels={labels} /></ul>);
    cy.contains("Van Labeke, Nicolas").should("exist");
    cy.contains("2016").should("exist");
  });

  it("renders venue when present", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withDoi} labels={labels} /></ul>);
    cy.contains("Proceedings of LAK 2016").should("exist");
  });

  it("omits venue when absent", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withoutDoi} labels={labels} /></ul>);
    cy.get("p.italic").should("not.exist");
  });
});

describe("PublicationItem — DOI link", () => {
  it("wraps title in a DOI link when doi is present", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withDoi} labels={labels} /></ul>);
    cy.contains("a", "Towards an Adaptive Feedback Framework")
      .should("have.attr", "href", "https://doi.org/10.1145/2883851.2883950")
      .and("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer");
  });

  it("renders title as plain text when doi is absent", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withoutDoi} labels={labels} /></ul>);
    cy.contains("Preliminary Evaluation Report").should("exist");
    cy.get("a[href*='doi.org']").should("not.exist");
  });
});

describe("PublicationItem — abstract toggle", () => {
  it("shows abstract toggle when abstract is present", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withDoi} labels={labels} /></ul>);
    cy.get("details").should("exist");
    cy.contains("summary", "Abstract").should("exist");
  });

  it("reveals abstract text on toggle", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withDoi} labels={labels} /></ul>);
    cy.get("details summary").click();
    cy.contains("This paper presents an adaptive feedback framework.").should("exist");
  });

  it("omits abstract toggle when abstract is absent", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withoutAbstract} labels={labels} /></ul>);
    cy.get("details").should("not.exist");
  });
});

describe("PublicationItem — accessibility", () => {
  it("has no axe violations (with DOI and abstract)", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withDoi} labels={labels} /></ul>);
    cy.checkA11y();
  });

  it("has no axe violations (no DOI, no abstract)", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withoutDoi} labels={labels} /></ul>);
    cy.checkA11y();
  });

  it("has no axe violations (with venue, no abstract)", () => {
    cy.mountAccessible(<ul><PublicationItem pub={withoutAbstract} labels={labels} /></ul>);
    cy.checkA11y();
  });
});
