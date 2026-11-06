import { memo } from 'react'
import { Text, Stack } from '@chakra-ui/react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import ProjectGallery from './ProjectGallery'
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
      // Bugfix (section "Mon best-of" restant invisible à certaines tailles
      // de fenêtre, ex. 1920×900) : `amount` est une fraction de la SURFACE
      // de CET élément qui doit être visible simultanément pour déclencher
      // la cascade. Cette section contient le pin-spacer GSAP de
      // ProjectGallery (US-018), potentiellement très haut (plusieurs
      // milliers de px) — la fraction maximale visible en une fois y est
      // plafonnée à `hauteur_viewport / hauteur_élément`, parfois sous la
      // barre des 30% (confirmé : 900/3698 ≈ 24% à 1920×900), rendant le
      // seuil historique inatteignable. `amount: 0` déclenche dès qu'un
      // pixel de la section est visible, indépendamment de sa hauteur —
      // n'affecte pas les autres sections (Hero/About/Experience/Contact),
      // qui n'ont pas de pin-spacer et restent sur `amount: 0.3`.
      viewport={{ once: true, amount: 0 }}
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

      <ProjectGallery works={WorksList} />
    </MotionStack>
  )
}

export default memo(FeaturedWorksSection)
