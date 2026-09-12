# Homepage Implementation Plan — V4b R2

**Comp:** `.docs/design/comps/homepage-comp-v4b-r2.html`
**Branch:** `epic/design-compass-app`
**PR scope:** one surface — `src/app/page.tsx` and all co-located components

---

## Current state

| File                                            | Status                          | Action                            |
| ----------------------------------------------- | ------------------------------- | --------------------------------- |
| `src/app/page.tsx`                              | V4b R2 shell                    | Done                              |
| `src/app/_components/CareerArc.tsx`             | Two-arc geometry (V4b R2)       | Done                              |
| `src/app/_components/IdentityBlock.tsx`         | Upper-left anchor, scroll ids   | Done                              |
| `src/app/_components/EraBlock.tsx`              | Superseded — kept for reference | Replaced by EraTimeline/EraColumn |
| `src/app/_components/SiteNav.tsx`               | New                             | Done                              |
| `src/app/_components/EraTimeline.tsx`           | New                             | Done                              |
| `src/app/_components/EraColumn.tsx`             | New                             | Done                              |
| `src/app/_components/HomepageScrollHandler.tsx` | New                             | Done                              |

---

## Implementation tasks

### 1. SiteNav (new)

- [x] `src/app/_components/SiteNav.tsx` — client component (`"use client"`)
- [x] Fixed top bar, `nav-hidden` class by default, `visible` class reveals it
- [x] Layout: italic STIX name (fades in via CSS child selector) · flex rule · nav links
- [x] `···` contact link styled with active border (only `--color-active` use outside SVG)
- [x] i18n: `HomePage.nav_contact`, `nav_contact_aria` keys added
- [x] `SiteNav.spec.cy.tsx` — renders hidden by default; receives `visible` class; a11y check

### 2. CareerArc (rewrite)

- [x] Geometry from approved comp (viewBox `0 0 1440 900`):
  - Ghost grid: horizontal y=300, y=600; vertical x=120, x=720, x=1030 (dashed), x=1320
  - Timeline legend: `CAREER ARC · 31 YEARS` at y=56; dimension span line y=80 (x 80→1360)
  - Year ticks: 1995 at x=80, 2026 at x=1360; 2018 at x=1030 in `--color-active`
  - Dashed leaders from dimension line down to arc origin, inflection, terminus
  - Dashed chord: (80,720)→(1360,120); vertical tick bars at each end
  - **Research arc:** `M 80,720 C 250,520 780,420 1030,480` (ghost echo offset +10)
  - **Engineering arc:** `M 1030,480 C 1090,300 1260,160 1360,120` (ghost echo offset +10)
  - Era zone labels: ERA I RESEARCH 1995–2017 at (440,690–725); ERA II ENGINEERING 2018–PRESENT at (1185,340–375)
  - Project sprinkles: Calques 3D (240,696); Learning Analytics (760,590); HiveMQ Edge (1230,250)
  - **ONE RED RULE:** inflection circle `cx=1030 cy=480 r=8` stroke `--color-active`, fill `--color-ground`
  - Compass cross + structural borders
- [x] Props: kept `arcLabel`, `timelineStart`, `timelineTransition`, `timelineEnd`
- [x] `CareerArc.spec.cy.tsx` — renders SVG; inflection circle present with active stroke; a11y check

### 3. IdentityBlock (update)

- [x] Move anchor to `top: clamp(6rem, 14vh, 8rem)` upper-left via `style` (legitimate dynamic value)
- [x] Add `id="canvas-identity"` to wrapper div
- [x] Add `id="canvas-name"` to h1 for scroll handler targeting
- [x] h1 carries `transition-opacity` class for JS-driven fade
- [x] Keep i18n as-is; label text, display name, positioning sentence unchanged
- [x] `IdentityBlock.spec.cy.tsx` — updated comment for V4b R2 changes; a11y via E2E

### 4. EraTimeline + EraColumn (replace EraBlock)

- [x] `src/app/_components/EraTimeline.tsx` — server component, 50/50 grid wrapper
- [x] `src/app/_components/EraColumn.tsx` — single era column with:
  - Dimension ruler: span line + start/end tick bars + year labels (active tick for inflection year)
  - Era badge (label class) + era name (STIX italic headline) + summary (Spectral caption)
  - Position list (`role="list"`) — entries as `year · institution` rows, border-top ghost dividers
  - Era nav links (NavLink atom)
