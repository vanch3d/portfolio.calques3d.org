import { PublicationsList } from "./PublicationsList";
import type { Publication } from "@/types/content";

const labels = { heading: "Publications", abstract: "Abstract" };

const pub1: Publication = {
  key: "PUB001",
  type: "conferencePaper",
  title: "Towards an Adaptive Feedback Framework",
  authors: ["Van Labeke, Nicolas", "Whitelock, Denise"],
  year: 2016,
  venue: "Proceedings of LAK 2016",
  doi: "10.1145/2883851.2883950",
  tags: ["safesea"],
};

const pub2: Publication = {
  key: "PUB002",
  type: "journalArticle",
  title: "Formative e-Assessment of Essay Writing",
  authors: ["Whitelock, Denise", "Van Labeke, Nicolas"],
  year: 2014,
  venue: "Assessment & Evaluation in Higher Education",
  tags: [],
};

describe("PublicationsList — rendering", () => {
  it("renders the section heading", () => {
    cy.mountAccessible(<PublicationsList publications={[pub1]} labels={labels} />);
    cy.contains("h2", "Publications").should("exist");
  });

  it("renders all publication items", () => {
    cy.mountAccessible(<PublicationsList publications={[pub1, pub2]} labels={labels} />);
    cy.get("li").should("have.length", 2);
    cy.contains("Towards an Adaptive Feedback Framework").should("exist");
    cy.contains("Formative e-Assessment of Essay Writing").should("exist");
  });

  it("returns nothing when publications list is empty", () => {
    cy.mountAccessible(<PublicationsList publications={[]} labels={labels} />);
    cy.get("section").should("not.exist");
  });

  it("uses the provided heading label", () => {
    cy.mountAccessible(
      <PublicationsList
        publications={[pub1]}
        labels={{ ...labels, heading: "Related Papers" }}
      />
    );
    cy.contains("h2", "Related Papers").should("exist");
  });
});

describe("PublicationsList — accessibility", () => {
  it("has no axe violations with one item", () => {
    cy.mountAccessible(<PublicationsList publications={[pub1]} labels={labels} />);
    cy.checkA11y();
  });

  it("has no axe violations with multiple items", () => {
    cy.mountAccessible(<PublicationsList publications={[pub1, pub2]} labels={labels} />);
    cy.checkA11y();
  });
});
