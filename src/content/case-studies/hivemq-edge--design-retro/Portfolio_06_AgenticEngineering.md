# Where the Practice Is Now: Agentic Engineering

The planning documents for the last major piece of work I shipped list their own author as "AI Assistant" and their reviewer as "Nicolas, Tech Lead." That is the most accurate description available of how I work now: directing an agent through a systematic, codebase-wide audit, reviewing and correcting its output, making the calls it could not make alone, then implementing and shipping the result myself. This was agentic engineering, with a defined scope, reviewed output and an owned outcome, and it was never vibe coding.

---

I was tech lead on this work: directed the audit, reviewed and approved the plan, authored the implementing pull requests. Built on React, TypeScript, RJSF, a shared `formatOwnershipString` utility, Cypress, and cypress-axe.

### The problem

A Combiner mapping can pull tags from multiple protocol adapters. If two adapters both expose a tag called `value`, a common naming collision in industrial settings, the interface had no way to tell them apart. The problem went beyond the cosmetic, since the ambiguity propagated into validation, operational status, and whether a saved mapping could even reload correctly. An earlier task had already fixed this in the two most visible places, which left every other location still exposed.

### How the work was planned

The parent task's own README states its authorship plainly: task owner, AI Assistant, and reviewer, Nicolas, tech lead. What the agent produced, and what I reviewed and directed, was substantial: a full ownership-chain analysis diagnosing three separate root causes, a phased implementation plan splitting the fix by risk, and, for the follow-on sweep, a location-by-location audit of every tag-rendering site in the codebase, each assessed against two concrete questions ("is scope data available here?" and "can two adapters produce a same-named tag in this view?"). Five ambiguous locations were found and prioritised, and six adjacent locations were checked and correctly ruled out.

That is exhaustive, mechanical-but-judgement-requiring work AI agents are good at, and that is easy for a person to do inconsistently under time pressure. My role was to direct it, review its output for correctness, make the calls it flagged as needing a human decision (one required backend coordination that no agent could resolve alone), then implement and ship: [`#1404`](https://github.com/hivemq/hivemq-edge/pull/1404), [`#1407`](https://github.com/hivemq/hivemq-edge/pull/1407), [`#1414`](https://github.com/hivemq/hivemq-edge/pull/1414), and a further run of related fixes through [`#1439`](https://github.com/hivemq/hivemq-edge/pull/1439), [`#1447`](https://github.com/hivemq/hivemq-edge/pull/1447), [`#1448`](https://github.com/hivemq/hivemq-edge/pull/1448), and [`#1449`](https://github.com/hivemq/hivemq-edge/pull/1449), into March 2026, each closing a specific location the audit had identified.

### The convention itself

Whatever produced the analysis, the design decision itself is a single rule: show `{adapter} :: {tag}` when a tag's scope is ambiguous in context, and the plain tag name when it is not. Applying that consistently across five structurally different components, each with a different way of getting at scope data, is the work, and no agent-produced plan makes it for you. Two decisions stayed with me: whether an error fallback should carry the same convention as the happy path (it should, and the audit caught that it had not), and whether a location with no scope data available should fake it or visibly do without (it visibly does without, rather than show misleading information). Every changed location shipped with a Cypress test covering both states and a passing accessibility check, consistent with the rest of the codebase's testing pyramid, not a separate standard invented for this task.

![Sources dropdown listing tags and topic filters without their adapter in the label](images/pr1449-img-1.png 'Before: two tags with the same name cannot be told apart.')

![Sources dropdown where each tag carries its adapter as a prefix](images/pr1449-img-2.png 'After (PR #1449): the ownership label makes the source explicit.')

### Directing an agent through codebase-wide work

The more useful story is directing an agent through exhaustive, codebase-wide consistency work that is hard for a person to do reliably alone, reviewing its diagnosis critically enough to catch what it got right and where a human call was still required, then owning the implementation and the shipping. That is closer to what a tech lead who is AI-native looks like day to day, and it was not a one-off: the codebase carries standing process documentation for this way of working, an autonomy template, a guide for getting an agent to follow project guidelines rather than nominally acknowledge them, a template for orchestrating multiple agents on independent subtasks in parallel.
