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
/research/publications — list page (Server Component — zero JS sent to browser)
│
├── <SiteHeader />          ← Client island (usePathname, useTheme, Dialog)
│
├── <PublicationsList />    ← Server Component
│   └── <PublicationCard /> ← Server Component
│       ├── <Badge />           Server — type badge
│       ├── <div html />        Server — CSL citation
│       ├── <a href=doi />      Server — DOI link
│       ├── <a href=pdf />      Server — download link
│       └── <a href=detail />   Server — link to detail page
│
└── <SiteFooter />          ← Server Component

/research/publications/[key] — detail page
│
├── <PublicationDetail />   ← Server Component
│   ├── <aside>             ← Server — badge, citation, links
│   └── <main>
│       └── <PdfViewerPanel /> ← Client island (useFeatureFlag, dynamic pdf.js)
│             └── <PdfViewer /> ← loaded dynamically, ssr: false
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

## CORS and the server-side proxy pattern

Islands that load external resources can hit a constraint that looks like an island
problem but is actually a network policy problem: **CORS**.

### The PDF viewer case

The publication detail page renders a PDF viewer island (`PdfViewerPanel`). The
viewer uses `react-pdf` (pdf.js under the hood), which fetches PDF bytes via the
browser `fetch()` API. The PDFs are hosted as GitHub Release assets in a private
repository.

Two independent constraints blocked a direct approach:

1. **`X-Frame-Options: DENY`** — GitHub sets this header on all responses,
   preventing `<iframe>` embedding regardless of the domain.
2. **CORS** — GitHub Release download URLs (`github.com/…/releases/download/…`)
   do not include `Access-Control-Allow-Origin` headers. `fetch()` from the
   browser is blocked. This applies even though the release is publicly listed —
   GitHub does not serve CORS headers on these URLs.
3. **Private repository 404** — for assets in a private repository, GitHub
   returns `404` (not `401`) to unauthenticated server-side requests. Even with
   a bearer token in the `Authorization` header, the `browser_download_url` path
   returns 404. The correct approach for private repo assets is the GitHub API
   endpoint with `Accept: application/octet-stream`:
   ```
   GET https://api.github.com/repos/{owner}/{repo}/releases/assets/{id}
   Authorization: Bearer {token}
   Accept: application/octet-stream
   ```
   GitHub responds with a `302` redirect to a signed CDN URL; `fetch()` follows
   it automatically.

### The proxy route solution

A Next.js Route Handler (`/api/pdf-proxy`) runs on the server — no browser CORS
restrictions apply to server-side `fetch()`. The island passes the PDF's
`browser_download_url` as a query parameter; the proxy:

1. Validates the URL against a strict allowlist (only our own release prefix)
2. Resolves the filename to a GitHub asset ID via the releases API (result cached
   at module level for the process lifetime)
3. Fetches the asset bytes via the API with authentication
4. Streams them back to the browser with `Content-Type: application/pdf`

```
Browser (island)          Server (Route Handler)          GitHub API
     │                            │                             │
     │  GET /api/pdf-proxy?url=…  │                             │
     │ ─────────────────────────► │  GET /releases/tags/…       │
     │                            │ ───────────────────────────►│
     │                            │ ◄─── asset list (cached) ───│
     │                            │  GET /releases/assets/{id}  │
     │                            │  Accept: application/octet  │
     │                            │ ───────────────────────────►│
     │                            │ ◄───── 302 → signed CDN ────│
     │                            │ ◄───── PDF bytes ───────────│
     │ ◄── PDF bytes (streamed) ──│                             │
```

The download link (`<a href={pdf}>`) in the aside keeps the direct GitHub URL —
browser navigation is not subject to CORS, so downloads work without the proxy.

### General rule

When a Client Component island needs to fetch a cross-origin resource that does
not serve CORS headers, the fix is always the same: move the fetch to a Route
Handler and have the island call the Route Handler instead. The island remains
the interactive surface; the Route Handler is the network boundary.

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
| `PdfControls` | `src/components/ui/PdfControls.tsx` | `useFeatureFlag` (localStorage), viewer toggle state |
| `PdfViewerPanel` | `src/components/ui/PdfViewerPanel.tsx` | `useFeatureFlag`, dynamic pdf.js import (`ssr: false`) |
| `/api/pdf-proxy` | `src/app/api/pdf-proxy/route.ts` | Route Handler (not an island) — proxies GitHub asset bytes server-side to bypass CORS |
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
