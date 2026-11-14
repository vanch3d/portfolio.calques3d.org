# When It's Not Even a Graph: Domain Ontology

Workspace answers "is this thing connected and is it running?" It deliberately doesn't answer a harder question every user of a complex deployment eventually asks: where does my data actually go? That turned out not to be a graph problem in the clean sense Workspace was. MQTT decouples publishers from subscribers so completely that some of the real relationships in this system don't exist as data at all, only as something computed at the moment you ask. I led this work as sole developer, across seven different visualisation attempts, a formal ontology, and a fair amount of quietly re-deciding what a node even was.

---

This chapter draws on a longstanding personal interest that predates HiveMQ: how a system's internal state gets translated for the people who have to act on it externally. Applied here to an industrial data pipeline rather than a classroom, it's the same question underneath most of my earlier research work, and it's compiled in full in the [handover documentation](https://github.com/hivemq/hivemq-edge/pull/1395). Team and product involvement in this work was real, but limited to reviewing proofs of concept, not directing them.

### Why Workspace couldn't simply be extended

The domain resists a single graph representation for reasons rooted in the MQTT protocol itself, not in any interface decision:

- **Some adapters run bidirectionally.** A protocol adapter can both read from a device and write to it, and bridges relay messages in one or both directions between brokers. The edge between two nodes isn't always one-directional, and in some configurations isn't a single, stable direction at all.
- **The broker doesn't know where a message structurally came from.** MQTT decouples publishers from subscribers entirely. A received message carries a topic string, not a record of which adapter produced it. Any relationship between a message and its origin has to be inferred.
- **Subscriptions are wildcard pattern matches, not links.** A filter such as `factory/#` doesn't structurally point at the topics it will match; it's evaluated against every incoming message at runtime. The connection between a topic and a filter isn't stored anywhere as an edge, it's computed, on demand.

This is the domain model's own documented reasoning for [why Workspace isn't the answer](https://github.com/hivemq/hivemq-edge/blob/master/hivemq-edge-frontend/docs/walkthroughs/DOMAIN_ONTOLOGY.md#why-the-workspace-is-not-the-answer) to this deeper question. Rendering the data flow as a graph meant first deciding what the nodes and edges even were, when a meaningful fraction of the real relationships are inferred at runtime rather than given as data, and some of the edges aren't guaranteed to be acyclic even though the rendering library assumes they are.

### Seven attempts at the same question

Rather than force this into Workspace's existing model, the harder version of the problem got its own module. Its [documented internal history](https://github.com/hivemq/hivemq-edge/blob/master/hivemq-edge-frontend/docs/walkthroughs/DOMAIN_ONTOLOGY.md) is a sequence of different visualisation paradigms, each trading off different properties of a relationship that doesn't have one natural shape.

**Seven visualisation attempts, presented as flip cards: Sankey, Chord, Sunburst, Cluster, Edge Bundling, Network Graph, Data Flow Tracer.** Full content and component specification held separately.

> [!NOTE]
> Component files exist for all seven attempts (`ConceptFlow.tsx`, `RelationMatrix.tsx`, `ConceptWheel.tsx`, `AdapterCluster.tsx`, `RelationEdgeBundling.tsx`, `NetworkGraphView.tsx`, `DataFlowTracer.tsx`), and Cypress component specs already exist for four of the seven (`ConceptWheel`, `RelationMatrix`, `RelationEdgeBundling`, `AdapterCluster`), which means Percy or Cypress screenshot capture may get most of the way there without building fresh mocked tests. I don't have exact commit dates for this module specifically; the safest checkout point is the codebase as it stood around the [handover documentation PR](https://github.com/hivemq/hivemq-edge/pull/1395) (mid-February 2026), since the module is confirmed complete by that point.

None of the seven fully solved the problem alone, and the project's own retrospective is unusually candid about that: _"The TOPIC → TOPIC FILTER relationship is the hardest to visualise... it is derived by MQTT wildcard matching at runtime, not stored as an explicit edge in any API response. Any visualisation that omits this relationship is incomplete."_

### Forcing a cyclic reality into an acyclic renderer

A later, more formal pass built a proper "Domain DAG" using React Flow with Dagre's layered layout algorithm. Dagre's layout assumes a directed acyclic graph. The real relationship graph isn't acyclic, southbound mappings and bridge subscriptions can create genuine feedback loops. The solution was to detect those specific relationships, call them feedback edges, render them as visually distinct dashed lines, and exclude them from Dagre's forward-layout pass entirely, so the acyclic assumption stays intact for layout purposes while the dashed edges still communicate that a real, unmodelled loop exists.

That's reification in the most literal sense available in this codebase: a real-world relationship had to be deliberately hidden from the layout algorithm and reintroduced afterward as an annotation, because the rendering technology's core assumption was false for the domain, but useful enough to keep for everything else.

> [!NOTE]
> This is a concept better served by a small annotated diagram than a screenshot: a simple graph with one edge styled dashed, labelled "excluded from layout pass, shown for reference", next to the same graph as Dagre actually lays it out without that edge. Worth building fresh rather than sourcing from the codebase.

The same project escalated, in parallel, to a formal OWL ontology, thirteen classes, fourteen object properties, cardinality axioms, loadable in Protégé, as a non-visual way of pinning down what the entities and relationships actually were before trusting any diagram. Even there, the same limitation shows up: the ontology's `mqtt:matches` property can't be derived by a standard OWL reasoner; it still requires the same wildcard-matching code to populate, because the relationship is computed, not structural, no matter how formally you model it.

### Why this is the more interesting chapter

Workspace is a clean success: a real graph-shaped domain, represented as a graph, that earned two years of continued investment. This is the more honest and more technically interesting story, because the domain genuinely resists a single graph representation, and the project's own documentation says so directly rather than presenting whichever visualisation shipped as the obvious answer. Seven different attempts, an explicit acknowledgement of which relationship was hardest, and a formal ontology built specifically because no diagram alone could be fully trusted, is what depth actually looks like in practice: not a difficult implementation, but a genuine, repeated re-conceptualisation of what the nodes and edges even were before any layout decision could be made at all.
