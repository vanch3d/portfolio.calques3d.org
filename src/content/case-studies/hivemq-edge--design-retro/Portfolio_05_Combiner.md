# How I Build: The Combiner

Given the choice between spending a first pass in a design tool or directly in the framework a feature will ship in, I default to the second. The Combiner, HiveMQ Edge's data-mapping tool, is the clearest example: its auto-generated form could not hold the mental model users needed, so instead of mocking a fix in Figma, I built the fix directly in React, Chakra, and RJSF, and let the working prototype become the implementation.

---

I was sole frontend owner throughout this work, built on React, TypeScript, Chakra UI, React Flow, RJSF, TanStack Query, and Zustand.

### The problem with "just render the schema"

HiveMQ Edge configures more than twenty protocol adapter types, each with its own parameters. Hardcoding a form per type would make every new adapter a frontend task, so the architecture is backend-driven: forms render at runtime from JSON Schema via RJSF. That solves a real scalability problem but also creates a UX one: RJSF's default is a flat, generic form, no visual grouping, no sense of relationship between conceptually linked fields. That is acceptable for simple adapters, but the Combiner maps and transforms data from multiple adapters and bridges into an outbound MQTT payload, and a flat form asked users to hold structure in their heads that the schema already encoded: which fields were sources, which were mappings, which were per-field instructions.

### Why prototype in code, not Figma

The forms are schema-driven. Their shape comes from a JSON Schema that can itself change, so no mockup fixes it. A static Figma frame would go stale the moment the schema evolved, and it would hide the hard problem: how to keep a UI faithful to a schema that changes, without re-deriving the layout by hand every time (what the interface should look like came second). So instead of mocking the Combiner statically, I built the smallest working version directly in React, Chakra, and RJSF, connected it to a real or mocked schema, and iterated on the interaction where the constraint that mattered, a live, changeable schema, was present. Chakra and RJSF's customisation model made that fast enough that a working, clickable, schema-faithful prototype was often available before a static mockup would have been finished, and it never needed translating into code afterwards. The prototype was the implementation, refined in place.

![The Combiner drawer with its Configuration, Sources and Mappings tabs](images/combiner-tabs-navigation.png 'The redesigned Combiner: one concern per tab.')

![The mapping editor drawer showing sources, destination and schemas](images/combiner-mapping-drawer-open.png 'The mapping editor, where the schema-driven form meets custom widgets.')

### What the redesign looked like

RJSF's backend-driven rendering stayed, so the form stayed faithful to the schema, but the Combiner broke into custom widgets, each isolated to a specific slice of the schema, sharing context through RJSF's `formContext` mechanism rather than prop-drilling the whole payload:

- **`PrimarySelect`**: the primary data source for a mapping, scoped only to `sources.primary`.
- **`CombinedEntitySelect`**: which adapters and bridges are available as sources, without exposing the rest of the Combiner object.
- **`DataCombiningEditorField` and `DataCombiningTableField`**: the mappings and instructions portions of the schema, otherwise rendered as nested flat sub-forms, turned into a table-and-editor pairing that mirrors how a user thinks: pick sources, map fields, define instructions.

Each widget still validates its slice of the schema on every change, so the redesign kept schema-driven validation and gave it an interface that matched the user's mental model instead of the schema's literal shape. The principle is the one from Workspace: a table cannot communicate relationship or direction, while a canvas or a purpose-built widget can.

### Validation and accessibility as part of the process

Every component test ends with an automated WCAG 2.1 AA check as a mandatory, CI-blocking step. Visual regression testing runs on every pull request. On the Combiner, every interaction change was accessibility-checked and visually diffed in the same commit that changed the interaction. Nothing waited for a checklist before shipping, because accessibility was the default state of the codebase.

---

This project is the clearest evidence I have of working across both seats at once: the design decision and the implementation decision were often the same decision, made in the same sitting, in code. What that practice looks like now, extended to directing an AI agent through work at a larger scale, is the subject of the final section.
