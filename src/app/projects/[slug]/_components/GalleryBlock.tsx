/**
 * GalleryBlock — Client, needs ProjectDetail.* strings
 *
 * Piwigo album reference. Piwigo integration (actual gallery URLs/previews)
 * is a follow-on task — for now this surfaces the album name as a labelled
 * entry so the resource type isn't silently dropped. Hidden when absent.
 */

'use client'

import { useTranslations } from 'next-intl'
import { ResourceBlockSection } from './ResourceBlockSection'

type GalleryBlockProps = {
  galleryAlbum?: string
}

export function GalleryBlock({ galleryAlbum }: GalleryBlockProps) {
  const t = useTranslations('ProjectDetail')

  if (!galleryAlbum) return null

  return (
    <ResourceBlockSection testId="gallery-block" heading={t('gallery_heading')}>
      <span className="label text-ink-secondary">{galleryAlbum}</span>
    </ResourceBlockSection>
  )
}
