Scaffold a new project MDX content file.

## Arguments

`$ARGUMENTS` — project slug and type, e.g. "calques3d research" or "hivemq-edge engineering"

## Steps

1. Parse `$ARGUMENTS`: first token is the slug, second is the type (`research` or `engineering`).
2. Check `src/content/<type>/` to confirm no file with that slug already exists.
3. Check `src/content/positions/` and list available position slugs for reference.
4. Create `src/content/<type>/<slug>.mdx` with the appropriate template below.
5. Remind the user to:
   - Fill in all frontmatter fields (position slug, period, tags, etc.)
   - Write the narrative body
   - Run `/validate` after editing to catch schema errors

---

## Research project template

```mdx
---
title: ""
abbr: ""
type: research
status: completed
visibility: public
featured: false

position: ""
period:
  start: ""
  end: ""

funding: ""

links:
  github: []
  linkedin: []
  external: []

media:
  cover: ""
  gallery: ""
  slides: ""

tags: []
publications: ""
---

<!-- Project narrative here -->
```

---

## Engineering project template

```mdx
---
title: ""
abbr: ""
type: engineering
status: completed
visibility: public
featured: false

position: ""
period:
  start: ""
  end: ""

links:
  github: []
  external: []
  live: ""

media:
  cover: ""
  gallery: ""
  slides: ""

highlights: []
artefacts: []
tags: []
publications: ""
---

<!-- Case study narrative here -->
```
