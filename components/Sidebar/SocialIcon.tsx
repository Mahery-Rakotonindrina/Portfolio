import { memo } from 'react'
import { Icon, Link } from '@chakra-ui/react'
import { motion, TargetAndTransition } from 'framer-motion'
import useMagneticHover from 'hooks/useMagneticHover'
import usePointerCursorEnabled from 'hooks/usePointerCursorEnabled'
import { SocialMedia } from 'config/sidebar'

const MotionLink = motion(Link)

type SocialIconProps = {
  socialMedia: SocialMedia
  hoverLiftTarget: TargetAndTransition
}

// Icône sociale individuelle du Hero, extraite de Sidebar/index.tsx —
// react/no-multi-comp interdit plusieurs composants par fichier (même
// raison que TimelineItem.tsx/RelationNode.tsx/HUDMarker.tsx). US-020 :
// l'effet magnétique (une des 3 familles ciblées, avec les nœuds du
// diagramme Skills et les repères de la jauge HUD) nécessite d'appeler
// `useMagneticHover` une fois par icône — impossible depuis l'intérieur du
// `.map()` du composant parent sans violer les règles des Hooks.
// L'effet magnétique (motion.div englobant, translation x/y) et le
// `whileHover` existant de `hoverLiftTarget` (sur `MotionLink`, translation
// y) portent sur deux nœuds DOM distincts exprès : Framer Motion ne sait pas
// composer un `style` piloté par MotionValue et une cible `animate` sur la
// MÊME clé du MÊME élément (même piège déjà documenté pour la parallaxe de
// l'Avatar, US-013).
const SocialIcon = ({ socialMedia, hoverLiftTarget }: SocialIconProps) => {
  const cursorEnabled = usePointerCursorEnabled()
  const magnetic = useMagneticHover(cursorEnabled)

  return (
    <motion.div
      ref={magnetic.ref}
      style={{
        display: 'inline-flex',
        x: magnetic.style.x,
        y: magnetic.style.y,
      }}
    >
      <MotionLink
        variant="description"
        aria-label={socialMedia.label}
        rel="noreferrer"
        width={8}
        href={socialMedia.href}
        target="_blank"
        _focus={{ boxShadow: 'none' }}
        whileHover={hoverLiftTarget}
      >
        <Icon w={6} h={6} as={socialMedia.icon} color="currentColor" />
      </MotionLink>
    </motion.div>
  )
}

export default memo(SocialIcon)
