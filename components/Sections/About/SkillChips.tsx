import { memo } from 'react'
import { Box, Divider, Flex, Icon, Text } from '@chakra-ui/react'
import { motion, Variants } from 'framer-motion'
import { Skill } from 'config/skills'
import { modalEnter, modalEnterReduced } from 'config/animations'

// Hissé au niveau module (convention établie US-007/US-008/US-013 : motion(X)
// recréé dans le corps d'un composant devient dangereux dès qu'un state local
// peut déclencher un re-render — ce composant n'a pas de state local lui-même
// mais reste monté/démonté par ses parents, autant appliquer la même
// convention partout).
const MotionFlex = motion(Flex)
const MotionChip = motion(Flex)

// Micro-stagger (~35ms) entre chips — demande explicite US-016, réutilise le
// token `modalEnter`/`modalEnterReduced` déjà défini (config/animations.ts)
// plutôt que d'en créer un nouveau.
const chipListVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.035 } },
}
const chipListVariantsReduced: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0 } },
}

type SkillChipsProps = {
  id?: string
  title: string
  skills: Skill[]
  prefersReducedMotion: boolean
  showTitle?: boolean
}

// Rendu partagé des compétences réelles d'une catégorie (config/skills.ts),
// réutilisé par RelationDiagram (desktop) et CategoryAccordion
// (mobile/tablette) — une seule source pour le rendu "chip", pas de
// duplication entre les deux présentations.
const SkillChips = ({
  id,
  title,
  skills,
  prefersReducedMotion,
  showTitle = true,
}: SkillChipsProps) => {
  const chipVariants = prefersReducedMotion ? modalEnterReduced : modalEnter

  return (
    <Box id={id} role="region" aria-label={title}>
      {showTitle && (
        <>
          <Text as="div" textStyle="label" color="text.secondary" pb={2}>
            {title}
          </Text>
          <Divider mb={3} borderColor="border.subtle" />
        </>
      )}
      <MotionFlex
        wrap="wrap"
        gap={2}
        initial="initial"
        animate="animate"
        variants={
          prefersReducedMotion ? chipListVariantsReduced : chipListVariants
        }
      >
        {skills.map((skill) => (
          <MotionChip
            key={skill.name}
            variants={chipVariants}
            align="center"
            gap={2}
            px={3}
            py={1.5}
            borderWidth="1px"
            borderColor="border.subtle"
            bg="bg.surface"
            borderRadius={0}
          >
            <Icon as={skill.icon} color="accent.default" fontSize="1.1em" />
            <Text as="span" fontSize="sm">
              {skill.name}
            </Text>
          </MotionChip>
        ))}
      </MotionFlex>
    </Box>
  )
}

export default memo(SkillChips)
