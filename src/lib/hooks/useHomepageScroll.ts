import { useEffect } from 'react'

type UseHomepageScrollOptions = {
  heroId: string
  navId: string
  nameId: string
  navTrigger?: number
  fadeStart?: number
  fadeEnd?: number
}

export function useHomepageScroll({
  heroId,
  navId,
  nameId,
  navTrigger = 0.3,
  fadeStart = 0.15,
  fadeEnd = 0.3,
}: UseHomepageScrollOptions): void {
  useEffect(() => {
    const hero = document.getElementById(heroId)
    const nav = document.getElementById(navId)
    const name = document.getElementById(nameId)
    if (!hero || !nav || !name) return

    function onScroll() {
      const progress = window.scrollY / hero!.offsetHeight
      const t = Math.max(0, Math.min(1, (progress - fadeStart) / (fadeEnd - fadeStart)))
      name!.style.opacity = String(1 - t)
      nav!.classList.toggle('nav-visible', progress > navTrigger)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [heroId, navId, nameId, navTrigger, fadeStart, fadeEnd])
}
