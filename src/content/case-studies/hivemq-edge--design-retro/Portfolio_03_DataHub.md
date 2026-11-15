# The Same Bet, a Harder Domain: DataHub

The same paradigm that worked for Workspace was rebuilt from scratch for DataHub, five months later, same person, same underlying technology. The domain was fine for a canvas, since the message-transformation pipeline has graph-shaped structure. The trouble sat upstream: "OT technician" and "data engineer" were treated as job titles rather than researched as personas, and a canvas paradigm has to earn its fit with a specific, well-understood audience. A logically coherent domain does not do that work.

---

I built DataHub's initial flow architecture and visual language in [PRs #262 to #271](https://github.com/hivemq/hivemq-edge/pull/262), January 2024, and continued extending it through early 2026, on React Flow, Zustand (a dual store for draft and validation state), RJSF, Monaco Editor, and AJV8.

### The problem

DataHub lets users define two kinds of MQTT policy: data policies, which transform or validate messages, and behaviour policies, which define client state machines. Both are, structurally, pipelines: something goes in, passes through conditions and transformations, something happens at the end. Having recently shipped Workspace, the design bet was to reach for the same paradigm again: a React Flow canvas, drag-and-drop nodes, wire them together, publish.

![The DataHub canvas with policy nodes wired together](images/pr271-img-2.png 'DataHub in January 2024 (PR #271): the same node-and-edge paradigm, applied to policies.')

### What it grew into

Like Workspace, DataHub kept receiving real investment for two years:

- **Dry-run validation**: policies are checked against a validation endpoint before publish, so every error surfaces in one pass rather than being discovered one round-trip at a time.
- **Resource management**: JSON and Protobuf schemas, and JavaScript transformation functions, as reusable, versioned resources rather than inline blobs.
- **The Combiner**: the most significant later UX investment in this space, covered in full in the next section. In hindsight, its move toward a more structured table-and-editor pairing, rather than further canvas, was an early, local instance of the lesson below, made explicit only much later.
- **Usability refinements** through 2025 and into 2026 ([`#1264`](https://github.com/hivemq/hivemq-edge/pull/1264), policy summary reporting, and [`#1363`](https://github.com/hivemq/hivemq-edge/pull/1363), improving the behaviour and transition UX).

### The maintainers' own warning

The repository's own architecture documentation carries a maintainer warning, current as of this writing:

> _"The Data Hub UI has been redesigned from scratch for integration within HiveMQ Cloud Connect V2 (CCV2)... the DataHub Designer described in this document is no longer actively developed and should be treated as legacy code."_

The metaphor strained under assumed complexity, complexity the interface was built to handle whether or not the audience needed it handled that way. The deeper issue sat upstream, in the research. Industrial environments run on decades-old equipment, which is exactly why HiveMQ Edge needs adapters for legacy protocols in the first place. The tooling OT technicians use day to day, PLC configuration software, SCADA HMIs, vendor-specific panels, is almost universally form-based. On paper a canvas-based policy designer held up. It mismatched the specific people who needed to use it, whose years of prior tool exposure created a strong, largely unstated expectation that configuration happens in a form, and familiarity outweighed logical correctness.

That is a persona problem before it is an interaction-design problem. A loosely defined persona let the team skip the research step for DataHub in a way it had not been skipped for Workspace, where the audience question barely came up because a topology view reads as self-evidently useful regardless of a user's prior tooling background.

### What this case shows, and what I cannot evidence

The claim is that a canvas paradigm has to earn its expectations from the specific audience using it, and a loosely defined persona let this one skip that step. That is a research-process argument, and it is actionable next time. It is also the clearest evidence I have of telling a UI decision that was wrong from a research step that was skipped, instead of blaming the interface for a problem that started upstream of it.

One gap limits how well I can tell this story: the signal that this mismatch existed came in large part from solution engineers proofing the design against real customer scenarios, and from product-led usage reports. I did not keep artefacts from either source at the time, since they lived in Slack threads, sales calls, and internal reports rather than anywhere archived. That is a real limitation on how well I can evidence this today, and it is a practice I have since changed: I now keep a standing archive of that kind of informal validation signal, specifically so a finding like this one does not depend entirely on memory a year or two later.
