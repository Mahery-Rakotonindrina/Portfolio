import { Box } from '@chakra-ui/react'
import { motion, useMotionTemplate, useTransform } from 'framer-motion'
import styles from './styles.module.css'
import usePointerParallax from 'hooks/usePointerParallax'

type PerspectiveGridProps = {
  parallaxEnabled: boolean
}

// Amplitude max de la parallaxe de la grille (px) — DESIGN_PROPOSAL_V2 §2 :
// "amplitude max ~12-15px".
const GRID_PARALLAX_AMPLITUDE = 12

// Grille en perspective CSS, décor permanent en arrière-plan du panneau
// Sidebar (US-013). Active en permanence sur desktop (panneau fixed à partir
// de `xl`) puisque `parallaxEnabled` reste vrai tant que la souris bouge,
// pas seulement pendant la séquence de boot. Statique sur mobile/tablette et
// sous `prefers-reduced-motion` (géré par l'appelant via `parallaxEnabled`).
const PerspectiveGrid = ({ parallaxEnabled }: PerspectiveGridProps) => {
  const { x, y } = usePointerParallax(parallaxEnabled)
  const gridX = useTransform(
    x,
    [-0.5, 0.5],
    [GRID_PARALLAX_AMPLITUDE, -GRID_PARALLAX_AMPLITUDE]
  )
  const gridY = useTransform(
    y,
    [-0.5, 0.5],
    [GRID_PARALLAX_AMPLITUDE, -GRID_PARALLAX_AMPLITUDE]
  )
  // Un `motion.div` qui reçoit `style.x`/`style.y` pose un `transform` en
  // style INLINE, qui écrase entièrement le `transform: rotateX(60deg)`
  // défini en CSS statique (spécificité inline > classe) — la grille ne
  // montrait alors jamais son inclinaison 3D, ni au repos (`transform: none`)
  // ni pendant la parallaxe (translate seul, sans rotation). La rotation fixe
  // et la translation animée sont donc composées ensemble ici, dans la seule
  // valeur `transform` réellement posée sur l'élément.
  const transform = useMotionTemplate`rotateX(60deg) translateX(${gridX}px) translateY(${gridY}px)`

  return (
    <Box className={styles.perspectiveGrid} aria-hidden="true">
      <motion.div
        className={styles.perspectiveGridPlane}
        style={{ transform }}
      />
    </Box>
  )
}

export default PerspectiveGrid
