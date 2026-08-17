import { PublicationsList } from "./PublicationsList";
import type { Publication } from "@/types/content";

const labels = { heading: "Publications", abstract: "Abstract", view: "View PDF", close: "Close PDF viewer" };

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

const citationMap = new Map([
  ["PUB001", "Van Labeke, N., and Whitelock, D. (2016). Towards an Adaptive Feedback Framework. In <i>Proceedings of LAK 2016</i>."],
  ["PUB002", "Whitelock, D., and Van Labeke, N. (2014). Formative e-Assessment of Essay Writing. <i>Assessment &amp; Evaluation in Higher Education</i>."],
]);

describe("PublicationsList — rendering", () => {
  it("renders the section heading", () => {
    cy.mountAccessible(<PublicationsList publications={[pub1]} citationMap={citationMap} labels={labels} />);
    cy.contains("h2", "Publications").should("exist");
  });

  it("renders all publication items with citation HTML", () => {
    cy.mountAccessible(<PublicationsList publications={[pub1, pub2]} citationMap={citationMap} labels={labels} />);
    cy.get("li").should("have.length", 2);
    cy.contains("Van Labeke, N., and Whitelock, D.").should("exist");
    cy.contains("Whitelock, D., and Van Labeke, N.").should("exist");
  });

  it("returns nothing when publications list is empty", () => {
    cy.mountAccessible(<PublicationsList publications={[]} citationMap={new Map()} labels={labels} />);
    cy.get("section").should("not.exist");
  });

  it("uses the provided heading label", () => {
    cy.mountAccessible(
      <PublicationsList
        publications={[pub1]}
        citationMap={citationMap}
        labels={{ ...labels, heading: "Related Papers" }}
      />
    );
    cy.contains("h2", "Related Papers").should("exist");
  });

  it("falls back to title when key is missing from citationMap", () => {
    cy.mountAccessible(
      <PublicationsList
        publications={[pub1]}
        citationMap={new Map()}
        labels={labels}
      />
    );
    cy.contains("Towards an Adaptive Feedback Framework").should("exist");
  });
});

describe("PublicationsList — accessibility", () => {
  it("has no axe violations with one item", () => {
    cy.mountAccessible(<PublicationsList publications={[pub1]} citationMap={citationMap} labels={labels} />);
    cy.checkA11y();
  });

  it("has no axe violations with multiple items", () => {
    cy.mountAccessible(<PublicationsList publications={[pub1, pub2]} citationMap={citationMap} labels={labels} />);
    cy.checkA11y();
  });
});
