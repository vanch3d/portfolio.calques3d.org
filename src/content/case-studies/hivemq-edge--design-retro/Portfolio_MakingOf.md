# A Note on Process: How This Page Got Made

This section makes an argument, in the previous chapter, about what it looks like to direct an AI agent through real engineering work: define scope, review output critically, make the calls an agent can't make alone, own what ships. This document is that same argument, one more time, applied to building the page that makes it. Worth documenting honestly rather than leaving implicit, since "I used AI to help write my portfolio" is a much weaker claim than what actually happened.

## Where it started

This didn't begin as a portfolio project. It started as CV and cover letter tailoring for a handful of specific job applications, each with its own gap analysis, its own honest accounting of where the fit was real and where it was a stretch. The pattern that mattered most, set early and held throughout: no fabricated experience, and when a draft overstated something, correcting it mattered more than protecting the draft. That habit is the reason the chapters above hold up to scrutiny; it was established weeks before any of them existed.

The case-study work itself started because of a practical problem, not a plan. One application had no cover letter field, and the job posting explicitly required a portfolio demonstrating design and engineering work. There wasn't one. Building even a rough version became necessary, not optional, and the fastest honest path to one was the real work already sitting in a public repository.

## The research, and how it actually happened

Rather than draft case studies from memory or from what a CV bullet point implied, the assistant cloned the HiveMQ Edge frontend repository directly and read its own architecture documentation, walkthroughs, and design guide, then cross-referenced specific claims against the GitHub pull request history filtered to my author handle, and against HiveMQ's own public changelog for independent confirmation where it existed. That distinction mattered throughout: a claim with a pull request link and a changelog quote behind it got stated directly; a claim that could only be inferred got flagged and left for me to confirm or correct, not asserted as fact.

This wasn't frictionless. GitHub's unauthenticated API rate limit was hit more than once mid-research, which meant some threads, verifying authorship of the process documentation folder, for instance, never got fully confirmed on the first pass and had to wait for a later session.

## What the research actually surfaced

A few discoveries changed the shape of the work materially, rather than just adding detail to a plan already decided:

- **The repository's own documentation was already unusually reflective.** The Combiner walkthrough was already structured around a design-perspective-versus-technical-perspective split before any case study existed, and that split became the spine of the Combiner chapter rather than something invented for it.
- **DataHub's legacy-status warning.** The architecture document for DataHub carries a maintainer note that the whole designer has been rebuilt from scratch for CCV2. That single line turned what could have been a pure success narrative into a two-chapter argument with a real complication in it.
- **The domain ontology module.** Not something anticipated going in. A side comment about MQTT's topology being genuinely hard to represent led to searching the repository for corroborating evidence, and surfaced an entire separate module with seven different visualisation attempts, a formal ontology, and a documented lessons-learned section candid enough to quote directly. That chapter exists because that search happened, not because it was planned as a chapter from the start.
- **"Task owner: AI Assistant."** Found while digging for evidence toward what was originally scoped as two separate case studies, a UX-rigour story and an AI-workflow story. That one line in a task README made clear those two stories were actually one story, and that writing them apart would have meant hiding the AI Assistant attribution to make the UX case study read as more purely human than it was. The merge into a single closing chapter happened because of that discovery, not by initial design.

## Where I corrected the record

The research surfaced facts; it didn't know what they meant, or whether an inference drawn from them was right. At several points in this process, the work only became accurate because I corrected it:

- An early draft claimed I was sole owner of HiveMQ Edge's design system. I corrected this precisely: sole owner of the frontend, part of the lead team on the design system specifically, a distinction the assistant had blurred and wouldn't have caught alone.
- The DataHub chapter's explanation for why the canvas paradigm failed started as a plausible but unconfirmed hypothesis, a technical argument about graphs versus metaphors. I replaced it with the real reason: a persona-research gap, OT technicians' prior tooling background never properly researched, familiarity beating logical correctness. The technical hypothesis was defensible; the real answer was true, and better.
- The Device-node aside, and the deeper MQTT topology complexity that became most of the domain ontology chapter's argument, came from me, not from anything in the repository's documentation. The documentation confirmed these were real engineering problems; it didn't know to mention them until I did.
- The domain ontology chapter's authorship was an open question the assistant flagged rather than guessed at. I confirmed it directly: sole developer, stemming from a long-standing personal interest in data visualisation, team involvement limited to reviewing proofs of concept rather than directing them.
- The final chapter's framing, agentic engineering, not vibe coding, is my own phrase, not one the assistant arrived at independently, and it's the single most load-bearing sentence in that chapter.

None of these were the assistant getting facts wrong in a way research could have prevented. They were the difference between what's inferable from a codebase and what's only known by the person who was in the room.

## How the structure found its shape

The page's structure wasn't decided upfront either. It moved from a single case study, to three separate case studies, to a proposal for two more that turned out, on discovering the AI Assistant attribution, to need merging into one. The hub-and-chapters shape, the progressive-rendering convention that separates a standalone lead paragraph from the fuller detail beneath it, and the decision to treat pull request links as inline citation rather than a references section, all came from me, mid-process, each time in reaction to something already drafted rather than specified in advance. The flip-card idea for the domain ontology chapter specifically came from connecting an accessibility comment about the flip-cards to a completely different train of thought about how content should progressively render, which is the kind of connection a structured brief wouldn't have produced on its own.

## What this is actually evidence of

The final chapter argues that agentic engineering looks like defining scope, reviewing output critically, correcting what's wrong, and owning what ships, not delegating judgement along with the labour. This document is a second, independent instance of exactly that pattern, applied to research and writing instead of code: broad retrieval and first-draft structure from the assistant, and every fact that mattered, every reframing that made a chapter honest instead of merely plausible, from me. This page isn't just describing that way of working in its closing chapter. It was built by it.
