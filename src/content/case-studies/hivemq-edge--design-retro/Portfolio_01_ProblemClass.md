# The Problem Class

HiveMQ Edge translates twenty-plus industrial protocols, OPC-UA, Modbus, EtherNet/IP, decades-old equipment included, into MQTT, for a workforce that isn't made up of software developers. I owned its operations console for three years, and the question running through everything below is a single one: when do you represent something as a graph, and when does that choice quietly assume more than it should?

---

The equipment on the operational technology side is often decades old. A factory doesn't replace a PLC because a nicer one shipped; it replaces one when the old one dies, and some of these have been running since long before anyone imagined a browser would be involved in configuring them. The people who operate this equipment are experts in their domain and are not, as a rule, software developers. Their prior tooling experience is PLC configuration software, SCADA HMIs, vendor-specific panels, almost universally form-based, built by people who assumed the user would never touch a canvas or drag a node.

The frontend I owned for three years sits in the middle of that gap. It's the operations console: the only surface where someone configures a protocol adapter, wires up an MQTT bridge, defines a data policy, or simply tries to answer the question every operator eventually asks, is this actually working, and if not, where's it broken. Nothing about the underlying domain guarantees that a good answer looks the same way twice. Sometimes the honest representation of how data moves through the system is a graph, because the thing being represented genuinely has nodes and directed relationships. Sometimes it looks like a graph and isn't one, because the connections are inferred at runtime rather than given as data, or because the audience configuring it carries fifteen years of muscle memory built on forms, not canvases.

This retrospective is the record of getting that call right once, getting it wrong once, and what changed in how I approach the question since.

> [!NOTE]
> No screenshot needed here; this section is scene-setting. If an illustration earns its place, a simple diagram works better than a screenshot: OT protocols on one side (OPC-UA, Modbus, EtherNet/IP, ageing PLCs), MQTT on the other, HiveMQ Edge as the translation layer between them. Keep it schematic, not a product screenshot, this section is about the domain, not the interface.
