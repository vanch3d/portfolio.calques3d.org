# How I Actually Build: The Combiner

Given the choice between spending a first pass in a design tool or directly in the framework a feature will ship in, I default to the second. The Combiner, HiveMQ Edge's data-mapping tool, is the clearest example: its auto-generated form couldn't hold the mental model users needed, so instead of mocking a fix in Figma, I built the fix directly in React, Chakra, and RJSF, and let the working prototype become the implementation.

---

I was sole frontend owner throughout this work, built on React, TypeScript, Chakra UI, React Flow, RJSF, TanStack Query, and Zustand.

### The problem with "just render the schema"

HiveMQ Edge configures more than twenty protocol adapter types, each with its own parameters. Hardcoding a form per type would make every new adapter a frontend task, so the architecture is backend-driven: forms render at runtime from JSON Schema via RJSF. That solves a real scalability problem. It also creates a UX one: RJSF's default is a flat, generic form, no visual grouping, no sense of relationship between conceptually linked fields. Fine for simple adapters. For the Combiner, which maps and transforms data from multiple adapters and bridges into an outbound MQTT payload, a flat form asked users to hold structure in their heads that the schema already encoded: which fields were sources, which were mappings, which were per-field instructions.

### Why prototype in code, not Figma

The forms are schema-driven; their shape isn't fixed by a mockup, it's derived from a JSON Schema that can itself change. A static Figma frame would go stale the moment the schema evolved, and it would hide the actual hard problem, which was never "what should this look like" but "how do we keep a UI honest to a schema that changes, without re-deriving the layout by hand every time." So instead of mocking the Combiner statically, I built the smallest working version directly in React, Chakra, and RJSF, connected it to a real or mocked schema, and iterated on the interaction where the real constraint, a live, changeable schema, was actually present. Chakra and RJSF's customisation model made that fast enough that a working, clickable, schema-honest prototype was often available before a static mockup would have been finished, and it never needed translating into code afterwards. The prototype was the implementation, refined in place.

> [!NOTE]
> The repository already has real screenshots for this feature at `docs/assets/screenshots/combiner/`, worth using directly rather than staging new ones, authenticity matters more than polish here. The accompanying walkthrough document also includes its own illustrations of the design-versus-technical split described below.

### What the redesign actually looked like

RJSF's backend-driven rendering stayed, so the form stayed schema-honest, but the Combiner broke into custom widgets, each isolated to a specific slice of the schema, sharing context through RJSF's `formContext` mechanism rather than prop-drilling the whole payload:

- **`PrimarySelect`** — the primary data source for a mapping, scoped only to `sources.primary`.
- **`CombinedEntitySelect`** — which adapters and bridges are available as sources, without exposing the rest of the Combiner object.
- **`DataCombiningEditorField` and `DataCombiningTableField`** — the mappings and instructions portions of the schema, otherwise rendered as nested flat sub-forms, turned into a table-and-editor pairing that mirrors how a user actually thinks: pick sources, map fields, define instructions.

Each widget still validates its slice of the schema on every change, so the redesign didn't trade away schema-driven validation, it gave that validation an interface that matched the user's mental model instead of the schema's literal shape. The same underlying principle applies here as in Workspace: a table can't communicate relationship or direction; a canvas, or a purpose-built widget, can.

### Validation and accessibility were part of the process, not a check afterwards

Every component test ends with an automated WCAG 2.1 AA check as a mandatory, CI-blocking step. Visual regression testing runs on every pull request. The iteration loop on the Combiner wasn't build it, then check it's accessible later; every interaction change was accessibility-checked and visually diffed in the same commit that changed the interaction. Accessibility as a default state of the codebase, not a checklist run once before shipping.

---

This project is the clearest evidence I have of working genuinely across both seats at once: the design decision and the implementation decision were often the same decision, made in the same sitting, in code. What that practice looks like now, extended to directing an AI agent through work at a larger scale, is the subject of the final section.
