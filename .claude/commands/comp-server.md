---
description: Start or stop the design comp server at http://localhost:5001
license: MIT
metadata:
  author: vanch3d
  version: "1.1"
---

Manage the local design comp server for `.impeccable/mocks/`.

**Usage:** `/comp-server [start|stop|status]`

If no argument is given, check whether the server is running and start it if not.

**start:** Run `npx serve .impeccable/mocks -p 5001 --no-clipboard` in the background. Report the URL and list the available comp files.

**stop:** Find the process on port 5001 and kill it.

**status:** Check if port 5001 is in use. List the files in `.impeccable/mocks/` with their sizes and modification times. If no drafts exist yet, say so clearly.

Ensure `.impeccable/mocks/` exists before starting. Create it if missing.
