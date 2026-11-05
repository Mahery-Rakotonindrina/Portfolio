import { memo } from 'react'
import { Flex, Link } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import useMagneticHover from 'hooks/useMagneticHover'
import usePointerCursorEnabled from 'hooks/usePointerCursorEnabled'
import {
  navIndicatorReducedTransition,
  navIndicatorTransition,
} from 'config/animations'

export type Scene = {
  href: string
  // `null` pour la scène Hero, qui n'a pas d'ancre dédiée (cf. ProgressHUD.tsx).
  anchorId: string | null
  number: string
  label: string
}

type HUDMarkerProps = {
  scene: Scene
  isActive: boolean
  shouldReduceMotion: boolean
}

// Jeton signature US-002 #4 (navIndicator), câblé en US-014 : pilote le
// "flash" d'activation d'un repère (scale+opacity). Normal : léger
// dépassement (0 -> 1.4 -> 1), 300ms. Reduced : apparition directe à
// l'échelle finale, aucune valeur intermédiaire à interpoler.
const dotVariants = {
  inactive: { scale: 0, opacity: 0 },
  active: { scale: [0, 1.4, 1], opacity: [0, 1, 1] },
}
const dotVariantsReduced = {
  inactive: { scale: 0, opacity: 0 },
  active: { scale: 1, opacity: 1 },
}

// Repère individuel de la jauge HUD (US-014), extrait de ProgressHUD.tsx —
// react/no-multi-comp interdit plusieurs composants par fichier (même
// raison que TimelineItem.tsx/RelationNode.tsx). US-020 : porte en plus
// l'effet magnétique (une des 3 familles ciblées, avec les icônes sociales
// du Hero et les nœuds du diagramme Skills) — `useMagneticHover` doit être
// appelé une fois par repère, impossible depuis l'intérieur du `.map()` du
// parent sans violer les règles des Hooks. Le lien grossit déjà au survol
// via l'état générique du curseur personnalisé (CustomCursor,
// `closest('a, button, ...')`) — pas besoin d'un `data-cursor-label` dédié
// ici, aucun label spécifique n'est demandé pour cette famille.
const HUDMarker = ({ scene, isActive, shouldReduceMotion }: HUDMarkerProps) => {
  const cursorEnabled = usePointerCursorEnabled()
  const magnetic = useMagneticHover(cursorEnabled)

  return (
    <Flex align="center" gap={2} position="relative">
      <motion.span
        variants={shouldReduceMotion ? dotVariantsReduced : dotVariants}
        animate={isActive ? 'active' : 'inactive'}
        transition={
          shouldReduceMotion
            ? navIndicatorReducedTransition
            : navIndicatorTransition
        }
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'var(--chakra-colors-accent-default)',
          display: 'inline-block',
        }}
      />
      <motion.div
        ref={magnetic.ref}
        style={{
          display: 'inline-flex',
          x: magnetic.style.x,
          y: magnetic.style.y,
        }}
      >
        <Link
          href={scene.href}
          aria-label={`Aller à la section ${scene.label}`}
          aria-current={isActive ? 'true' : undefined}
          fontFamily="mono"
          fontSize="xs"
          letterSpacing="widest"
          color={isActive ? 'accent.default' : 'text.tertiary'}
          textDecoration="none"
          sx={{ transition: 'color 0.3s ease' }}
          _hover={{ color: 'accent.default' }}
          _focusVisible={{
            boxShadow: '0 0 0 2px',
            color: 'accent.default',
          }}
        >
          {scene.number}
        </Link>
      </motion.div>
    </Flex>
  )
}

export default memo(HUDMarker)
