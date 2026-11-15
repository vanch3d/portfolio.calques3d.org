/**
 * FigureLightbox — Client, owns FigureLightbox.* strings
 *
 * Makes a plate's image a button that opens the same image full-viewport on an
 * opaque `bg-ground` sheet, with its "Fig. n" number and caption. Built on the
 * Base UI Dialog (modal: focus trap, Esc, outside press, scroll lock, focus
 * return). The image is scaled to fit but never above its natural size.
 * Issue: .docs/issues/case-studies-surface/04-expand-case-study-figures.md
 */

'use client'

import { useRef } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { useTranslations } from 'next-intl'

type FigureLightboxProps = {
  no: number
  src: string
  alt: string
  width?: number
  height?: number
  caption?: string
  /** The inline image; it becomes the trigger's content. */
  children: React.ReactNode
}

export function FigureLightbox({
  no,
  src,
  alt,
  width,
  height,
  caption,
  children,
}: FigureLightboxProps) {
  const t = useTranslations('FigureLightbox')
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <Dialog.Root onOpenChangeComplete={(open) => (open ? undefined : triggerRef.current?.focus())}>
      <Dialog.Trigger
        ref={triggerRef}
        aria-label={t('expand', { no })}
        className="relative block w-full cursor-zoom-in border-none bg-transparent p-0"
        data-testid="case-plate-expand"
      >
        {children}
        <span
          aria-hidden="true"
          className="absolute top-xs right-xs border-ghost border-ink bg-ground px-xs label text-ink"
        >
          ⤢
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup
          className="fixed inset-0 z-overlay flex flex-col gap-md bg-ground p-page"
          data-testid="case-plate-lightbox"
        >
          <div className="flex justify-end">
            <Dialog.Close className="cursor-pointer border-none bg-transparent p-0 label text-ink-secondary hover:text-ink">
              {t('close')}
            </Dialog.Close>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="grid max-h-full min-h-0 w-fit max-w-full grid-rows-[minmax(0,1fr)_auto] gap-md">
              {/* eslint-disable-next-line @next/next/no-img-element -- same remote Piwigo URL as the inline image */}
              <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="mx-auto h-auto max-h-full min-h-0 w-auto max-w-full border-ghost border-ink-ghost"
              />
              <Dialog.Title className="flex flex-col items-center gap-xs border-t-medium border-ink pt-sm text-center text-caption leading-label sm:flex-row sm:justify-center sm:gap-md">
                <span className="flex-none label text-ink">{t('figure_no', { no })}</span>
                {caption ? <span className="leading-body text-ink">{caption}</span> : null}
              </Dialog.Title>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
