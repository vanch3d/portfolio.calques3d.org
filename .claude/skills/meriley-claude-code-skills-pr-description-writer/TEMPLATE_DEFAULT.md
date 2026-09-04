# Default Pull Request Template

This is the default PR template used when no project-specific template is found in `.github/`.

---

## Summary

<!-- Brief overview of changes (1-3 bullet points) -->
<!-- What was changed and why -->

## Changes

<!-- Technical details of modifications -->
<!-- Which components/modules were affected -->
<!-- Approach taken and key decisions -->

**Files Modified**:
<!-- List key files changed -->
- `path/to/file1` - Description of changes
- `path/to/file2` - Description of changes

## Testing

<!-- How changes were tested -->

**Unit Tests**:
- Coverage: <!-- X% or "See test output" -->
- New tests: <!-- Count or "N/A" -->
- Modified tests: <!-- Count or "N/A" -->

**Integration Tests**:
<!-- Status or "N/A" -->

**Manual Testing**:
<!-- Steps performed and results -->
- Tested <!-- scenario --> in <!-- environment -->
- Verified <!-- behavior/outcome -->

## Breaking Changes

<!-- Only include this section if there are backwards-incompatible changes -->
<!-- Delete this section if no breaking changes -->

### Change 1: <!-- Description -->
**Before**:
```language
<!-- old code/signature -->
```

**After**:
```language
<!-- new code/signature -->
```

**Migration**: <!-- How to adapt existing code -->

## Related Issues

<!-- Link related issues using GitHub keywords -->
<!-- Examples: -->
<!-- Closes #123 -->
<!-- Fixes #456 -->
<!-- Relates to #789 -->

## Checklist

<!-- Mark items with [x] when complete -->

- [ ] Tests passing
- [ ] Linters passing
- [ ] Security scan passing
- [ ] Documentation updated (if needed)
- [ ] No fabricated claims or unverified performance numbers
- [ ] Breaking changes documented (if any)
- [ ] All code examples verified

---

<!-- Optional: Verification metadata -->
<!-- Verification: All claims verified against git diff -->
<!-- Verification Date: [timestamp] -->
