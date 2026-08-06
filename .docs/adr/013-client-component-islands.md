---
number: "013"
title: Client Component Islands
status: accepted
date: 2026-08-06
---

## Context

Next.js App Router renders components on the server by default. Every component
is a **Server Component** unless explicitly opted into the client runtime. This
is the opposite of the mental model from Pages Router, where everything was
client-rendered unless you reached for `getServerSideProps` or `getStaticProps`.

The key consequence: **the unit of client-side JavaScript is the component, not
the page.** This makes a new pattern possible — the _island_.

---

## The Island Pattern

An **island** is a Client Component embedded inside a Server Component tree.
The server-rendered HTML surrounds it (the "ocean"); the island is the only
part that is hydrated and interactive in the browser.

```
page.tsx (Server Component — zero JS sent to browser)
│
├── <SiteHeader />          ← Client island (usePathname, useTheme, Dialog)
│
├── <PublicationsList />    ← Server Component
│   └── <PublicationCard /> ← Server Component
│       ├── <Badge />           Server
│       ├── <div html />        Server
│       ├── <a href=doi />      Server
│       └── <PdfControls />  ← Client island (useFeatureFlag, useState)
│
└── <SiteFooter />          ← Server Component
    └── <ObfuscatedEmail /> ← Server Component (CSS-only, no JS)
```

Only the highlighted islands are included in the client JS bundle. Everything
else is static HTML — no hydration cost, no bundle weight.

---

## The Contract

### What makes a component a Server Component?
Nothing. It is the default. A file with no `"use client"` directive at the top
is a Server Component.

### What makes a component a Client Component?
The `"use client"` directive as the **first line** of the file:
```tsx
"use client";
// everything from here is included in the client bundle
```

### The boundary rule
`"use client"` marks a **boundary**, not an attribute. It means:
> "This file and everything it imports is part of the client bundle."

This has an important implication: **the boundary propagates down, not up.**

```tsx
// A.tsx — Server Component
import { B } from "./B";    // B is "use client"
import { C } from "./C";    // C has no directive

// B is a Client Component — B and everything B imports is in the client bundle.
// C is a Server Component — C and its imports are NOT in the client bundle.
// A is a Server Component — A itself is NOT in the client bundle.
// A can render B (pass it as JSX), but A cannot use B's hooks.
```

### What can each component type do?

| Capability | Server Component | Client Component |
|---|---|---|
| `async/await` at the top level | ✓ | ✗ |
| `fetch()` data at render time | ✓ | ✗ (use route handler) |
| Access filesystem, env vars | ✓ | ✗ |
| `useState`, `useReducer` | ✗ | ✓ |
| `useEffect`, `useRef` | ✗ | ✓ |
| `usePathname`, `useRouter` | ✗ | ✓ |
| `localStorage`, `window` | ✗ | ✓ (after hydration) |
| Event handlers (`onClick`) | ✗ | ✓ |
| Render other Server Components | ✓ | ✗ (*) |
| Render other Client Components | ✓ | ✓ |
| Receive Server Components as `children` | ✓ | ✓ (*) |

(*) A Client Component **cannot import** a Server Component directly. But a
Server Component **can pass** a Server Component as `children` or a prop to a
Client Component — the Server Component renders on the server, its HTML output
is passed as a prop. This is how `<SiteHeader>` can appear inside a Server
Component layout without the layout becoming a Client Component.

---

## How to place an island correctly

### 1. Identify the interactive surface

Ask: _what exactly needs to run in the browser?_ Usually it's much smaller than
the whole component. A publication card needs:
- Citation HTML — static, server is fine
- DOI link — static anchor, server is fine
- Abstract toggle — `<details>/<summary>`, HTML native, **no JS needed**
- PDF controls — reads `localStorage` (feature flag), has download state → **island**

### 2. Extract the interactive part into its own file

```tsx
// PdfControls.tsx
"use client";
// Only this file + its imports enter the client bundle
export function PdfControls({ pdf, title, labels }: PdfControlsProps) {
  const viewerEnabled = useFeatureFlag("pdf-viewer");
  // ...
}
```

### 3. Import it from the Server Component

```tsx
// PublicationCard.tsx  — NO "use client" directive
import { PdfControls } from "./PdfControls";  // crossing the boundary here

export function PublicationCard({ publication, citation, labels }) {
  // This function runs on the server. No hooks allowed.
  return (
    <article>
      <div dangerouslySetInnerHTML={{ __html: citation }} />
      {/* PdfControls is a Client island — hydrated in browser */}
      {publication.pdf && <PdfControls pdf={publication.pdf} ... />}
    </article>
  );
}
```

The card stays a Server Component. The island is as small as possible.

### 4. Pass only serialisable props across the boundary

Props cross the server→client boundary as serialised data (like JSON over the
wire). This means:
- ✓ strings, numbers, booleans, plain objects, arrays
- ✗ functions (use event handlers inside the Client Component instead)
- ✗ class instances, Dates (serialise to string first)
- ✗ Server Component JSX (pass as `children` instead)

---

## Anti-patterns to avoid

### Moving `"use client"` up unnecessarily

```tsx
// Bad — the entire PublicationCard is now client-side
"use client";
export function PublicationCard(...) {
  const flag = useFeatureFlag("pdf-viewer");  // only this line needs the client
  // ... 50 lines of static markup now in the client bundle
}
```

```tsx
// Good — extract only the interactive part
// PublicationCard.tsx — Server Component, no directive
// PdfControls.tsx    — "use client", only the flag + download state
```

### Importing a Server Component from a Client Component

```tsx
// Bad — ServerOnlyUtil imports filesystem, breaks in browser
"use client";
import { ServerOnlyUtil } from "./ServerOnlyUtil";  // ← error at runtime
```

Use `server-only` package to guard server-only modules:
```ts
import "server-only";  // throws if imported from a client bundle
```

---

## This site's island inventory

| Island | File | Why client |
|---|---|---|
| `SiteHeader` | `src/components/SiteHeader.tsx` | `usePathname`, `useTheme`, Radix Dialog |
| `ThemeProvider` | `src/components/ThemeProvider.tsx` | `localStorage` theme, `useState` |
| `PdfControls` | `src/components/ui/PdfControls.tsx` | `useFeatureFlag` (localStorage), download state |
| `/lab/features` | `src/app/lab/features/FeatureFlagPanel.tsx` | toggle switches, localStorage writes |
| `/lab/tokens` | `src/app/lab/tokens/` | live CSS variable explorer |
| `/experiments/[slug]` | `src/app/experiments/` | D3.js visualisations |

Everything else is a Server Component.

---

## Decision

Apply the island pattern throughout this site:
- Default to Server Components
- Extract the **minimum interactive surface** as a `"use client"` island
- Never add `"use client"` to a file that does not strictly require it
- Document new islands in the inventory above when added

## Consequences

- Client bundle stays small — only interactive code is shipped to the browser
- Server Components can `async/await` data directly without API routes
- Testing: Server Components are tested with Vitest (pure functions); Client
  Component islands are tested with Cypress CT (real browser, real DOM)
- The boundary makes the interactive surface **explicit and reviewable** in PRs
