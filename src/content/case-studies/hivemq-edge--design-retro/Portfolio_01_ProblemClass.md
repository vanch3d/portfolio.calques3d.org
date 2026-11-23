# The Problem Class

HiveMQ Edge translates twenty-plus industrial protocols, OPC-UA, Modbus, EtherNet/IP, decades-old equipment included, into MQTT, for a workforce that is not made up of software developers. I owned its operations console for three years, and the question running through everything below is a single one: when do you represent something as a graph, and when does that choice quietly assume more than it should?

---

The equipment on the operational technology side is often decades old. A factory does not replace a PLC because a nicer one shipped. It replaces one when the old one dies, and some of these have been running since long before anyone imagined a browser would be involved in configuring them. The people who operate this equipment are experts in their domain and are not, as a rule, software developers. Their prior tooling experience is PLC configuration software, SCADA HMIs, vendor-specific panels, almost universally form-based, built by people who assumed the user would never touch a canvas or drag a node.

The frontend I owned for three years sits in the middle of that gap. It is the operations console: the only surface where someone configures a protocol adapter, wires up an MQTT bridge, defines a data policy, or simply tries to answer the question every operator eventually asks, is this working, and if not, where is it broken. Nothing in the domain guarantees that a good answer looks the same way twice. How data moves through the system is sometimes best represented as a graph, because the thing being represented has nodes and directed relationships. Other times it only looks like one: the connections are inferred at runtime rather than given as data, or the audience configuring it carries fifteen years of muscle memory built on forms, not canvases.

This retrospective is the record of getting that call right once, getting it wrong once, and what changed in how I approach the question since.

![Devices on the operational technology side speak OPC UA, Modbus and EtherNet/IP into HiveMQ Edge, which republishes as MQTT to central brokers, the cloud and enterprise systems; the operations console configures the Edge layer](images/diagram-ot-to-mqtt-topology.png 'The gap the console sits in: many industrial protocols in, one translation layer, MQTT out. The console configures that layer; it is never in the data path.')
