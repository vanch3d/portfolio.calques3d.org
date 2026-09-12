'use client'

import { useState } from 'react'
import { FilterInput } from '@/components/ui/FilterInput'

type FilterInputDemoProps = {
  placeholder: string
  ariaLabel: string
  startAddon?: string
  initialValue?: string
}

export function FilterInputDemo({
  placeholder,
  ariaLabel,
  startAddon,
  initialValue = '',
}: FilterInputDemoProps) {
  const [value, setValue] = useState(initialValue)

  return (
    <FilterInput
      value={value}
      onChange={setValue}
      placeholder={placeholder}
      ariaLabel={ariaLabel}
      startAddon={startAddon}
    />
  )
}