- [x] Mobile: `max-md:grid-cols-1`; engineering `max-md:order-1`, research `max-md:order-2`
- [x] Position data hardcoded in EraTimeline (deferred D-03)
- [x] i18n additions complete: `career_timeline_label`, `career_timeline_span`, `era_*_positions_aria`, `era_*_link_*`
- [x] `EraColumn.spec.cy.tsx` — renders ruler + positions; a11y check

### 5. page.tsx (rewrite shell)

- [x] `export const dynamic = "force-static"` retained
- [x] `SiteNav`, `HomepageScrollHandler`, `CareerArc`, `IdentityBlock`, `EraTimeline` imported
- [x] Hero section: sr-only description, arc, identity block, scroll prompt
- [x] Below-fold: fold header with label + span, EraTimeline, secondary nav strip
- [x] HomepageScrollHandler client island

### 6. HomepageScrollHandler (new)

- [x] `src/app/_components/HomepageScrollHandler.tsx` — minimal `"use client"` island
- [x] Passive scroll listener: fades `#canvas-name` opacity 1→0 between 15–30% hero height
- [x] Toggles `visible` class on `#site-nav` at 30% scroll

### 7. Styling additions

- [x] `--nav-height` token added to `src/styles/tokens/spacing.css` + @theme bridge (`--spacing-nav`)
- [x] `nav-hidden` and `nav-visible` utilities added to `src/styles/utilities/index.css`
- [x] `messages/en.json` updated with all new keys under `HomePage` namespace

---

## PR checklist (before opening)

- [x] `pnpm run validate` passes (tsc + content schema + diagrams)
- [x] `pnpm exec tsc --noEmit` zero errors
- [ ] Cypress CT: all three new/updated specs pass (`CareerArc`, `SiteNav`, `EraColumn`)
- [ ] axe-core zero violations on each spec
- [ ] `pnpm run build` clean
- [ ] Visual spot-check at 1280px and 375px (mobile)

---

## Deferred issues

> Decisions, fine-tuning, and scope explicitly pushed out of this PR.

| #    | Issue                                            | Notes                                                                                                                                                               |
| ---- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-01 | Arc geometry fine-tuning                         | User agreed: broad agreement reached, fine-tune separately                                                                                                          |
| D-02 | Project sprinkles driven by content data         | Done — `CareerArc` accepts `researchSprinkles`/`engineeringSprinkles` props; `page.tsx` fetches calques3d + hivemq-edge by slug; Learning Analytics label from i18n |
| D-03 | `EraColumn` position data from JSON              | Done — `EraTimeline` calls `getAllPositions()`, filters by type (academic/phd → research; employment/contract/freelance → engineering)                              |
| D-04 | Scroll handler as proper scroll-linked animation | Current impl is a plain scroll listener; consider upgrade after initial ship                                                                                        |
| D-05 | Contact obfuscation                              | `/contact` is a stub; actual email obfuscation is a separate surface                                                                                                |
| D-06 | `publications` and `lab` sub-routes              | Linked from nav; pages are stubs; full surfaces are separate PRs                                                                                                    |
| D-07 | `SiteNav` shared with inner pages                | Inner pages use their own nav; unify later                                                                                                                          |
| D-08 | Mobile hero: arc at small viewport               | `xMidYMid slice` crops aggressively at 375px; may need viewport-specific viewBox                                                                                    |

---

## Arising issues

| #    | Issue                                                                                         | Resolution                                                                                                                                                   |
| ---- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A-01 | Next.js 16 typed router rejects `/contact` and `/research/publications` (non-existent routes) | Used `as Route` cast at each `<Link href>` site — standard pattern for stub/future routes. No type suppression.                                              |
| A-02 | `SiteNav` uses CSS child selector `[.visible_&]` for name fade                                | Tailwind v4 supports arbitrary group/parent selectors; `.visible` is toggled by `HomepageScrollHandler` via `classList.toggle`. Verified compiles correctly. |
