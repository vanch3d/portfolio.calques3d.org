Run all project validation checks and report results.

## Steps

1. Spawn the `validate-runner` agent (via the Agent tool, no arguments needed) to run content-schema validation, Mermaid diagram validation, and `tsc --noEmit`. It runs on a cheap model and returns a condensed report — do not run these checks inline yourself; the raw `tsc`/schema output is large and does not belong in this context.
2. Relay its report verbatim.

If any check fails, propose a fix before proceeding. Do not commit or push if validation fails.
