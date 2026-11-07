import { useEffect, useState } from 'react'

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

// Détection "vrai" desktop (souris fine + survol possible), pas une largeur
// de viewport — US-020 (curseur personnalisé). `false` au tout premier rendu
// (SSR ET premier rendu client, avant que l'effet n'ait tourné) : aucun
// mismatch d'hydratation possible, même pattern de principe que `mounted &&
// reduced` déjà établi ailleurs (Menu/BootLog/ProgressHUD), mais ici la
// valeur initiale commune aux deux rendus est directement `false` plutôt que
// nécessiter un second flag `mounted`.
// N'écoute QUE l'évènement `change` de la media query — jamais `pointermove`
// ni aucun évènement souris : sur tactile, ce hook ne pose donc aucun
// listener de mouvement, conformément au critère d'acceptation ("ne doit pas
// s'initialiser/écouter d'évènements souris inutilement sur tactile").
const useFinePointer = (): boolean => {
  const [hasFinePointer, setHasFinePointer] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(FINE_POINTER_QUERY)
    setHasFinePointer(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setHasFinePointer(event.matches)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return hasFinePointer
}

export default useFinePointer
