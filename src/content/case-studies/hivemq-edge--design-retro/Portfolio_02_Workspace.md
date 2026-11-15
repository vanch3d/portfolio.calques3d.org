# The Bet That Worked: Workspace

Before Workspace existed, configuring HiveMQ Edge meant reading separate lists of adapters, bridges, and the broker across separate screens, then mentally reconstructing how data actually moved between them. I built a React Flow canvas instead, betting that a genuinely graph-shaped domain deserved a graph-shaped interface. Two years of continued investment after shipping it, rather than a rebuild, is the strongest evidence I have that the bet paid off.

---

I originated Workspace in [PR #51](https://github.com/hivemq/hivemq-edge/pull/51), August 2023, and continued to own and extend it through late 2025, built on React Flow (`@xyflow/react`), Zustand, and the Dagre and WebCola layout engines.

### The problem

A list of ten adapters tells you they exist. It doesn't tell you which ones feed into which bridge, which links are live, or where a broken connection sits in the chain. That's a topology problem, not a list problem, and the question a user actually has when troubleshooting, where is my data flowing and what's broken, is a graph-traversal question, not a filtering or sorting one.

Workspace shipped as the headline feature of the [2023.5 release](https://www.hivemq.com/changelog/hivemq-edge-2023-5-released/), and HiveMQ's own release notes describe the reasoning almost exactly as I'd put it now: _"Workspace offers a topology view that visualises data flow from edge devices to a central MQTT Broker in HiveMQ Edge, providing greater observability of adapted connections."_

![The first Workspace: an Edge node with three adapters and a bridge](images/pr51-img-1.png 'Workspace on day one, 24 August 2023 (PR #51).')

### What it grew into

Workspace wasn't a one-shot feature. Some of the significant extensions, in order:

- **Navigation and observability** ([`#72`](https://github.com/hivemq/hivemq-edge/pull/72), [`#78`](https://github.com/hivemq/hivemq-edge/pull/78), September 2023) — connecting the topology view back to individual adapter and bridge configuration screens, so the graph became a way to get to work, not just a picture.
- **Status propagation** ([`#228`](https://github.com/hivemq/hivemq-edge/pull/228), December 2023; redesigned again in [`#1245`](https://github.com/hivemq/hivemq-edge/pull/1245), October 2025) — a dual-status model separating "is this connection running?" from "is this connection configured correctly?", so connectivity problems and configuration problems read differently at a glance.
- **Manual grouping** ([`#231`](https://github.com/hivemq/hivemq-edge/pull/231), December 2023) — clustering nodes into logical groups for large deployments where a flat graph becomes unreadable.
- **Search and filtering** ([`#1213`](https://github.com/hivemq/hivemq-edge/pull/1213), [`#1222`](https://github.com/hivemq/hivemq-edge/pull/1222), [`#1224`](https://github.com/hivemq/hivemq-edge/pull/1224), October 2025) — necessary rather than optional once real deployments outgrew what's comfortably scannable by eye.
- **Automatic layouts** ([`#1253`](https://github.com/hivemq/hivemq-edge/pull/1253), October 2025) — Dagre for hierarchical layouts, WebCola for force-directed spacing, a radial option, on top of manual positioning.
- **Wizard mode and wizard groups** ([`#1284`](https://github.com/hivemq/hivemq-edge/pull/1284), [`#1308`](https://github.com/hivemq/hivemq-edge/pull/1308), November 2025) — a guided, step-by-step flow for building up a topology, rather than expecting every user to be comfortable dropping straight into an open canvas.

Introducing a wizard on top of a free-form canvas two years in is a quiet admission that the open canvas, however correct as a mental model, wasn't always the easiest entry point for every user. The graph stayed the right way to represent the topology; it needed a more scaffolded way to build one.

![Workspace with the group wizard open on its first step](images/pr1308-img-1.png 'Workspace in November 2025 (PR #1308): the guided wizard sits on top of the same canvas.')

### The node that doesn't exist in the backend

Workspace's "Device" node type has no backing entity in the API at all. The codebase's own architecture documentation lists devices among the "passive" node types with no independent status of their own. I added it for two reasons: to ground OT technicians in the vocabulary of their own domain, a technician thinks in terms of "this sensor", not "this adapter's configuration object", and as a structural workaround, letting a genuinely bidirectional adapter relationship become two clean directed edges through an intermediate node.

But the Device node never got real agency. Tags shown "on" it are technically part of the adapter's configuration, and clicking through to configure anything still routes back there. A node that looks first-class but isn't backed by first-class data is a smaller, earlier instance of a tension the domain ontology work runs into at a much larger scale, covered next.

> [!NOTE]
> A close-up screenshot of a Device node with its properties panel open, ideally showing Tags displayed on the node, would make the "looks first-class, isn't" point visually rather than only in prose. Current codebase state is fine here; I don't have a specific originating PR for the Device node type to anchor an earlier snapshot.

### The result

By late 2025, Workspace had grown from a single static graph into a system with ten node types, real-time status propagation across active and passive nodes, six layout algorithms, search and filtering, and a guided authoring flow, all still built on the same original premise. Two years of continued investment, rather than a rebuild, is the strongest evidence available that the original call was right for this domain.

The same underlying bet, made again five months later in a harder domain, is where the story gets more interesting.
