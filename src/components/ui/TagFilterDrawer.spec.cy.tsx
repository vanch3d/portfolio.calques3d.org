/**
 * TagFilterDrawer — Cypress CT spec
 *
 * Verifies the full interaction contract of the tag filter drawer molecule:
 *   - Toggle button renders and controls open/closed state
 *   - Count badge visibility tied to activeTags
 *   - Active chips zone (visible when closed, hidden when open)
 *   - Chip removal via × button on active chips
 *   - NONE button: hidden when no tags, visible when tags active
 *   - Drawer tag cloud: toggling chips calls onTagsChange correctly
 *   - Inner drawer search filters visible chips
 *   - Tag frequency groups (High / Multiple / Single) render correctly
 *   - Size tier classes applied by count
 *   - Drawer inner search resets on re-open
 *   - Accessibility: closed state and open state with active tags
 */

import { TagFilterDrawer } from './TagFilterDrawer'
import type { TagWithCount } from './TagFilterDrawer'

const sampleTags: TagWithCount[] = [
  { tag: 'testing', count: 5 },
  { tag: 'workflow', count: 4 },
  { tag: 'agents', count: 3 },
  { tag: 'a11y', count: 2 },
  { tag: 'cypress', count: 2 },
  { tag: 'animation', count: 1 },
  { tag: 'api', count: 1 },
]

describe('TagFilterDrawer', () => {
  beforeEach(() => {
    // Force a desktop viewport so the drawer renders in its in-page (non-fixed)
    // layout. The sm breakpoint (640px) switches the drawer from a mobile
    // full-screen fixed overlay to a static block. Tests that click the
    // drawer-toggle to close the drawer would fail at the default CT viewport
    // (<640px) because the fixed overlay covers the toggle button.
    cy.viewport(1024, 768)
  })

  // ── Toggle button ────────────────────────────────────────────────────────

  it('renders the toggle button with TAGS label', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').should('contain.text', 'TAGS')
  })

  it('drawer is closed by default', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('tag-drawer-panel').should('not.exist')
  })

  it('toggle button has aria-expanded=false when closed', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').should('have.attr', 'aria-expanded', 'false')
  })

  it('clicking the toggle opens the drawer', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('tag-drawer-panel').should('exist')
  })

  it('toggle button has aria-expanded=true when open', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('drawer-toggle').should('have.attr', 'aria-expanded', 'true')
  })

  it('clicking the toggle again closes the drawer', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('tag-drawer-panel').should('exist')
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('tag-drawer-panel').should('not.exist')
  })

  // ── Count badge ──────────────────────────────────────────────────────────

  it('count badge is hidden when no tags are active', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('toggle-badge').should('not.exist')
  })

  it('count badge shows the active tag count', () => {
    cy.mountAccessible(
      <TagFilterDrawer
        tags={sampleTags}
        activeTags={['testing', 'agents']}
        onTagsChange={cy.stub()}
      />
    )
    cy.findByTestId('toggle-badge').should('exist').and('contain.text', '2')
  })

  // ── Active chips zone ────────────────────────────────────────────────────

  it('active chips zone is hidden when the drawer is open', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={['testing']} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('active-chips-zone').should('not.exist')
  })

  it('active chips zone is visible with correct tags when drawer is closed', () => {
    cy.mountAccessible(
      <TagFilterDrawer
        tags={sampleTags}
        activeTags={['testing', 'a11y']}
        onTagsChange={cy.stub()}
      />
    )
    cy.findByTestId('active-chips-zone').should('exist')
    cy.findByTestId('active-chip-testing').should('contain.text', 'testing')
    cy.findByTestId('active-chip-a11y').should('contain.text', 'a11y')
  })

  // ── Chip interaction in drawer ───────────────────────────────────────────

  it('clicking an unselected chip in the drawer calls onTagsChange with tag added', () => {
    const onTagsChange = cy.stub().as('onTagsChange')
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={onTagsChange} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('tag-chip-testing').click()
    cy.get('@onTagsChange').should('have.been.calledWith', ['testing'])
  })

  it('clicking a selected chip in the drawer calls onTagsChange with tag removed', () => {
    const onTagsChange = cy.stub().as('onTagsChange')
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={['testing']} onTagsChange={onTagsChange} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('tag-chip-testing').click()
    cy.get('@onTagsChange').should('have.been.calledWith', [])
  })

  // ── Remove × on active chip ──────────────────────────────────────────────

  it('remove × on an active chip calls onTagsChange with that tag removed', () => {
    const onTagsChange = cy.stub().as('onTagsChange')
    cy.mountAccessible(
      <TagFilterDrawer
        tags={sampleTags}
        activeTags={['testing', 'a11y']}
        onTagsChange={onTagsChange}
      />
    )
    cy.findByTestId('active-chip-remove-testing').click()
    cy.get('@onTagsChange').should('have.been.calledWith', ['a11y'])
  })

  // ── NONE button ──────────────────────────────────────────────────────────

  it('NONE button is hidden when no tags are active', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('none-button').should('not.exist')
  })

  it('NONE button is visible when tags are active and clicking it clears all tags', () => {
    const onTagsChange = cy.stub().as('onTagsChange')
    cy.mountAccessible(
      <TagFilterDrawer
        tags={sampleTags}
        activeTags={['testing', 'a11y']}
        onTagsChange={onTagsChange}
      />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('none-button').should('exist').click()
    cy.get('@onTagsChange').should('have.been.calledWith', [])
  })

  // ── Inner drawer search ──────────────────────────────────────────────────

  it('inner drawer search filters chips — non-matching chips are not visible', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByRole('textbox', { name: 'Filter tags' }).type('test')
    cy.findByTestId('tag-chip-testing').should('exist')
    cy.findByTestId('tag-chip-workflow').should('not.exist')
    cy.findByTestId('tag-chip-a11y').should('not.exist')
  })

  // ── Tag groups ───────────────────────────────────────────────────────────

  it('renders High, Multiple, and Single frequency groups with correct chips', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()

    cy.findByRole('group', { name: 'High frequency' }).within(() => {
      cy.findByTestId('tag-chip-testing').should('exist')
      cy.findByTestId('tag-chip-workflow').should('exist')
      cy.findByTestId('tag-chip-agents').should('exist')
    })

    cy.findByRole('group', { name: 'Multiple references' }).within(() => {
      cy.findByTestId('tag-chip-a11y').should('exist')
      cy.findByTestId('tag-chip-cypress').should('exist')
    })

    cy.findByRole('group', { name: 'Single reference' }).within(() => {
      cy.findByTestId('tag-chip-animation').should('exist')
      cy.findByTestId('tag-chip-api').should('exist')
    })
  })

  // ── Size tier classes ─────────────────────────────────────────────────────

  it('a tag with count >= 5 gets text-tag-w5 class', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('tag-chip-testing').should('have.class', 'text-tag-w5')
  })

  it('a tag with count = 1 gets text-tag-w1 class', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('tag-chip-animation').should('have.class', 'text-tag-w1')
  })

  // ── Drawer search resets on re-open ──────────────────────────────────────

  it('drawer resets inner search on re-open', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByRole('textbox', { name: 'Filter tags' }).type('test')
    cy.findByRole('textbox', { name: 'Filter tags' }).should('have.value', 'test')
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('drawer-toggle').click()
    cy.findByRole('textbox', { name: 'Filter tags' }).should('have.value', '')
  })

  // ── Accessibility ────────────────────────────────────────────────────────

  it('has no axe accessibility violations in the default closed state', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.checkA11y()
  })

  it('has no axe accessibility violations in the open state with active tags', () => {
    cy.mountAccessible(
      <TagFilterDrawer
        tags={sampleTags}
        activeTags={['testing', 'a11y']}
        onTagsChange={cy.stub()}
      />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.checkA11y()
  })
})

