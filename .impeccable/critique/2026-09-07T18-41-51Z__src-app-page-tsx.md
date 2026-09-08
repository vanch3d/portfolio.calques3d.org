---
target: homepage src/app/page.tsx
total_score: 26
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 1
target_identity: "file:C:\\Users\\Nicolas\\WebstormProjects\\nextjs-vanch-website\\src\\app\\page.tsx"
target_fingerprint: "sha256:31df4665df5edc1b6fc2e95f51041ccc8c5d9dadf14d8ef80fc9d1c4a9c841c7"
target_path: "C:\\Users\\Nicolas\\WebstormProjects\\nextjs-vanch-website\\src\\app\\page.tsx"
timestamp: 2026-09-07T18-41-51Z
slug: src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Scroll position and nav-reveal state not communicated; scroll prompt is aria-hidden |
| 2 | Match System / Real World | 4 | Construction metaphor maps directly to calques heritage; era labels, dimension lines are native vocabulary |
| 3 | User Control and Freedom | 2 | Two outbound links only; browser back is the only escape; scroll has no progress indicator |
| 4 | Consistency and Standards | 4 | Token system, typography, and semantic HTML fully consistent across all surfaces |
| 5 | Error Prevention | 3 | No destructive actions; semantic HTML prevents misnavigation; minor: no visible indication page is scrollable |
| 6 | Recognition Rather Than Recall | 3 | Era cards and links are visible; main path is discoverable; secondary routes (Lab, CV) require recall or guessing |
| 7 | Flexibility and Efficiency of Use | n/a | Persuade-mode surface; no power-user paths expected |
| 8 | Aesthetic and Minimalist Design | 4 | Every mark earns its place; cream + graphite + single red is exemplary restraint |
| 9 | Error Recovery | 3 | No destructive actions; 404 page provides return-home; no breadcrumb on homepage itself |
| 10 | Help and Documentation | n/a | Persuade-mode portfolio; no help system expected |
| **Total** | | **26/32** | **Good — address arc shape and scroll contract before release** |

---

## Design Specificity Verdict

**LLM assessment:** Strongly authored. This is not a portfolio template — every compositional decision traces back to the "calques" etymology and the "construction on tracing paper" thesis. The SVG arc, dimension lines, era zone labels, and single red inflection tick are load-bearing narrative elements, not decoration. The typography stack (STIX Two + Spectral + Space Mono) is coherent and carries scholarly register without condescension. A recruiter who lands here knows immediately that they are not looking at a theme, and that signal is part of the portfolio's case.

**Deterministic scan:** Assessment B returned zero findings across all four component files. No raw hex values, no inline style props, no shadow utilities, no compass-grammar violations. Token compliance is exemplary: every color reference uses `var(--color-*)`, every size step maps to a named token, semantic HTML is correct, and the One Red Rule is respected with surgical precision (the 2018 tick is the only compass-arc red element on the entire surface).

**Visual overlays:** Browser automation not available in this session; CLI scan was the deterministic pass. No overlay shown.

---

## Overall Impression

The surface has exceptional compositional clarity — the arc, the name, and the red inflection point tell a complete story in one viewport. But two structural problems drag the experience: the arc's symmetric shape optically implies a career that peaked around 2010 and is declining toward 2026 (the opposite of the stated thesis), and the scroll prompt makes a promise of discovery that static era cards cannot keep. Fix those two and this is a standout portfolio surface.

---

## What's Working

**1. Visual metaphor authenticity.** The arc is not a stylistic flourish — it is the PhD software's name (calques = tracing paper) made spatial. A peer engineer or researcher reads the construction marks and immediately understands: this person builds precise things deliberately. The medium is the proof.

**2. Typographic and colour discipline.** The three-face stack (STIX Two for authority, Spectral for argument, Space Mono for measurement) is coherent and purposeful across every surface. The single compass-arc red appears exactly once — on the 2018 inflection tick — and that rarity makes it genuinely commanding. This level of restraint is rare and valuable.

**3. IdentityBlock placement.** Bottom-left anchoring within the arc's negative space is correct and beautiful. The era label with leading rule draws the eye upward into the h1 exactly as intended. A recruiter reading top-left-to-bottom processes arc → construction marks → name → positioning sentence in the right order.

---

## Priority Issues

### [P0] Arc trajectory contradicts the positioning statement
**What:** The symmetric compass arc (`M 80,820 A 1380,1380 0 0,1 1360,820`) peaks at x≈720 — the spatial midpoint of the timeline, corresponding to approximately 2010–2011. The right half of the arc (x=720→1360, covering 2011→2026) descends back to the baseline. The 2018 era transition and the entire Engineering era fall on the descending right limb.

**Why it matters:** The positioning statement calls this "one continuous proof" of unbroken practice. The arc optically argues the opposite: a career that rose, crested, and is now declining. A recruiter's eye reads the peak as the high point and 2026 as a return to origin. This is not a reading that serves a candidate in active job search.

**Fix:** Replace the symmetric arc with a construction element that reads as ascending, sustained, or at minimum neutral. Three candidate geometries:
- *Rising chord*: an arc whose left endpoint is lower than its right (1995 at y≈800, 2026 at y≈200), reading as an upward climb
- *Horizon line*: the arc is replaced with a dimension-line baseline that runs left-to-right at a consistent height; positions annotated as vertical leader lines rising from it
- *Double arc*: two smaller complementary arcs — one for each era — meeting at the 2018 inflection, both opening upward, together reading as "two movements, one direction"

**Suggested command:** `/impeccable shape`

---

### [P1] Scroll promise is not materialised
**What:** The scroll prompt ("↓ SCROLL TO EXPLORE") is both aria-hidden and the only affordance inviting interaction. The surface brief promises "Nav absent on load; surfaces on scroll." Neither the nav emergence nor any scroll-triggered behaviour is implemented. Below-fold delivers two static EraBlock cards.

