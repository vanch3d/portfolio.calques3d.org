
### Phase 1: Template Discovery (2-3 minutes)

**Locate PR template:**

```bash
# Search common locations
ls .github/PULL_REQUEST_TEMPLATE.md 2>/dev/null
ls .github/pull_request_template.md 2>/dev/null
ls .github/PULL_REQUEST_TEMPLATE/ 2>/dev/null
ls docs/pull_request_template.md 2>/dev/null
```

**Template locations (priority order)**:

1. `.github/PULL_REQUEST_TEMPLATE.md` (primary)
2. `.github/pull_request_template.md` (alternative casing)
3. `.github/PULL_REQUEST_TEMPLATE/*.md` (multiple templates)
4. `docs/pull_request_template.md` (less common)
5. Use TEMPLATE_DEFAULT.md if none found

**Parse template sections:**

- Identify required sections (Summary, Changes, Testing, etc.)
- Extract section headers and structure
- Note any special instructions or checklists
- Determine optional vs required fields

### Phase 2: Change Analysis (5-10 minutes)

**Gather git context:**

```bash
# Get file change statistics
git diff [base-branch]...HEAD --stat

# Get commit history
git log [base-branch]...HEAD --oneline --no-decorate

# Get detailed changes
git diff [base-branch]...HEAD

# Check for test changes
git diff [base-branch]...HEAD --name-only | grep -E "(test|spec)" || true
```

**Extract information:**

1. **Files Changed**
   - List of modified files
   - Components/modules affected
   - New files vs modified vs deleted

2. **Commit Messages**
   - Already verified by `safe-commit` skill
   - Extract main themes
   - Identify related issues (Closes #123)

3. **Type of Changes**
   - feat: New features
   - fix: Bug fixes
   - refactor: Code restructuring
   - docs: Documentation only
   - test: Test additions/changes
   - chore: Maintenance tasks

4. **Breaking Changes Detection**
   - API signature changes
   - Removed methods/functions
   - Changed configuration format
   - Dependency version changes

5. **Test Coverage**
   - New test files added
   - Modified test files
   - Coverage reports (if available from test output)

### Phase 3: Description Generation (5-10 minutes)

**Generate each template section with verification:**

#### Summary Section

```markdown
## Summary

- [Main change from commit messages]
- [Second major change from commits]
- [Third change if applicable]
```

**Verification**:

- [ ] All bullet points backed by commits
- [ ] No fabricated features not in git diff
- [ ] Clear, concise technical descriptions

#### Changes Section

```markdown
## Changes

[Technical paragraph explaining modifications]

**Files Modified**:

- `path/to/file1.ext` - [what changed]
- `path/to/file2.ext` - [what changed]

**Components Affected**:

- [Component 1]: [nature of change]
- [Component 2]: [nature of change]
```

**Verification**:

- [ ] All mentioned files exist in git diff
- [ ] All components accurately described
- [ ] No fabricated modifications
- [ ] Technical descriptions only (no marketing)

#### Testing Section

```markdown
## Testing

**Unit Tests**:

- Coverage: [X%] (if available from test output)
- New tests: [count] tests added
- Modified tests: [count] tests updated

**Integration Tests**:

- [Status or N/A]

**Manual Testing**:

- Tested [scenario] in [environment]
- Verified [behavior]

**Test Files Changed**:

- `path/to/test/file1.test.ext`
- `path/to/test/file2.spec.ext`
```

**Verification**:

- [ ] Coverage numbers from actual test output (not fabricated)
- [ ] Test files mentioned exist in git diff
- [ ] Manual testing claims are reasonable
- [ ] No unverified performance claims

#### Breaking Changes Section (Conditional)

````markdown
## Breaking Changes

### Change 1: [API Signature Change]

**Before**:

```[language]
[old signature from git diff]
```
````

**After**:

```[language]
[new signature from git diff]
```

**Migration**: [How to adapt existing code]

### Change 2: [Removed Method]

**Removed**: `MethodName()`
**Replacement**: Use `NewMethodName()` instead

````

**Verification**:
- [ ] All breaking changes verified in git diff
- [ ] Before/after signatures accurate
- [ ] Migration instructions provided
- [ ] Only include if truly breaking (not just additions)

#### Related Issues Section
```markdown
## Related Issues

Closes #123
Fixes #456
Relates to #789
````

**Verification**:

- [ ] Issue numbers extracted from commit messages
- [ ] Using correct keywords (Closes, Fixes, Relates to)
- [ ] Issue numbers are valid (optional GitHub API check)

#### Checklist Section

```markdown
## Checklist

- [x] Tests passing (coverage: X%)
- [x] Linters passing
- [x] Security scan passing
- [x] Documentation updated
- [x] No fabricated claims
- [x] No unverified performance numbers
- [ ] Reviewed by [reviewer] (unchecked for PR template)
```

**Verification**:

- [ ] Checkmarks reflect actual results from safe-commit
- [ ] Coverage number matches test output
- [ ] All pre-submission items checked
- [ ] Review items left unchecked (for reviewers)

### Phase 4: Verification (3-5 minutes)

**Run comprehensive verification checklist:**

```markdown
## PR Description Verification Checklist

### P0 - CRITICAL (Must Fix Before PR)

- [ ] All mentioned features exist in git diff
- [ ] All mentioned files exist in git diff output
- [ ] No fabricated methods or APIs
- [ ] No unverified performance claims ("10x faster")
- [ ] No fabricated timing numbers ("50ms → 5ms")
- [ ] Coverage numbers match actual test output (or not specified)

### P1 - HIGH (Should Fix)

- [ ] No marketing buzzwords (enterprise, blazing, advanced, robust)
- [ ] No decorative emojis in technical text
- [ ] No sales language ("cutting-edge", "revolutionary")
- [ ] Technical descriptions only
- [ ] Breaking changes accurately documented

### P2 - MEDIUM (Consider Fixing)

- [ ] All template sections populated
- [ ] Related issues correctly linked
- [ ] Checklist reflects actual status
- [ ] Consistent formatting
```

**Generate verification report:**

```markdown
### Verification Report

**Status**: ✅ PASSED / ⚠️ WARNINGS / ❌ FAILED

**Files Verified**: X files checked against git diff
**Claims Verified**: Y claims verified
**Issues Found**: Z issues

**P0 Issues (Must Fix)**:

- None

**P1 Issues (Should Fix)**:

- None

**P2 Issues (Consider)**:

- None

**Verification Date**: [timestamp]
```

### Phase 5: Output Generation (1-2 minutes)

**Generate final PR description:**

```markdown
[Populated template with all sections]

---

<!-- Verification metadata (optional - can be hidden in HTML comment) -->

Verification: All claims verified against git diff [commit-range]
Verification Date: [timestamp]
Files Analyzed: X files
Claims Verified: Y claims
```
