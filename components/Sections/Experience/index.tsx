import { memo } from 'react'
import { Text, Stack } from '@chakra-ui/react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import ExperienceTimeline from './Timeline'
import { scrollReveal, scrollRevealReduced } from 'config/animations'

const DetailSection = () => {
  const shouldReduceMotion = useReducedMotion()

  const MotionStack = motion(Stack)
  const MotionText = motion(Text)

  // scrollReveal : entrée en cascade au scroll (US-002), désactivée (fondu
  // seul) si prefers-reduced-motion. Même pattern que Detail.tsx (US-004) —
  // la timeline elle-même gère sa propre révélation entrée par entrée,
  // indépendamment de ce groupe titre/description.
  const itemVariants: Variants = shouldReduceMotion
    ? scrollRevealReduced
    : scrollReveal
  const parentVariants: Variants = {
    animate: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } },
  }

  return (
    <MotionStack
      width={{ base: '99%', lg: '60%', xl: '75%' }}
      height="100%"
      spacing={{ base: 6, xl: 8 }}
      as="section"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={parentVariants}
    >
      <MotionText as="h2" textStyle="title" variants={itemVariants}>
        Parcours professionnel.
      </MotionText>
      <MotionText
        variant="description"
        textStyle="body"
        variants={itemVariants}
      >
        Depuis 2019, j’ai eu la chance de collaborer avec plusieurs entreprises
        qui m’ont permis de relever de beaux défis et d’affiner mes compétences,
        aussi bien humaines que techniques. <br />
        Chacune de ces expériences a contribué à façonner le développeur que je
        suis aujourd’hui, et garde une place particulière dans mon parcours.
      </MotionText>

      <ExperienceTimeline />
    </MotionStack>
  )
}

export default memo(DetailSection)
