import { PublicationsList } from "./PublicationsList";
import type { Publication } from "@/types/content";

const labels = {
  heading: "Publications",
  abstract: "Abstract",
  viewPdfNewTab: "Download PDF",
};

const pubs: Publication[] = [
  {
    key: "AAAA0001",
    type: "conferencePaper",
    title: "Towards an Adaptive Feedback Framework",
    authors: ["Van Labeke, Nicolas", "Whitelock, Denise"],
    year: 2016,
    venue: "Proceedings of LAK 2016",
    doi: "10.1145/example.2016",
    tags: ["safesea"],
  },
  {
    key: "AAAA0002",
    type: "journalArticle",
    title: "Formative e-Assessment of Essay Writing",
    authors: ["Whitelock, Denise", "Van Labeke, Nicolas"],
    year: 2014,
    tags: ["safesea"],
  },
];

const citationMap = new Map([
  ["AAAA0001", "<span>Van Labeke, N. (2016). <i>Towards an Adaptive Feedback Framework</i>.</span>"],
  ["AAAA0002", "<span>Whitelock, D. (2014). <i>Formative e-Assessment</i>.</span>"],
]);

describe("PublicationsList", () => {
  it("renders nothing when publications array is empty", () => {
    cy.mountAccessible(<div><PublicationsList publications={[]} citationMap={new Map()} labels={labels} /></div>);
    cy.get("section").should("not.exist");
  });

  it("renders the section heading", () => {
    cy.mountAccessible(<PublicationsList publications={pubs} citationMap={citationMap} labels={labels} />);
    cy.get("#publications-heading").should("contain.text", "Publications");
  });

  it("renders one list item per publication", () => {
    cy.mountAccessible(<PublicationsList publications={pubs} citationMap={citationMap} labels={labels} />);
    cy.get("ul li").should("have.length", 2);
  });

  it("renders citation HTML from the map", () => {
    cy.mountAccessible(<PublicationsList publications={pubs} citationMap={citationMap} labels={labels} />);
    cy.get("i").contains("Towards an Adaptive Feedback Framework").should("exist");
  });

  it("falls back to pub.title when key is absent from citationMap", () => {
    const partial = new Map([["AAAA0001", "<span>Van Labeke (2016)</span>"]]);
    cy.mountAccessible(<PublicationsList publications={pubs} citationMap={partial} labels={labels} />);
    cy.contains("Formative e-Assessment of Essay Writing").should("exist");
  });

  it("has no axe accessibility violations", () => {
    cy.mountAccessible(<PublicationsList publications={pubs} citationMap={citationMap} labels={labels} />);
    cy.checkA11y();
  });
});
