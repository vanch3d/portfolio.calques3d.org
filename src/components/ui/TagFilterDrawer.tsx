'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { FilterInput } from '@/components/ui/FilterInput'
import { ConstructionPanel } from './ConstructionPanel'
import { CollapsibleTrigger } from './Collapsible'
import type { ReactNode } from 'react'
import type { TagWithCount } from '@/lib/content/adr'

export type { TagWithCount }

type TagFilterDrawerProps = {
  tags: TagWithCount[]
  activeTags: string[]
  onTagsChange: (tags: string[]) => void
}

function tagSizeClass(count: number): string {
  if (count >= 5) return 'text-tag-w5'
  if (count === 4) return 'text-tag-w4'
  if (count === 3) return 'text-tag-w3'
  if (count === 2) return 'text-tag-w2'
  return 'text-tag-w1'
}

type TagGroupProps = {
  heading: string
  hint?: string
  tags: TagWithCount[]
  activeTags: string[]
  onToggle: (tag: string) => void
  drawerSearchQuery: string
}

function TagGroup({ heading, hint, tags, activeTags, onToggle, drawerSearchQuery }: TagGroupProps) {
  const q = drawerSearchQuery.trim().toLowerCase()
  const visibleTags = q ? tags.filter(({ tag }) => tag.toLowerCase().includes(q)) : tags

  if (visibleTags.length === 0) return null

  return (
    <div className="mb-sm" data-testid="tag-group">
      {/* Group heading — decorative, hidden from AT; the role="group" aria-label carries the accessible name */}
      <div
        className="mb-xs flex items-center gap-sm border-t-ghost border-ink-ghost py-xs"
        aria-hidden="true"
      >
        <span className="opacity-40">&#9642;</span>
        <span className="font-label text-tag-w1 leading-label tracking-wide text-ink-secondary uppercase">
          {heading}
        </span>
        {hint && (
          <span className="font-label text-micro leading-label tracking-label text-ink-secondary uppercase">
            {hint}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-baseline gap-xs" role="group" aria-label={heading}>
        {visibleTags.map(({ tag, count }) => {
          const isSelected = activeTags.includes(tag)
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              aria-pressed={isSelected}
              className={cn(
                'inline-flex items-baseline gap-xs border-ghost border-ink-secondary',
                'cursor-pointer tracking-label uppercase transition-colors',
                'px-xs py-xs font-label',
                tagSizeClass(count),
                isSelected
                  ? 'border-ink bg-ink text-ground'
                  : 'text-ink-secondary hover:border-ink hover:text-ink'
              )}
              data-testid={`tag-chip-${tag}`}
            >
              {tag}
              <span
                className={cn(
                  'inline-flex items-center justify-center font-label tabular-nums',
                  'h-badge-sm min-w-badge-sm px-badge-pad-sm py-0 text-badge-sm',
                  isSelected ? 'text-ink-ghost' : 'bg-ink-secondary text-ground'
                )}
                aria-hidden="true"
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function TagFilterDrawer({ tags, activeTags, onTagsChange }: TagFilterDrawerProps) {
  const t = useTranslations('TagFilterDrawer')
  const [isOpen, setIsOpen] = useState(false)
  const [drawerSearch, setDrawerSearch] = useState('')

  const highFrequency = tags.filter(({ count }) => count >= 3)
  const multipleRefs = tags.filter(({ count }) => count === 2)
  const singleRefs = tags.filter(({ count }) => count === 1)

  const activeCount = activeTags.length

  function handleDrawerOpenChange(open: boolean) {
    if (open) {
      setDrawerSearch('')
    }
    setIsOpen(open)
  }

  function handleTagToggle(tag: string) {
    if (activeTags.includes(tag)) {
      onTagsChange(activeTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...activeTags, tag])
    }
  }

  function handleRemoveActiveChip(tag: string) {
    onTagsChange(activeTags.filter((t) => t !== tag))
  }

  function handleNone() {
    onTagsChange([])
  }

  function renderTrigger({ open }: { open: boolean }): ReactNode {
    return (
      <div className="flex flex-wrap items-center gap-sm">
        <CollapsibleTrigger
          aria-label={open ? t('toggle_close_aria') : t('toggle_open_aria')}
          className={cn(
            'flex cursor-pointer items-center gap-xs label text-ink-secondary',
            'border-b-medium border-none bg-transparent transition-colors',
            'shrink-0 py-xs whitespace-nowrap',
            open ? 'border-active text-ink' : 'border-transparent hover:text-ink'
          )}
          data-testid="drawer-toggle"
        >
          {t('toggle_label')}
          {activeCount > 0 && (
            <span
              className={cn(
                'inline-flex items-center justify-center bg-active font-label text-ground tabular-nums',
                'h-badge min-w-badge px-badge-pad py-0 text-badge'
              )}
              data-testid="toggle-badge"
              aria-hidden="true"
            >
              {activeCount}
            </span>
          )}
          <span aria-hidden="true">{open ? '▴' : '▾'}</span>
        </CollapsibleTrigger>

        {!open && (
          <div
            className="flex min-w-0 flex-1 flex-wrap items-center gap-xs"
            data-testid="active-chips-zone"
          >
            {activeTags.length === 0 ? (
              <span
                className="font-label text-tag-w2 leading-label tracking-label text-ink-secondary uppercase"
                data-testid="chips-empty-hint"
              >
                {t('chips_empty_hint')}
              </span>
            ) : (
              activeTags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    'inline-flex items-center gap-xs bg-ink text-ground',
                    'font-label text-tag-w2 leading-label tracking-label whitespace-nowrap uppercase',
                    'px-chip-pad-x py-chip-pad-y'
                  )}
                  data-testid={`active-chip-${tag}`}
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveActiveChip(tag)}
                    className={cn(
                      'cursor-pointer border-none bg-transparent text-ground',
                      'p-0 font-label text-tag-w4 leading-none opacity-55 hover:opacity-100'
                    )}
                    aria-label={t('chip_remove_aria', { tag })}
                    data-testid={`active-chip-remove-${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <ConstructionPanel
      toggleLabel={t('toggle_label')}
      ariaLabel={t('drawer_region_aria')}
      open={isOpen}
      onOpenChange={handleDrawerOpenChange}
      trigger={renderTrigger}
      className={cn(
        'max-sm:fixed max-sm:inset-0 max-sm:z-50 max-sm:overflow-y-auto max-sm:bg-ground max-sm:px-page max-sm:py-xl',
        'max-sm:mt-0 max-sm:border-t-transparent max-sm:border-r-transparent max-sm:border-b-transparent max-sm:border-l-transparent'
      )}
    >
      <div
        className="mb-md hidden items-center justify-between border-b-medium border-ink pb-sm max-sm:flex"
        data-testid="drawer-mobile-header"
      >
        <div className="flex items-center gap-xs">
          <span className="label text-ink">{t('toggle_label')}</span>
          {activeCount > 0 && (
            <span
              className={cn(
                'inline-flex items-center justify-center bg-active font-label text-ground tabular-nums',
                'h-badge min-w-badge px-badge-pad py-0 text-badge'
              )}
              data-testid="toggle-badge-mobile"
              aria-hidden="true"
            >
              {activeCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className={cn(
            'cursor-pointer border-none bg-transparent p-0 label text-ink-secondary',
            'hover:text-ink'
          )}
          aria-label={t('toggle_close_aria')}
          data-testid="drawer-close-mobile"
        >
          {t('drawer_close_mobile')}
        </button>
      </div>

      <div className="mb-sm flex flex-wrap items-center gap-lg" data-testid="drawer-header">
        <FilterInput
          value={drawerSearch}
          onChange={setDrawerSearch}
          placeholder={t('tags_search_placeholder')}
          ariaLabel={t('tags_search_aria')}
          startAddon="⌕"
          className="w-filter-input-w-drawer max-sm:w-full"
        />

        {/* View mode tabs — future extensibility slots.
              "By frequency" is the only implemented mode.
              "By category" and "By status" are present-disabled — they signal
              the growth path without adding implementation burden now.
              Their text-ink-ghost colour is intentionally left at 1.58:1 contrast:
              WCAG 1.4.3 exempts "Inactive User Interface Components" from the text
              contrast requirement, and both buttons carry the native `disabled`
              attribute, so axe does not (and should not) flag them. */}
        <div className="flex items-center gap-sm" data-testid="view-mode-tabs">
          <button
            className={cn(
              'font-label text-micro leading-label tracking-label text-ink-secondary uppercase',
              'cursor-pointer border-t-0 border-r-0 border-b-ghost border-l-0 border-ink-secondary bg-transparent p-0'
            )}
            aria-current="true"
          >
            {t('view_frequency')}
          </button>
          <span className="font-label text-micro leading-label text-ink-ghost" aria-hidden="true">
            ·
          </span>
          <button
            className={cn(
              'font-label text-micro leading-label tracking-label text-ink-ghost uppercase',
              'cursor-not-allowed border-none bg-transparent p-0 opacity-40'
            )}
            disabled
            title="Planned: group by domain category"
          >
            {t('view_category')}
          </button>
          <span className="font-label text-micro leading-label text-ink-ghost" aria-hidden="true">
            ·
          </span>
          <button
            className={cn(
              'font-label text-micro leading-label tracking-label text-ink-ghost uppercase',
              'cursor-not-allowed border-none bg-transparent p-0 opacity-40'
            )}
            disabled
            title="Planned: filter to tags on accepted / deprecated ADRs"
          >
            {t('view_status')}
          </button>
        </div>

        {/* NONE — tag-scoped clear. Deselects all active tags, does not touch search.
              Hidden when no tags are active. Identical in mobile and desktop presentations. */}
        {activeCount > 0 && (
          <button
            onClick={handleNone}
            className={cn(
              'ml-auto cursor-pointer border-none bg-transparent p-0 label text-ink-secondary',
              'border-b-ghost border-transparent hover:border-active hover:text-active',
              'transition-colors'
            )}
            aria-label={t('none_aria')}
            data-testid="none-button"
          >
            {t('none_button')}
          </button>
        )}
      </div>

      <div data-testid="tag-groups">
        {highFrequency.length > 0 && (
          <TagGroup
            heading={t('group_high')}
            tags={highFrequency}
            activeTags={activeTags}
            onToggle={handleTagToggle}
            drawerSearchQuery={drawerSearch}
          />
        )}

        {multipleRefs.length > 0 && (
          <TagGroup
            heading={t('group_multiple')}
            tags={multipleRefs}
            activeTags={activeTags}
            onToggle={handleTagToggle}
            drawerSearchQuery={drawerSearch}
          />
        )}

        {singleRefs.length > 0 && (
          <TagGroup
            heading={t('group_single')}
            hint={t('group_single_hint')}
            tags={singleRefs}
            activeTags={activeTags}
            onToggle={handleTagToggle}
            drawerSearchQuery={drawerSearch}
          />
        )}
      </div>
    </ConstructionPanel>
  )
}
