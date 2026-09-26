Status: open
Type: grilling

# ADR 024's "PR 3/4 follow this same pattern" checklist line is ambiguous

Spec: `.docs/adr/024-adopt-class-variance-authority-for-atom-component-variants.md`

ADR 024's Verification checklist has an unchecked line: "PR 3/4 (`Checkbox`, `Radio`/`RadioGroup`, `Field`/`Fieldset`) follow this same pattern — checked off when those PRs land." Both PRs landed without using `cva()` at all — each component has exactly one visual treatment, which the ADR's own exception clause covers ("Do not add `class-variance-authority` usage for a component with only one variant value").

Ambiguous whether the checklist line means literal `cva()` adoption (which PR 3/4 correctly skipped, per the exception) or the ADR's full structural reasoning (base/variants separation, grouped multi-line class lists, typed variant props — which PR 3/4 do follow, just without `cva()` itself since there's no variant axis).

## Question

Does this line get ticked as satisfied-via-exception, reworded to say so explicitly, or left as a literal `cva()`-adoption tracker that stays unchecked until/unless Checkbox or Radio ever grows a real variant axis?

## Answer

_pending — needs Nicolas_
