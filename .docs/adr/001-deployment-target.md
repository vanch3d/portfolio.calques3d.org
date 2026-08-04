---
number: 1
title: "Deployment Target: Vercel + cPanel DNS"
status: decided
date: "2026-08-03"
tags: ["infrastructure", "deployment", "hosting"]
supersedes: []
---

# ADR 001 — Deployment Target: Vercel + cPanel DNS

**Date:** 2026-08-03
**Status:** Decided

## Context

The site is hosted on a self-hosted cPanel server (UKHost4U). The stack is Next.js 16.2, which requires Node.js >=20.9.0. The cPanel environment only offers Node.js 18.20.8.

Multi-rendering strategy (SSG, SSR, ISR, CSR per route) is a hard requirement — both as a learning exercise and as a demonstration of engineering capability in the portfolio itself.

## Decision

**Primary deployment target: Vercel (free tier)**

The Next.js app is deployed to Vercel, connected directly to the GitHub repository for automatic deployments on push.

cPanel is used for **DNS only**: a CNAME record for `portfolio.calques3d.org → cname.vercel-dns.com` routes traffic to Vercel. No Node.js process runs on cPanel for this project.

## Links

- GitHub: https://github.com/vanch3d/portfolio.calques3d.org
- Vercel: https://portfolio-calques3d-org.vercel.app/
- Target domain: https://portfolio.calques3d.org

## Consequences

**Positive:**
- No Node.js version constraints — Vercel manages the runtime.
- SSG, SSR, ISR, and on-demand revalidation all work without configuration.
- GitHub → Vercel auto-deploy is zero-effort CI/CD.
- Preview deployments per branch are available on free tier — useful for the engineering showcase.
- SSL provisioned automatically by Vercel via Let's Encrypt.

**Negative / Trade-offs:**
- Dependency on a third-party platform (Vercel) for production.
- Self-hosted fallback requires resolving the Node 20 / cPanel constraint separately.

## Alternatives Considered

- **Node 20 via NVM on cPanel** — technically possible via SSH, but Passenger compatibility with custom Node binaries on shared hosting is uncertain. Support ticket to UKHost4U pending. Remains a parallel investigation.
- **Downgrade to Next.js 15** — supports Node 18.18+, but loses Next.js 16 features and defers the Node version problem rather than solving it.
- **Static export on cPanel** — eliminates Node dependency entirely, but abandons the multi-rendering strategy requirement.
