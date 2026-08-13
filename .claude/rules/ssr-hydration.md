# SSR / Hydration Rules

The App Router renders components on the server first, then React hydrates on the
client. Any value that differs between server and client on that first render will
cause a hydration mismatch error. This is a common source of bugs for developers
coming from a purely CSR background.

---

## The hard rule

**Never render server/client-divergent output without explicitly declaring the
server snapshot.** If a value is unavailable on the server (localStorage, window,
user locale, Date.now(), Math.random()), the first render must produce identical
output on both sides.

---

## Common sources of mismatch

| Value | Why it diverges |
|---|---|
| `localStorage` / `sessionStorage` | Unavailable on server |
| `window`, `document`, `navigator` | Unavailable on server |
| Theme / colour mode | Read from localStorage — server always falls back to default |
| `Date.now()` / "time ago" strings | Server renders at request time, client at hydration time |
| `Math.random()` | Different value each call |
| `window.innerWidth` / JS media queries | Server has no viewport |
| User locale formatting | `navigator.language` not available server-side |

---

## The fix: `useSyncExternalStore`

Use `useSyncExternalStore` to declare explicitly what the server and client
snapshots are. React uses the server snapshot during SSR, the client snapshot
after hydration — no setState, no effect, no mismatch warning.

```tsx
import { useSyncExternalStore } from "react";

// Returns false on server, true on client after hydration.
const mounted = useSyncExternalStore(
  () => () => {},  // subscribe — no-op, this "store" never changes
  () => true,      // client snapshot
  () => false,     // server snapshot
);
```

Then gate the divergent output:

```tsx
const themeIcon = mounted
  ? resolvedMode === "dark" ? <SunIcon /> : <MoonIcon />
  : <Placeholder />;  // identical on server and client first pass
```

The placeholder must have the same bounding box as the real content to avoid
layout shift after hydration.

---

## Why not `useState` + `useEffect`?

```tsx
// Don't do this
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
```

Two problems:
1. React 19 warns: "Calling setState synchronously within an effect can trigger
   cascading renders."
2. Conceptually wrong: `useEffect` models a side effect. `useSyncExternalStore`
   models "this value genuinely differs between environments" — which is the
   accurate description of what's happening.

---

## Server Components vs Client Components

- **Server Components** never hydrate — no mismatch possible, no `useSyncExternalStore` needed.
- **Client Components** (`"use client"`) are rendered on the server first for
  the initial HTML, then hydrated. They are the only place this pattern applies.
- If a Client Component only needs to render on the client (never SSR), wrap it
  in `dynamic(() => import(...), { ssr: false })`. But prefer `useSyncExternalStore`
  for individual values — it avoids a full SSR exclusion for what is usually a
  small UI detail.

---

## Authoring checklist

When writing a Client Component that reads browser-only values:
- [ ] Is the value available on the server? If not, declare a server snapshot.
- [ ] Does the placeholder match the size/layout of the real content?
- [ ] No `useState` + `useEffect` for the mounted pattern — use `useSyncExternalStore`.
