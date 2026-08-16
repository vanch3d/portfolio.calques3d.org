// Cypress E2E support file.
// Runs before each E2E spec.

import "./commands";
import installLogsCollector from "cypress-terminal-report/src/installLogsCollector";

installLogsCollector({ collectTypes: ["cy:log", "cy:command"] });

// ─── Animation freeze for accessibility testing ───────────────────────────────
//
// Principle (ADR 011): accessibility tests assert the final/resting state of
// components, not transient animation states. CSS animations gated behind
// `@media (prefers-reduced-motion: no-preference)` are a progressive
// enhancement — the content they reveal is what matters for a11y.
//
// `animation-fill-mode: both` causes elements to start at their `from` keyframe
// (e.g. opacity: 0) at first paint. If axe runs before the animation progresses,
// it sees near-zero opacity and correctly flags colour-contrast violations —
// accurate for the snapshot, but not relevant to the resting accessibility state.
//
// Solution: collapse animation durations to 0.001ms so every animation completes
// within one browser frame. By the time axe runs, all elements are at their
// `to` keyframe (final state). The animation infrastructure remains intact;
// only the visual duration is zeroed out for testing purposes.
//
// See: ADR 011 — CSS Animation and Accessibility Testing Contract
Cypress.on("window:before:load", (win) => {
  const style = win.document.createElement("style");
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-delay: 0ms !important;
    }
  `;
  win.document.documentElement.appendChild(style);
});
