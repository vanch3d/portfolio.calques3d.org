// IdentityBlock — name, era label, positioning sentence, absolutely
// positioned over the CareerArc canvas. #canvas-name is targeted by
// HomepageScrollHandler to fade opacity on scroll.

import { getTranslations } from 'next-intl/server'

export async function IdentityBlock() {
  const t = await getTranslations('HomePage')

  return (
    <div
      id="canvas-identity"
      className="absolute left-page z-10 max-w-identity-max-width"
      style={{ top: 'clamp(6rem, 14vh, 8rem)' }}
    >
      <p className="mb-sm flex items-center gap-md label">
        <span
          className="inline-block w-lg border-t-medium border-ink-secondary"
          aria-hidden="true"
        />
        {t('title')}
      </p>

      <h1
        id="canvas-name"
        className="mb-md font-display text-display leading-display text-ink italic transition-opacity duration-[350ms] ease-linear"
      >
        {t('name')}
      </h1>

      <p className="max-w-identity-text-max-width font-body text-positioning leading-caption text-ink-secondary">
        {t('positioning')}
      </p>
    </div>
  )
}