// ── Mobile viewport (< 640px) ─────────────────────────────────────────────────
//
// At max-sm the drawer switches from an inline panel to a full-screen fixed
// overlay. The NONE button is hidden; a CLOSE button takes its place.
// These tests verify the layout switch and interaction contract at 375px.

describe('TagFilterDrawer — mobile viewport', () => {
  beforeEach(() => {
    cy.viewport(375, 812)
  })

  it('toggle opens the drawer panel', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('tag-drawer-panel').should('exist')
  })

  it('CLOSE button is visible on mobile (replaces NONE)', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('drawer-close-mobile').should('be.visible')
  })

  it('NONE button is hidden on mobile', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={['testing']} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('none-button').should('not.be.visible')
  })

  it('CLOSE button closes the drawer', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('drawer-close-mobile').click()
    cy.findByTestId('tag-drawer-panel').should('not.exist')
  })

  it('selecting a tag calls onTagsChange', () => {
    const onTagsChange = cy.stub()
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={onTagsChange} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.findByTestId('tag-chip-testing').click()
    cy.wrap(onTagsChange).should('have.been.calledOnce')
  })

  it('has no axe accessibility violations (closed state)', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={[]} onTagsChange={cy.stub()} />
    )
    cy.checkA11y()
  })

  it('has no axe accessibility violations (open state)', () => {
    cy.mountAccessible(
      <TagFilterDrawer tags={sampleTags} activeTags={['testing']} onTagsChange={cy.stub()} />
    )
    cy.findByTestId('drawer-toggle').click()
    cy.checkA11y()
  })
})
