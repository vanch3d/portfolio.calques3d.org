## Critical Verification Rules

### Zero Fabrication Policy (P0 - CRITICAL)

**NEVER fabricate:**

1. **Features** that don't exist in git diff
2. **Files** that aren't in the changeset
3. **Methods/APIs** that weren't modified
4. **Performance claims** without benchmark evidence
5. **Test coverage** numbers without test output
6. **Statistics** without actual measurements

**Example violations:**

```markdown
❌ BAD - Fabricated feature
"Added ToNodeAndEdges() method"
[Method doesn't exist in git diff - actually added ToNode() and ToEdges() separately]

✅ GOOD - Verified against git diff
"Added ToNode() and ToEdges() methods"
[Both methods verified in git diff]
```

### Performance Claims (P0 - CRITICAL)

**NEVER SAY (without benchmarks)**:

- "10x faster"
- "50ms → 5ms"
- "90% performance improvement"
- ANY specific numbers or multipliers

**ALWAYS ACCEPTABLE**:

- "Eliminates network overhead"
- "In-process execution"
- "Reduces database round-trips"
- "Single network call instead of multiple"
- "Batches operations to reduce queries"

**Example violations:**

```markdown
❌ BAD - Unverified performance claim
"Performance improved by 10x (50ms → 5ms per request)"
[No benchmarks provided, numbers fabricated]

✅ GOOD - Factual architectural statement
"Eliminates network overhead by using in-process function calls instead of RPC"
[Architectural fact verified in code]
```

### Marketing Language (P1 - HIGH)

**BANNED BUZZWORDS**:

- enterprise, advanced, robust, comprehensive, modern, rich
- first-class, powerful, seamless, cutting-edge, revolutionary
- blazing-fast, lightning-fast, world-class, state-of-the-art
- significantly, greatly, dramatically (without numbers)
- next-generation, innovative, sophisticated

**BANNED EMOJIS** (in technical text):

- 🏗️⚡📦🔗🔒📝🧪👉💡📚🔧📖🚀💯🔥🎉

**Example violations:**

```markdown
❌ BAD - Marketing language
"Enterprise-grade task management with blazing-fast performance 🚀"

✅ GOOD - Technical description
"Task entity management with CRUD operations using connection pooling"
```

### Code Reference Verification (P0 - CRITICAL)

**MUST verify:**

- All file paths mentioned exist in git diff
- All imports are actual paths (not fabricated)
- All method names match git diff
- All configuration options exist

**Example violations:**

```markdown
❌ BAD - Wrong import path
import "taskcore/converter"
[Actual path is "git.taservs.net/rcom/taskcore/converters"]

✅ GOOD - Verified import path
import "git.taservs.net/rcom/taskcore/converters"
[Path verified in git diff]
```

