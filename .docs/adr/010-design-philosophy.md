---
number: 10
title: Portfolio Design Philosophy
status: proposed
date: 2026-08-05
tags: [design, ux, visual-identity, typography, color]
---

## Context

Stage 10 requires a coherent visual identity and UX philosophy for the portfolio. The design must:
- Reflect Nicolas Van Labeke's specific professional identity (researcher-turned-engineer)
- Be distinctive — not generic developer portfolio aesthetics
- Support the specific content types: research narratives, academic publications, engineering case studies, career timeline
- Meet WCAG 2.1 AA (mandatory)
- Support dark mode

Full philosophy proposal and page-by-page UX specifications in `.local/planning/2026-08-05-design-philosophy.md`.

## Decision

**Design identity: "Precision Scholarship"**

A typographically-driven, information-dense aesthetic that bridges academic rigour and engineering precision. No decorative elements, no hero imagery, no generic developer portfolio tropes.

### Color Palette

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `--color-bg` | `#f8f7f4` | `#0f172a` | Page background (warm off-white / slate-900) |
| `--color-surface` | `#ffffff` | `#1e293b` | Cards, panels |
| `--color-border` | `#e2e0db` | `#334155` | Borders, dividers |
| `--color-text-primary` | `#1a1614` | `#f1f5f9` | Primary text |
| `--color-text-secondary` | `#6b6560` | `#94a3b8` | Metadata, captions |
| `--color-accent` | `#0d9488` (teal-600) | `#14b8a6` (teal-500) | Signature accent |

**Dark mode:** System preference default (`prefers-color-scheme: dark`), with manual toggle in nav.

### Typography

**Type system:** Geist Sans (body + UI) · Geist Mono (code) · [Display font TBD — see open questions]

**Scale (1.25 modular):**
```
xs 12px · sm 14px · base 16px · lg 20px · xl 24px · 2xl 30px · 3xl 36px · 4xl 48px
```

**Typographic conventions:**
- Tabular numbers on all dates and counts (`font-variant-numeric: tabular-nums`)
- Small caps for labels and taxonomy tags
- Line height 1.6 for body prose, 1.2 for headings

### Layout

- Max container: 1280px centred
- 12-column grid, 24px gutters (desktop)
- Content width: 720px for prose, 1024px for listings
- Spacing system: 4px base unit (4/8/12/16/24/32/48/64/96/128px)

### Navigation

- Top bar: sticky, name (wordmark, links home) + section links + dark toggle
- Active state: teal underline, full-height
- Mobile: hamburger → full-screen accessible overlay

### Motion Policy

- Minimal, purposeful, always respects `prefers-reduced-motion`
- Allowed: fade transitions (100ms), hover shadow lift, height expand/collapse (200ms)
- Not allowed: scroll-triggered animations, parallax, decorative motion

## Rationale

The "Precision Scholarship" identity is grounded in the content: Nicolas's portfolio spans two decades of educational technology research and current industrial frontend engineering. Both share a common thread — building interfaces that make complex systems comprehensible. The design reinforces this thesis through:

- **Typography as structure:** A strong type hierarchy communicates information density without visual noise
- **Restrained color:** One accent color (teal) used consistently prevents the design from being "designed" and lets the content breathe
- **Two-era visual rhythm:** Research era and engineering era are visually distinguished through subtle layout and tone shifts, not completely different design systems
- **No decoration:** Decorative elements would undermine the academic/technical credibility the portfolio aims to project

## Consequences

- Every page section must work in both light and dark modes from day one.
- Typography decisions affect MDX prose rendering — `mdx-components.tsx` must apply the typography scale.
- Mermaid diagrams in research content should be styled to match the portfolio palette (custom Mermaid theme with teal accent).
- The accent color (teal) must achieve 4.5:1 contrast ratio against all background colors — verified at token setup time.

## Confirmed Decisions (2026-08-05)

| Point | Decision |
|---|---|
| Typography | **Unified — Geist Sans** throughout. No dual serif/sans split. |
| Dark mode | **System preference default** + user toggle. Feature flag for dark-by-default A/B experiment. |
| Accent color | **Teal AND deep amber** — A/B experiment in `/lab` before final commit. Both must be implemented as switchable token variants via `data-accent` attribute. |
| Prototype approach | **Code-first in `/lab`** — no Figma during iteration. Figma only at end for validation. |

## Remaining Open Questions

- Mermaid diagram theming — styled to match portfolio palette, or Mermaid defaults?
- `/lab` route: nav placement (footer only) confirmed, name TBD (`/lab` preferred).
