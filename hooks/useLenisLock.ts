import { useEffect } from 'react'
import { getLenisInstance } from 'components/Misc/SmoothScrollProvider'

// Bugfix (PO, "je suis dans un détail et je scroll, et la galerie scroll, ce
// qui est en background") : les Modal Chakra bloquent le scroll NATIF du
// body (`blockScrollOnMount`), mais Lenis ne dépend pas de ça — il capte les
// évènements wheel/touch lui-même et déplace sa propre position de scroll
// virtuelle indépendamment du `overflow` du body. Un modal ouvert au-dessus
// de la page n'arrêtait donc jamais Lenis, qui continuait à faire défiler
// (et donc à faire avancer le scrub GSAP de ProjectGallery) juste en dessous
// — reproduit et confirmé par mesure réelle (`window.scrollY` avançait de
// 0 à 1366px en scrollant alors qu'un modal était ouvert). `getLenisInstance`
// existait déjà dans SmoothScrollProvider mais n'était consommé nulle part.
export const useLenisLock = (locked: boolean): void => {
  useEffect(() => {
    const lenis = getLenisInstance()
    if (!lenis) {
      return undefined
    }
    if (locked) {
      lenis.stop()
    }
    return () => {
      lenis.start()
    }
  }, [locked])
}

export default useLenisLock
