/**
 * SkipNav — Client, owns SkipNav.* strings (useTranslations('SkipNav'))
 *
 * "Skip to content" bypass link (WCAG 2.4.1). Visually hidden until it takes
 * keyboard focus, then drawn as a ruled box at the top-left of the viewport.
 * Activating it moves focus to the target and scrolls it into view.
 *
 * Adapted from the DiceUI Base UI skip-nav (https://diceui.com/docs/utilities/base/skip-nav):
 * same focus-handling behaviour, restyled with this project's tokens and i18n.
 * The focus outline is the global `:focus-visible` ring from reset.css.
 */

'use client'

import type { ComponentProps, MouseEvent } from 'react'
import { mergeProps } from '@base-ui/react/merge-props'
import { useTranslations } from 'next-intl'
import { MAIN_CONTENT_ID } from '@/components/ui/main-content-id'
import { cn } from '@/lib/utils'

type SkipNavProps = ComponentProps<'a'>

export function SkipNav({
  href = `#${MAIN_CONTENT_ID}`,
  children,
  className,
  ...linkProps
}: SkipNavProps) {
  const t = useTranslations('SkipNav')

  return (
    <a
      data-slot="skip-nav"
      {...mergeProps<'a'>(
        {
          href,
          className: cn(
            'sr-only',
            [
              'focus-visible:not-sr-only focus-visible:fixed focus-visible:top-md focus-visible:left-md focus-visible:z-nav', // placement
              'focus-visible:border-medium focus-visible:border-ink focus-visible:bg-ground focus-visible:px-md focus-visible:py-sm', // box
              'focus-visible:font-label focus-visible:text-label focus-visible:text-ink focus-visible:uppercase', // type
            ],
            className
          ),
          onClick: (event: MouseEvent<HTMLAnchorElement>) => {
            if (event.defaultPrevented) return
            skipToTarget(event, href)
          },
        },
        linkProps
      )}
    >
      {children ?? t('label')}
    </a>
  )
}

function skipToTarget(event: MouseEvent<HTMLAnchorElement>, href: string) {
  const target = getTarget(href)
  if (!target) return

  event.preventDefault()
  if (target.tabIndex < 0 && !target.hasAttribute('tabindex')) {
    makeTemporarilyFocusable(target)
  }
  target.focus({ preventScroll: true })
  target.scrollIntoView({ block: 'start' })
}

// <main> is not focusable by default. Make it focusable for the duration of the
// jump only, and hide the focus outline: the target is a region, not a control.
function makeTemporarilyFocusable(target: HTMLElement) {
  const outline = target.style.outline

  target.tabIndex = -1
  target.style.outline = 'none'
  target.addEventListener(
    'blur',
    () => {
      target.removeAttribute('tabindex')
      target.style.outline = outline
    },
    { once: true }
  )
}

function getTarget(href: string) {
  if (!href.startsWith('#') || href.length < 2) return null
  return document.getElementById(decodeURIComponent(href.slice(1)))
}
