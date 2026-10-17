Status: open
Type: grilling

# Should `Collapsible` be documented on `/lab/design-system` as an atom in its own right?

Spec: `.docs/tasks/2026-09-18-collapsible-atom-retrofit.md` (scope A)

`Collapsible.tsx` (`CollapsibleRoot`/`CollapsibleTrigger`/`CollapsiblePanel`) was built as an internal building block for `ConstructionPanel` and `TagFilterDrawer`, per the handoff doc's explicit scope: "Not surfaced on any `/lab/design-system` page directly — it's an internal building block, not a documented atom in its own right (unlike `Button`/`Checkbox`/`Radio`/`Field`)." That was flagged at the time as a scope question to raise with Nicolas, not assumed.

## Question

Does `Collapsible` get its own specimen section on `/lab/design-system/atoms` (or `molecules`), documenting the raw Base UI wrapper alongside `Button`/`Checkbox`/`Radio`/`Field`? Or does it stay undocumented on its own, discoverable only through the components that compose it (`ConstructionPanel`, `TagFilterDrawer`)?

## Answer

_pending_
