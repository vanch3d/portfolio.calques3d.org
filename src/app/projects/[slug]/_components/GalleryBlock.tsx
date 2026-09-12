/**
 * GalleryBlock — Client, needs ProjectDetail.* strings
 *
 * Piwigo album reference. Piwigo integration (actual gallery URLs/previews)
 * is a follow-on task — for now this surfaces the album name as a labelled
 * entry so the resource type isn't silently dropped. Hidden when absent.
 */

'use client'

import { useTranslations } from 'next-intl'

type GalleryBlockProps = {
  galleryAlbum?: string
}

export function GalleryBlock({ galleryAlbum }: GalleryBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (!galleryAlbum) return null

  return (
    <section data-testid="gallery-block" className="mb-lg">
      <p className="mb-sm label text-ink-ghost">{t('gallery_heading')}</p>
      <span className="label text-ink-secondary">{galleryAlbum}</span>
    </section>
  )
}
