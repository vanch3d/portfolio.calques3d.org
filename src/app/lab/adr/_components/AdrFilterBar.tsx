'use client'

import { useTranslations } from 'next-intl'
import { FilterInput } from '@/components/ui/FilterInput'

type AdrFilterBarProps = {
  searchQuery: string
  onSearchChange: (q: string) => void
  hasClearable: boolean
  onClear: () => void
}

export function AdrFilterBar({
  searchQuery,
  onSearchChange,
  hasClearable,
  onClear,
}: AdrFilterBarProps) {
  const t = useTranslations('LabAdr')

  return (
    <div
      role="search"
      aria-label={t('filter_aria')}
      className="flex items-center gap-md border-b-ghost border-ink-ghost pb-sm"
    >
      <FilterInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={t('filter_placeholder')}
        ariaLabel={t('filter_search_aria')}
        startAddon="⌕"
        className="w-filter-input-w shrink-0"
      />

      {hasClearable && (
        <button
          onClick={onClear}
          className="ml-auto shrink-0 label text-ink-secondary transition-colors hover:text-active"
          aria-label={t('clear_filters_aria')}
        >
          {t('clear_filters')}
        </button>
      )}
    </div>
  )
}
