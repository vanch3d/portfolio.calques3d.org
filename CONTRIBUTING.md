# Contributing

Development setup for this project.

## Prerequisites

- **Node.js**: via [nvm](https://github.com/nvm-sh/nvm) or direct install — see `.nvmrc` for the version
- **pnpm**: `npm install -g pnpm`
- **gh CLI**: [cli.github.com](https://cli.github.com) — required for issue and PR workflows

## Local dev

```bash
pnpm install
pnpm run dev        # dev server at localhost:3000
pnpm run validate   # content schema + Mermaid diagrams + tsc
pnpm run build      # production build
```

## IDE setup (WebStorm)

- **Mermaid plugin**: Install [Mermaid](https://plugins.jetbrains.com/plugin/20146-mermaid) for live diagram preview in `.md` and `.mdx` files
- **ESLint**: enabled via `eslint-config-next`, runs on save
- **TypeScript**: strict mode — no `any` types

## Conventions

See `CLAUDE.md` for the full project constitution (rendering strategy, component conventions, ADR process, i18n, accessibility rules).