**Why it matters:** The user invests a scroll action expecting discovery. Static cards do not reward that investment. The "construction in progress" metaphor depends on the surface revealing itself dynamically — a proof that unfolds as you engage with it, rather than existing fully-formed before you arrive.

**Fix:** Design and implement the scroll → nav transformation. On the first scroll event: the arc compresses into a slim horizontal strip at the top of the viewport; the strip becomes the persistent navigation bar seen on inner pages (bearing the name, era labels, and links to Research / Engineering / Lab). The below-fold era section then resolves. This creates the continuity paradigm between landing and inner pages that the user brief specifically identified.

**Suggested command:** `/impeccable animate`

---

### [P2] Navigation is a dead end — Lab, Publications, CV unreachable
**What:** The homepage links only to `/research` and `/engineering`. No route to the Lab, no route to Publications, no contact affordance, no CV. A recruiter arriving from a job application who wants to validate a technology claim or access a CV has nowhere to go.

**Why it matters:** Marcus (recruiter, primary persona) scans fast. If the Engineering era card doesn't answer his specific question (e.g., "Has he worked with React 18?"), he needs to navigate to a deeper resource. Currently that path doesn't exist from the homepage.

**Fix:** Complete the navigation surface. The scroll-revealed nav bar (fix for P1) should include all primary destinations: Research, Engineering, Publications, Lab, and an obfuscated contact. Secondary destinations (CV PDF, GitHub) can live in a footer or within the inner-page nav.

**Suggested command:** `/impeccable shape`

---

### [P3] Below-fold era cards have no hover state or construction metaphor continuity
**What:** The EraBlock cards are typographically clean but visually static. No hover states beyond a generic NavLink underline. No visual link to the arc's era zone labels above.

**Why it matters:** The transition from arc (above fold) to cards (below fold) loses the construction metaphor. The below-fold section could reinforce it — era cards that emerge from the arc geometry, or dimension-line leader lines connecting the card header to the arc's zone label — but currently it reads as a standard two-column card layout appended below an unusual hero.

**Fix:** Add a visible hover state to the EraBlock (border weight escalates from ghost to medium on hover; label gains ink-secondary colour). Add a construction annotation: a dashed leader line connecting the era card header to the arc inflection above, visible when the user arrives at the below-fold section.

**Suggested command:** `/impeccable animate`

---

## Persona Red Flags

**Jordan (Confused First-Timer):** Scrolls after the scroll prompt, sees two static cards, and wonders "is that it?" The promise of exploration isn't kept. The construction metaphor is legible to engineers but may be opaque to general web users — a recruiter without a design or engineering background may not parse the dimension lines and arc as a timeline at all. **Risk: early bounce.**

**Sam (Accessibility-Dependent):** The SVG is aria-hidden and carries no semantic description of the arc's narrative content. Sam's screen reader announces the section label ("Career construction") and then the IdentityBlock text — the 31-year timeline, the era transition year, and the two era zone labels are all invisible to assistive technology. The scroll prompt is also aria-hidden, so Sam receives no instruction to scroll. **Risk: incomplete narrative.** Fix: add a visually-hidden description element (`aria-describedby`) that communicates: "Timeline: Era I Research 1995–2017; Era II Engineering 2018–present. Inflection: 2018."

**Marcus (Senior Engineering Recruiter, 60 s budget):** Marcus reads the name and positioning statement, scans the era cards, clicks Engineering. The first-viewport story is legible in under 30 seconds — this is a strength. But if the Engineering page doesn't surface his decision-relevant data quickly (tech stack, recency, seniority signals), Marcus cannot cross-reference a CV or publication from this surface. Navigation is a funnel of two: Marcus goes deep into one era and has no way to pivot. **Risk: partial assessment.**

---

## Minor Observations

- **Space Mono ≠ Departure Mono**: `layout.tsx` loads Space Mono with a documented substitution note. Space Mono's character width and tabular figure metrics differ slightly from Departure Mono. Label columns (especially date ranges in EraBlock) may have minor alignment drift at larger viewports. Worth validating in a visual diff when Departure Mono becomes available.
- **SVG preserveAspectRatio on mobile**: `xMidYMid slice` crops the arc on narrow viewports. The arc's left endpoint (x=80) and the IdentityBlock may be partially clipped. No mobile layout is currently designed for this surface.
- **Ghost Line era labels**: The era zone labels inside the arc (x=555, x=1195) use `var(--color-ink-ghost)` at 11px — a contrast ratio of approximately 2.6:1 against the cream ground. These are aria-hidden decorative elements, so WCAG does not technically apply, but they carry semantic load (they name the eras). If these are the primary era identifiers for sighted users, the ghost colour may be too faint on some displays.
- **No focus ring on the SVG region**: The arc section has `aria-label` but is not interactive, so no focus ring is expected. Correct.
- **`dynamic = "force-static"`**: Correct for a fully static homepage. Consistent with the SSG intent in CLAUDE.md.

---

## Questions to Consider

- If the arc's mathematical shape suggests decline, is the construction metaphor itself the right device for a career narrative — or would a dimension-line baseline (horizontal ruler from 1995 to 2026, positions rising as leader lines) carry the same precision without the ambiguity?
- The scroll-to-nav transformation is architecturally interesting, but it requires the homepage nav to visually match the inner-page nav. Currently, inner pages (Lab) have their own distinct breadcrumb nav system. Is this the right moment to design a unified nav that works across both the homepage transition and the inner-page persistent bar?
- The below-fold era cards cover only Research and Engineering. Publications is a third major output category. Should the homepage offer a third below-fold block for Publications, or should Publications always live under the Research era?
