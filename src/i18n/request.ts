import { getRequestConfig } from 'next-intl/server'

/**
 * next-intl request configuration.
 * English-only for now — locale is fixed. No URL-based routing.
 * Adding a second locale: add a messages/<locale>.json and update the
 * supported locales list here; then add [locale] routing (see ADR 006).
 */
export default getRequestConfig(async () => {
  const locale = 'en'

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
