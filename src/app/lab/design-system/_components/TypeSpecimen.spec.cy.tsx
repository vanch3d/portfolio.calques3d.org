/**
 * TypeSpecimen — Cypress CT spec
 *
 * Tests the type-scale specimen row atom in isolation.
 * The component applies a different set of Tailwind classes per variant — this
 * spec verifies each variant's class signature, metadata rendering, and a11y.
 *
 * Coverage:
 *   - Role label is rendered for every variant
 *   - Spec annotations are rendered (each item in the specs array)
 *   - Specimen text is rendered
 *   - Optional rationale is shown when provided, absent when not
 *   - Each variant applies its signature class (font-display, font-body, label, …)
 *   - All five variants render without DOM errors in a stacked list
 *   - a11y: display variant (largest text — most likely to affect layout/contrast)
 *   - a11y: label variant (monospace, uppercase, secondary colour)
 *   - a11y: all five variants stacked (the standard usage on the typography page)
 */

import { TypeSpecimen } from './TypeSpecimen'

const DISPLAY = {
  role: 'Display',
  variant: 'display' as const,
  specimenText: 'Dr Nicolas Van Labeke',
  specs: ['STIX Two Text', 'Italic · 400', '56–72px fluid', 'Leading 1.10'],
  rationale:
    'STIX Two Text — the mathematical typesetting standard. The italic cut carries a genuine geometric incline: not emphasis, but character.',
}

const HEADLINE = {
  role: 'Headline',
  variant: 'headline' as const,
  specimenText: 'The Construction on Tracing Paper',
  specs: ['STIX Two Text', 'Italic · 400', '24–32px fluid', 'Leading 1.25'],
  rationale: 'STIX Two Text italic at headline scale — used for section and project titles.',
}

const TITLE = {
  role: 'Title',
  variant: 'title' as const,
  specimenText: '25 years of precise practice — two eras, one continuous proof.',
  specs: ['Spectral', 'Regular · 500', '18–20px fluid'],
  rationale: 'Spectral at medium weight — designed for screens, academic without stiffness.',
}

const BODY = {
  role: 'Body',
  variant: 'body' as const,
  specimenText:
    'AI in Education · Human-Computer Interaction · Peer-reviewed scholarship across seven institutions.',
  specs: ['Spectral', 'Regular · 400', '17px', 'Leading 1.70', '68ch measure'],
  rationale: 'Spectral Regular — holds 65–72ch lines at 17px without fatigue.',
}

const LABEL = {
  role: 'Label',
  variant: 'label' as const,
  specimenText: 'Era I · Research · 1995–2017 · Seven Institutions',
  specs: ['Space Mono', 'Regular · 400', '11px', 'Tracking 0.10em', 'Uppercase'],
  rationale: 'Space Mono — distinctive tabular-figures monospace with instrument-panel character.',
}

describe('TypeSpecimen', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders the role label', () => {
    cy.mountAccessible(<TypeSpecimen {...DISPLAY} />)
    cy.contains(DISPLAY.role).should('be.visible')
  })

  it('renders all spec annotation items', () => {
    cy.mountAccessible(<TypeSpecimen {...DISPLAY} />)
    DISPLAY.specs.forEach((spec) => {
      cy.contains(spec).should('be.visible')
    })
  })

  it('renders the specimen text', () => {
    cy.mountAccessible(<TypeSpecimen {...DISPLAY} />)
    cy.contains(DISPLAY.specimenText).should('be.visible')
  })

  it('renders the rationale when provided', () => {
    cy.mountAccessible(<TypeSpecimen {...DISPLAY} />)
    cy.contains(DISPLAY.rationale).should('be.visible')
  })

  it('does not render rationale text when rationale is omitted', () => {
    cy.mountAccessible(
      <TypeSpecimen
        role="Display"
        variant="display"
        specimenText="Dr Nicolas Van Labeke"
        specs={['STIX Two Text']}
      />
    )
    // Only the meta column and specimen paragraph — no rationale paragraph
    cy.contains('STIX Two Text — the mathematical').should('not.exist')
  })

  // ── Variant class signatures ───────────────────────────────────────────────

  it('display variant applies font-display and italic classes', () => {
    cy.mountAccessible(<TypeSpecimen {...DISPLAY} />)
    cy.contains(DISPLAY.specimenText)
      .should('have.class', 'font-display')
      .and('have.class', 'italic')
  })

  it('headline variant applies font-display and italic classes', () => {
    cy.mountAccessible(<TypeSpecimen {...HEADLINE} />)
    cy.contains(HEADLINE.specimenText)
      .should('have.class', 'font-display')
      .and('have.class', 'italic')
  })

  it('title variant applies font-body and font-medium classes', () => {
    cy.mountAccessible(<TypeSpecimen {...TITLE} />)
    cy.contains(TITLE.specimenText)
      .should('have.class', 'font-body')
      .and('have.class', 'font-medium')
  })

  it('body variant applies font-body and max-w-prose classes', () => {
    cy.mountAccessible(<TypeSpecimen {...BODY} />)
    cy.contains(BODY.specimenText)
      .should('have.class', 'font-body')
      .and('have.class', 'max-w-prose')
  })

  it('label variant applies the label utility class', () => {
    cy.mountAccessible(<TypeSpecimen {...LABEL} />)
    cy.contains(LABEL.specimenText).should('have.class', 'label')
  })

  // ── Additional className ───────────────────────────────────────────────────

  it('merges additional className on the outer wrapper', () => {
    cy.mountAccessible(<TypeSpecimen {...DISPLAY} className="mt-xl" />)
    // The outer wrapper is the grid div — it should carry the merged class
    cy.get('.mt-xl').should('exist')
  })

  // ── Full stack ─────────────────────────────────────────────────────────────

  it('renders all five variants stacked without DOM errors', () => {
    cy.mountAccessible(
      <div className="flex flex-col">
        <TypeSpecimen {...DISPLAY} />
        <TypeSpecimen {...HEADLINE} />
        <TypeSpecimen {...TITLE} />
        <TypeSpecimen {...BODY} />
        <TypeSpecimen {...LABEL} />
      </div>
    )
    // All five role labels present
    ;['Display', 'Headline', 'Title', 'Body', 'Label'].forEach((role) => {
      cy.contains(role).should('be.visible')
    })
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('has no axe accessibility violations (display variant)', () => {
    // Largest text — fluid clamp(3.5rem, 6vw, 4.5rem). Contrast: ink (#2a2a2a)
    // on ground (#f8f4ed) exceeds 4.5:1 for all text sizes.
    // Spec annotations use text-ink-secondary (#6b6b6b, ~4.6:1) — passes WCAG AA.
    cy.mountAccessible(<TypeSpecimen {...DISPLAY} />)
    cy.checkA11y()
  })

  it('has no axe accessibility violations (label variant)', () => {
    // Smallest text — 11px uppercase monospace in ink-secondary (#6b6b6b).
    // Contrast: #6b6b6b on #f8f4ed is ~4.6:1 — passes WCAG AA for large/bold text.
    cy.mountAccessible(<TypeSpecimen {...LABEL} />)
    cy.checkA11y()
  })

  it('has no axe accessibility violations (all five variants stacked)', () => {
    cy.mountAccessible(
      <div className="flex flex-col">
        <TypeSpecimen {...DISPLAY} />
        <TypeSpecimen {...HEADLINE} />
        <TypeSpecimen {...TITLE} />
        <TypeSpecimen {...BODY} />
        <TypeSpecimen {...LABEL} />
      </div>
    )
    cy.checkA11y()
  })
})
