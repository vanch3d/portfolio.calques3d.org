# CONTEXT.md — nextjs-vanch-website

> Domain vocabulary for engineering agents and skills.
> Use terms exactly as defined here — do not substitute synonyms.
> Architecture decisions → `.docs/adr/` · Content model detail → ADR 014
> Product goals → `PRODUCT.md` · Design system → `DESIGN.md`

---

## Purpose

A personal professional portfolio for Nicolas Van Labeke spanning academic R&D (AIED, 1996–2017) and frontend engineering (2017–present).

The site is itself an engineering artefact — the repo, CI pipeline, ADRs, and test coverage are part of what is being demonstrated, not internal hygiene.

---

## Glossary

**Position** — A role held at an organisation (employment, contract, academic, PhD, freelance, voluntary). Top-level grouping that scopes projects.

**Project** — A distinct body of work within a position. Two subtypes: `ResearchProject` and `EngineeringProject`, discriminated by `type`. The primary content unit for the portfolio.

**Case Study** — A long-form narrative tied to a project. First-class content entity with its own route and layout. A project may have zero or many case studies.

**Chapter** — An ordered section of a case study. Discovered from co-located files — not declared in frontmatter.

**Publication** — A bibliographic record sourced from the Zotero API. Not stored locally; fetched and normalised at render time. Cross-linked to projects via Zotero tags.

**ADR (Architecture Decision Record)** — A recorded architectural decision: what was decided, why, and what was rejected. Lives in `.docs/adr/`; also rendered on the site.

**CV data** — Structured education and skill records supplementing positions. Not tied to any project.

**Forward reference** — The convention that relationships are stored in the child entity only (e.g. a Case Study references its Project, never the reverse). Back-references are always computed in `src/lib/content/`.
