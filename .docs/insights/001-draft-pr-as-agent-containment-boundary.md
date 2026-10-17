---
number: 1
title: 'Draft PR as Hard Agent Containment Boundary'
date: '2026-09-04'
discovered-during: 'First live run of the pr-flow skill (PR #29, chore/pr-review-flow)'
related-adr: 16
tags: ['agents', 'safety', 'github', 'workflow', 'agentic-engineering']
---

# Insight 001 — Draft PR as Hard Agent Containment Boundary

**Date:** 2026-09-04
**Discovered during:** First live run of the `pr-flow` skill — PR #29

## Discovery

While reviewing the completed PR flow in the GitHub UI, the observation was made that
the "Ready for Review" button was visible and active on the draft PR. The workflow
creates draft PRs deliberately (ADR 016), and the post-review step instructs the owner
to run `gh pr ready <number>` once satisfied with the findings.

The question arose: in this workflow, what does "Ready for Review" actually mean? The
standard GitHub interpretation is "I want reviewers to look at this." Here it means
something different: "I have read the agentic review and I approve this for merge."

Unpacking that reframing surfaced the underlying property: **a draft PR cannot be merged
by anyone — including the repo owner — via any mechanism**. GitHub enforces this at the
platform level. No API call, no `gh` command, no agent with full permissions can merge
a draft PR. The only path to merge is a human deliberately removing the draft status first.

## The insight

The draft state is not just a UI convention meaning "work in progress." It is a
**hard merge block enforced by the platform** — and therefore a reliable
**agent containment boundary**.

In an agentic workflow where an agent can open PRs, post reviews, push commits, and
interact with the GitHub API, the one thing it categorically cannot do is merge. The
draft state provides this guarantee without any custom guard, webhook, or permission
restriction. It is built into the platform.

This means the full automated loop — branch → commits → PR → code review → findings
posted — runs without human involvement. But the final disposition of the PR (merge,
close, request changes) is exclusively the human's. The agent can advise; it cannot ship.

## Why it matters

**It was not designed this way.** ADR 016 chose draft PRs because it seemed like good
practice: "don't merge before reviewing the findings." The safety property — that no
agent can bypass this — was a consequence of a GitHub platform constraint, not a
deliberate design choice.

This distinction matters for two reasons:

1. **Trust**: the guarantee is stronger than if we had designed it ourselves. A
   custom guard can be misconfigured or bypassed. A platform constraint cannot.

2. **Generalisation**: when designing agentic workflows, look for existing platform
   primitives that create hard human gates. They are more reliable than any guard
   you would write. The question to ask is not "how do I prevent the agent from doing
   X?" but "does the platform already prevent it?"

The draft gate is the agentic equivalent of a physical key kept in your pocket — the
agent can do everything to prepare the car, but it cannot drive it away.

## Relation to decisions

**ADR 016** documents the draft PR lifecycle as a deliberate workflow choice. This
insight enriches that decision by naming the underlying guarantee — one that makes the
choice more robust than the ADR knew at the time of writing.

The ADR's "Negative / Trade-offs" section notes that "Ready for Review" is repurposed
as an approval signal and may confuse collaborators. This insight frames that trade-off
differently: the semantic collision is the price of an unusually strong safety property,
which is worth paying.
