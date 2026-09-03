---
number: 9
title: "Three-Layer Design Token Architecture"
status: proposed
date: "2026-09-01"
decision-makers: vanch3d
tags: ["design-system", "tailwind", "css", "tokens", "theming", "dark-mode"]
---

# ADR 009 — Three-Layer Design Token Architecture

**Date:** 2026-09-01
**Status:** Open

## Context

The portfolio requires a coherent visual identity across its sections with support for light/dark mode and WCAG 2.1 AA colour contrast. Tailwind CSS v4 adopts a CSS-first `@theme` block rather than `tailwind.config.ts`, which changes how custom tokens integrate with the utility system.

A previous design epic explored a three-layer token architecture (primitive → semantic → Tailwind `@theme inline`). That work is preserved in `main-legacy-app-v2` for reference.

## Decision

Deferred. The design system will be defined as part of a dedicated design phase once the content layer is complete.

## Constraints to resolve

- Whether to adopt `@base-ui/react` or another headless component library
- Dark mode strategy (`.dark` class vs `prefers-color-scheme`)
- Token naming conventions to avoid clash with Tailwind v4 internal `--color-*` namespace
