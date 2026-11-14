# Where the Practice Is Now: Agentic Engineering

The planning documents for the last major piece of work I shipped list their own author as "AI Assistant" and their reviewer as "Nicolas, Tech Lead." That's not a hedge, it's the most accurate description available of how I actually work now: directing an agent through a systematic, codebase-wide audit, reviewing and correcting its output, making the calls it couldn't make alone, then implementing and shipping the result myself. Worth naming directly: this was never vibe coding. It's agentic engineering, defined scope, reviewed output, owned outcome.

---

I was tech lead on this work: directed the audit, reviewed and approved the plan, authored the implementing pull requests. Built on React, TypeScript, RJSF, a shared `formatOwnershipString` utility, Cypress, and cypress-axe.

### The problem

A Combiner mapping can pull tags from multiple protocol adapters. If two adapters both expose a tag called `value`, a genuinely common naming collision in industrial settings, the interface had no way to tell them apart. Not cosmetic: the ambiguity propagated into validation, operational status, and whether a saved mapping could even reload correctly. An earlier task had already fixed this in the two most visible places; what remained was everywhere else.

### How the work was actually planned

The parent task's own README states its authorship plainly: task owner, AI Assistant; reviewer, Nicolas, tech lead. What the agent produced, and what I reviewed and directed, was substantial: a full ownership-chain analysis diagnosing three separate root causes, a phased implementation plan splitting the fix by risk, and, for the follow-on sweep, a location-by-location audit of every tag-rendering site in the codebase, each assessed against two concrete questions, is scope data available here, and can two adapters genuinely produce a same-named tag in this view. Five ambiguous locations were found and prioritised; six adjacent locations were checked and correctly ruled out.

That's exhaustive, mechanical-but-judgement-requiring work AI agents are genuinely good at, and that's easy for a person to do inconsistently under time pressure. My role was to direct it, review its output for correctness, make the calls it flagged as needing a human decision, one required backend coordination no agent could resolve alone, then implement and ship: [`#1404`](https://github.com/hivemq/hivemq-edge/pull/1404), [`#1407`](https://github.com/hivemq/hivemq-edge/pull/1407), [`#1414`](https://github.com/hivemq/hivemq-edge/pull/1414), and a further run of related fixes through [`#1439`](https://github.com/hivemq/hivemq-edge/pull/1439), [`#1447`](https://github.com/hivemq/hivemq-edge/pull/1447), [`#1448`](https://github.com/hivemq/hivemq-edge/pull/1448), and [`#1449`](https://github.com/hivemq/hivemq-edge/pull/1449), into March 2026, each closing a specific location the audit had identified.

### The convention itself

Whatever produced the analysis, the design decision itself is a single rule: show `{adapter} :: {tag}` when a tag's scope is ambiguous in context, and the plain tag name when it isn't. Applying that consistently across five structurally different components, each with a different way of getting at scope data, is the actual work, and it's the part no agent-produced plan makes for you: deciding whether an error fallback should carry the same convention as the happy path (it should, and the audit caught that it hadn't), or whether a location with no scope data available should fake it or visibly do without (it visibly does without, rather than show misleading information). Every changed location shipped with a Cypress test covering both states and a passing accessibility check, consistent with the rest of the codebase's testing pyramid, not a separate standard invented for this task.

> [!NOTE]
> A retrospective Cypress screenshot around [PR #1449](https://github.com/hivemq/hivemq-edge/pull/1449) (13 March 2026) would capture the ownership label convention at its most complete, ideally showing the sources dropdown with two same-named tags from different adapters displayed side by side, making the ambiguity and its resolution visible in one frame. A second shot from before [PR #1404](https://github.com/hivemq/hivemq-edge/pull/1404) (pre 24 February 2026) would show the ambiguous, unlabelled state for a genuine before-and-after pairing.

### Why this matters more than a clean "I designed this" story would

The more useful and more current story isn't "I do all my own analysis" or "I let the agent do everything." It's directing an agent through exhaustive, codebase-wide consistency work that's genuinely hard for a person to do reliably alone, reviewing its diagnosis critically enough to catch what it got right and where a human call was still required, then owning the implementation and the shipping. That's closer to what a tech lead who's genuinely AI-native looks like day to day, and it wasn't a one-off: the codebase carries standing process documentation for this way of working, an autonomy template, a guide for getting an agent to actually follow project guidelines rather than nominally acknowledge them, a template for orchestrating multiple agents on independent subtasks in parallel.
