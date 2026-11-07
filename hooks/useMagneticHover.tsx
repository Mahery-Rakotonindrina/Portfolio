import { useEffect, useRef } from 'react'
import { MotionValue, useMotionValue, useSpring } from 'framer-motion'

type MagneticHover<T extends HTMLElement> = {
  ref: React.RefObject<T>
  style: { x: MotionValue<number>; y: MotionValue<number> }
}

const SPRING_CONFIG = { stiffness: 150, damping: 15, mass: 0.1 }
// Rayon d'approche (px) à partir du centre de la cible, et fraction de la
// distance curseur→centre appliquée comme translation — valeurs modérées
// (traction visible mais jamais un suivi 1:1 du curseur), à ajuster par le
// designer si le rendu ne convient pas (décision technique de développeur,
// pas un choix visuel figé).
const MAGNETIC_RADIUS_PX = 70
const MAGNETIC_STRENGTH = 0.35

// Registre partagé : un seul listener `pointermove` global pour toutes les
// instances actives (icônes sociales du Hero, nœuds du diagramme Skills,
// repères de la jauge HUD — les 3 familles ciblées par US-020), plutôt qu'un
// listener par élément (cf. skill vercel-react-best-practices,
// client-event-listeners : dédupliquer les listeners globaux).
type MagneticEntry = {
  ref: React.RefObject<HTMLElement>
  x: MotionValue<number>
  y: MotionValue<number>
}
const registry = new Set<MagneticEntry>()
let listenerAttached = false

const handleGlobalPointerMove = (event: PointerEvent) => {
  registry.forEach(({ ref, x, y }) => {
    const el = ref.current
    if (!el) {
      return
    }
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = event.clientX - centerX
    const dy = event.clientY - centerY
    const distance = Math.hypot(dx, dy)
    if (distance < MAGNETIC_RADIUS_PX) {
      x.set(dx * MAGNETIC_STRENGTH)
      y.set(dy * MAGNETIC_STRENGTH)
    } else {
      x.set(0)
      y.set(0)
    }
  })
}

// Effet magnétique (US-020) : translate l'élément vers le centre de la cible
// à l'approche du curseur, limité par construction aux seuls appelants qui
// passent `enabled=true` (desktop souris fine + non reduced-motion, cf.
// `usePointerCursorEnabled`) — jamais généralisé, chaque famille de cibles
// doit explicitement appeler ce hook. Sur tactile/reduced-motion, `enabled`
// est `false` : aucun listener n'est posé, les MotionValue restent à 0.
const useMagneticHover = <T extends HTMLElement = HTMLDivElement>(
  enabled: boolean
): MagneticHover<T> => {
  const ref = useRef<T>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING_CONFIG)
  const y = useSpring(rawY, SPRING_CONFIG)

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    // Cast nécessaire : le registre partagé est typé en `HTMLElement` pour
    // pouvoir accueillir les refs de tous les appelants (div, button, a...),
    // alors que chaque instance de ce hook est typée plus précisément via
    // son paramètre générique `T`. Sûr à l'exécution (tout `T extends
    // HTMLElement` EST un `HTMLElement`) — seule la lecture `.current` dans
    // `handleGlobalPointerMove` ci-dessus en dépend, jamais une écriture.
    const entry: MagneticEntry = {
      ref: ref as unknown as React.RefObject<HTMLElement>,
      x: rawX,
      y: rawY,
    }
    registry.add(entry)
    if (!listenerAttached) {
      window.addEventListener('pointermove', handleGlobalPointerMove)
      listenerAttached = true
    }

    return () => {
      registry.delete(entry)
      rawX.set(0)
      rawY.set(0)
      if (registry.size === 0 && listenerAttached) {
        window.removeEventListener('pointermove', handleGlobalPointerMove)
        listenerAttached = false
      }
    }
  }, [enabled, rawX, rawY])

  return { ref, style: { x, y } }
}

export default useMagneticHover
