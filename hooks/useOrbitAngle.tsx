import { useAnimationFrame, useMotionValue, MotionValue } from 'framer-motion'

// Angle de rotation continu (degrés), incrémenté à chaque frame via
// `useAnimationFrame` (delta en ms, indépendant du framerate réel) — pilote
// le teaser orbital du CTA Skills (US-015). Un tour complet toutes les ~16s :
// "orbite légèrement", pas un carrousel qui capte l'attention.
const DEGREES_PER_MS = 360 / 16000

const useOrbitAngle = (): MotionValue<number> => {
  const angle = useMotionValue(0)

  useAnimationFrame((_, delta) => {
    angle.set(angle.get() + delta * DEGREES_PER_MS)
  })

  return angle
}

export default useOrbitAngle
