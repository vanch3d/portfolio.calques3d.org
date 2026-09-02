import { ChapterList, type ChapterItem } from "./ChapterList"

const CHAPTERS: ChapterItem[] = [
  { number: 1, slug: "problem-class", title: "The Problem Class" },
  { number: 2, slug: "workspace", title: "The Bet That Worked", teaser: "When the domain actually is a graph." },
  { number: 3, slug: "datahub", title: "The Same Bet, a Harder Domain" },
]

describe("ChapterList — anchor mode (default)", () => {
  beforeEach(() => {
    cy.mountAccessible(<ChapterList chapters={CHAPTERS} />)
  })

  it("renders all chapters", () => {
    cy.get("li").should("have.length", CHAPTERS.length)
  })

  it("renders anchor links", () => {
    cy.get("a").first().should("have.attr", "href", "#problem-class")
    cy.get("a").last().should("have.attr", "href", "#datahub")
  })

  it("renders chapter titles", () => {
    cy.contains("The Problem Class").should("exist")
    cy.contains("The Same Bet, a Harder Domain").should("exist")
  })

  it("renders teaser text when provided", () => {
    cy.contains("When the domain actually is a graph.").should("exist")
  })

  it("uses a nav landmark", () => {
    cy.get("nav[aria-label='Chapter list']").should("exist")
  })

  it("has no axe accessibility violations", () => {
    cy.checkA11y()
  })
})

describe("ChapterList — route mode", () => {
  beforeEach(() => {
    cy.mountAccessible(
      <ChapterList chapters={CHAPTERS} mode="route" basePath="/case-studies/hivemq-edge/design-retro" />
    )
  })

  it("renders route links", () => {
    cy.get("a").first().should("have.attr", "href", "/case-studies/hivemq-edge/design-retro/problem-class")
    cy.get("a").last().should("have.attr", "href", "/case-studies/hivemq-edge/design-retro/datahub")
  })

  it("has no axe accessibility violations", () => {
    cy.checkA11y()
  })
})
