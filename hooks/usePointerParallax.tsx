import { useEffect } from 'react'
import { useMotionValue, useSpring, MotionValue } from 'framer-motion'

type PointerParallax = {
  x: MotionValue<number>
  y: MotionValue<number>
}

const SPRING_CONFIG = { stiffness: 60, damping: 20, mass: 0.5 }

// Position de la souris normalisée (-0.5 à 0.5, 0 = centre de la fenêtre),
// lissée par un ressort Framer Motion (pas un mapping 1:1 brut) — utilisée
// par la grille en perspective de la Sidebar et par l'avatar (même hook,
// amplitude différente appliquée par l'appelant via `useTransform` = 2
// couches de profondeur). US-013 / DESIGN_PROPOSAL_V2 §2.
// Écoute `pointermove` sur `window` tant que `enabled` est vrai (desktop
// uniquement, désactivée sous `prefers-reduced-motion`) ; se détache sinon,
// laissant les valeurs au repos (0).
const usePointerParallax = (enabled: boolean): PointerParallax => {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING_CONFIG)
  const y = useSpring(rawY, SPRING_CONFIG)

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    const handlePointerMove = (event: PointerEvent) => {
      rawX.set(event.clientX / window.innerWidth - 0.5)
      rawY.set(event.clientY / window.innerHeight - 0.5)
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [enabled, rawX, rawY])

  return { x, y }
}

export default usePointerParallax
