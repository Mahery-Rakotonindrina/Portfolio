import { memo } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { motion, useMotionTemplate } from 'framer-motion'
import { categoryLabels } from './skillCategoryLabels'
import useMagneticHover from 'hooks/useMagneticHover'
import usePointerCursorEnabled from 'hooks/usePointerCursorEnabled'
import { SkillCategory } from 'config/skills'

const MotionBox = motion(Box)

type RelationNodeProps = {
  category: SkillCategory
  x: number
  y: number
  active: boolean
  fontSize: number
  panelId: string
  onHoverStart: () => void
  onHoverEnd: () => void
  onFocus: () => void
  onBlur: () => void
  onClick: () => void
}

// Nœud radial individuel du diagramme Skills, extrait de RelationDiagram.tsx
// (react/no-multi-comp interdit plusieurs composants par fichier — même
// raison que l'extraction de TimelineItem.tsx en US-017 : `useMagneticHover`
// doit être appelé une fois par nœud, impossible depuis l'intérieur du
// `.map()` du parent sans violer les règles des Hooks).
// US-020 : porte, en plus du rendu déjà existant depuis US-016,
// - l'effet magnétique (une des 3 familles ciblées, avec les icônes sociales
//   du Hero et les repères de la jauge HUD) ;
// - le `data-cursor-label="plus"` consommé par CustomCursor pour afficher
//   "+" au survol ;
// - un badge "+" statique, toujours visible, quand le curseur personnalisé
//   est désactivé (tactile ou prefers-reduced-motion, même condition que
//   CustomCursor via `usePointerCursorEnabled`) — l'affordance ne doit
//   jamais disparaître simplement parce que le curseur custom ne peut pas
//   la porter.
const RelationNode = ({
  category,
  x,
  y,
  active,
  fontSize,
  panelId,
  onHoverStart,
  onHoverEnd,
  onFocus,
  onBlur,
  onClick,
}: RelationNodeProps) => {
  const cursorEnabled = usePointerCursorEnabled()
  const magnetic = useMagneticHover<HTMLButtonElement>(cursorEnabled)
  // Compose centrage (translate(-50%,-50%), nécessaire pour ancrer le nœud
  // sur son point calculé) + décalage magnétique en une seule valeur
  // `transform` — jamais une prop Chakra `transform` séparée à côté d'un
  // `style` Framer sur le même nœud (même bug/fix que PerspectiveGrid,
  // US-013 : un `style` inline Framer écrase silencieusement tout
  // `transform` posé via une prop de style Chakra).
  const transform = useMotionTemplate`translate(-50%, -50%) translate(${magnetic.style.x}px, ${magnetic.style.y}px)`

  return (
    <MotionBox
      ref={magnetic.ref}
      as="button"
      type="button"
      position="absolute"
      left={`${x}px`}
      top={`${y}px`}
      style={{ transform }}
      whiteSpace="nowrap"
      px={3}
      py={1.5}
      bg="bg.surface"
      borderWidth="1px"
      borderColor={active ? 'accent.default' : 'border.subtle'}
      borderRadius={0}
      cursor="pointer"
      aria-expanded={active}
      aria-controls={panelId}
      data-cursor-label="plus"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      _focusVisible={{
        boxShadow: '0 0 0 2px',
        borderColor: 'accent.default',
      }}
      sx={{ transition: 'border-color 0.2s ease' }}
    >
      <Text
        as="span"
        textStyle="label"
        fontSize={`${fontSize}px`}
        color={active ? 'accent.default' : 'text.secondary'}
      >
        {categoryLabels[category]}
      </Text>
      {!cursorEnabled && (
        <Box
          as="span"
          aria-hidden="true"
          position="absolute"
          top="-6px"
          right="-6px"
          width="16px"
          height="16px"
          borderRadius="50%"
          bg="accent.default"
          color="bg.surface"
          fontSize="10px"
          lineHeight="16px"
          textAlign="center"
          fontWeight="bold"
        >
          +
        </Box>
      )}
    </MotionBox>
  )
}

export default memo(RelationNode)
