@AGENTS.md

# CLAUDE.md — nextjs-vanch-website

> Project instructions for Claude Code. Overrides all default Claude behavior.

## Project Overview

Personal professional website for Nicolas Van Labeke, documenting:
- Academic R&D career (publications, research projects)
- Cloud-based UX design work (design portfolio)
- Professional chronology

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · deployed on self-hosted Linux/cPanel (UKHost4U)

## Repository Layout

```
src/
  app/          # App Router: pages, layouts, route segments
  components/   # Shared UI components
  lib/          # Data fetching, utilities, content helpers
  types/        # TypeScript type definitions
  content/      # Static content (MDX, JSON data sources)
public/         # Static assets (images, fonts, icons)
.docs/          # Design & engineering documentation (ADRs, specs)
```

## Development Guidelines

- **Rendering strategy is intentional.** Each major section of the site uses a different Next.js rendering mode (SSG, SSR, ISR, CSR) as a learning exercise. Document the choice in the relevant route file with a comment and in `.docs/adr/`.
- **No `any` types.** Use explicit TypeScript types; define shared shapes in `src/types/`.
- **Co-locate styles with components** using Tailwind utility classes. No separate CSS files per component.
- **Content sources** live in `src/content/` (local MDX/JSON) or are fetched in server components. Never fetch content client-side unless the route is explicitly CSR.
- **Keep components small and focused.** Prefer composition over prop-drilling. Extract reusable primitives to `src/components/ui/`.

## Documentation

All design decisions, architecture choices, and engineering notes go in `.docs/`. See `.docs/README.md` for structure.

- ADRs: `.docs/adr/` — one file per decision, format `NNN-short-title.md`
- Design specs: `.docs/design/`
- Engineering notes: `.docs/engineering/`

## Deployment Target

Self-hosted Linux server with cPanel (UKHost4U). Build output must be compatible with Node.js process hosting (not static export unless the route allows it). Document any deployment-specific constraints in `.docs/engineering/`.

## Reference Sources (content gathering — not yet structured)

- Old website: https://nvl.calques3d.org/
- CV: `C:\Users\Nicolas\Documents\vanlabeke_cv (gempool recruitment 08-2026).docx`
