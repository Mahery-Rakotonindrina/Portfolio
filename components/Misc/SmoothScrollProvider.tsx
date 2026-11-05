import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// US-012 : fondation globale du scroll à inertie. Aucune scène ne consomme
// encore ScrollTrigger (viendra avec US-018 Projects) ni la jauge HUD
// (US-014) — seule l'instance Lenis est exposée ci-dessous pour que ces
// futures US n'aient pas besoin de réinstancier Lenis, sans ajouter de
// Context/abstraction non demandée ici.
let lenisInstance: Lenis | null = null

/**
 * Instance Lenis active, ou `null` avant le montage de `SmoothScrollProvider`
 * (SSR, ou démontage). Lecture seule — ne pas appeler `destroy()` dessus
 * depuis un consommateur, le cycle de vie reste géré uniquement ici.
 */
export const getLenisInstance = (): Lenis | null => lenisInstance

const SmoothScrollProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      // Les 4 ancres existantes du Menu (#aboutMe, #jobs, #works, #contact)
      // continuent de fonctionner nativement via cette option — pas de
      // réécriture des handlers onClick existants (US-008/US-010).
      anchors: true,
      // Déjà `true` par défaut dans Lenis 1.3.x, explicite ici car c'est un
      // critère d'acceptation formel de l'US : désactive l'amorti (comportement
      // scroll natif pur) sous `prefers-reduced-motion`, sans détection custom.
      respectReducedMotion: true,
      // `syncTouch` (défaut Lenis : false) n'est pas activé : Lenis ne lisse
      // alors que les évènements `wheel` (desktop). Le scroll tactile reste
      // intégralement piloté par le navigateur (momentum iOS/Android natif,
      // rien à combattre) — c'est la façon la plus directe de satisfaire
      // "amorti réduit sur tactile, proche du scroll natif" sans introduire
      // de réglage de lerp arbitraire à ajuster à l'œil.
    })
    lenisInstance = lenis

    // Snippet officiel de synchronisation Lenis <-> GSAP ScrollTrigger
    // (README Lenis, section "GSAP ScrollTrigger"), copié tel quel.
    lenis.on('scroll', ScrollTrigger.update)
    const syncGsapTicker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(syncGsapTicker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(syncGsapTicker)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  return <>{children}</>
}

export default SmoothScrollProvider
