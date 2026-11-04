import { memo } from 'react'
import { Text, Stack, SimpleGrid } from '@chakra-ui/react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import FeaturedCard from './FeaturedCard'
import { WorksList } from 'config/works'
import { scrollReveal, scrollRevealReduced } from 'config/animations'

// scrollReveal : entrée en cascade au scroll (US-002), désactivée (fondu
// seul) si prefers-reduced-motion — même pattern que Detail.tsx (US-004) et
// Experience/index.tsx (US-005). Chaque carte de la galerie gère ensuite sa
// propre révélation indépendante (voir FeaturedCard.tsx).
const FeaturedWorksSection = () => {
  const shouldReduceMotion = useReducedMotion()

  const MotionStack = motion(Stack)
  const MotionText = motion(Text)

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
        Mon best-of 💥
      </MotionText>
      <MotionText
        variant="description"
        textStyle="body"
        variants={itemVariants}
      >
        Qu’ils soient nés en freelance, en entreprise ou dans mes nuits
        d’inspiration . . . <br /> voici un petit best-of de ce que j’ai
        construit avec passion (et parfois un peu de caféine).
      </MotionText>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 6, md: 8 }}>
        {WorksList.map((work, idx) => (
          <FeaturedCard key={work.title} work={work} idx={idx + 1} />
        ))}
      </SimpleGrid>
    </MotionStack>
  )
}

export default memo(FeaturedWorksSection)
