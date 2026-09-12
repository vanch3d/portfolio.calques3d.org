import React from 'react'

/**
 * Wraps a component under a visually-hidden h2 heading.
 *
 * CT scaffold (component-index.html) provides an h1. Components that render
 * h3 headings would skip a level (h1 → h3), triggering axe's heading-order
 * rule. This wrapper inserts an h2 between the scaffold h1 and the component,
 * giving a valid hierarchy:
 *
 *   h1  "Component Test"   (scaffold, visually hidden)
 *   h2  "Component section" (this wrapper, visually hidden)
 *   h3+ component heading  (component under test, visible)
 *
 * Components that render h2 are also covered: h1 → h2 (wrapper) → h2
 * (component) is valid. Components with no headings are unaffected.
 *
 * The h2 uses the cy-a11y-scaffold class defined in component-index.html
 * (position: absolute; 1px × 1px; overflow: hidden) so it is in the
 * accessibility tree but invisible.
 */
export function wrapWithSection(component: React.ReactNode): React.ReactElement {
  return (
    <React.Fragment>
      <h2 className="cy-a11y-scaffold">Component section</h2>
      {component}
    </React.Fragment>
  )
}
