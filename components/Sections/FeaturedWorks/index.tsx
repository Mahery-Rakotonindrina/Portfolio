import { memo, useRef } from 'react'
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
  // US-018 bugfix : titre + description restent visibles pendant TOUT le
  // scrub horizontal desktop, pas seulement au tout premier instant. Avant ce
  // fix, seule la zone de la galerie (wrapper, dans ProjectGallery.tsx) était
  // pinnée par GSAP — titre/texte, frères précédents dans le DOM, avaient
  // déjà défilé hors écran dès que le haut de la galerie atteignait le haut
  // du viewport. `pinContainerRef` englobe maintenant titre + description +
  // galerie : c'est CE conteneur que ProjectGallery pine en entier (voir le
  // commentaire dans son effet GSAP). `wrapper`/`track` (internes à
  // ProjectGallery) restent la seule source des mesures de distance de
  // scrub, inchangé.
  const pinContainerRef = useRef<HTMLDivElement>(null)

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
      {/* `spacing` déplacé ici depuis le MotionStack ci-dessus (même valeur,
          même rendu visuel) : ce Stack devient le conteneur pinné en entier
          par ProjectGallery (ref transmise en prop), le MotionStack parent
          ne contient donc plus qu'un seul enfant direct et n'a plus besoin de
          son propre `spacing`. Framer Motion propage les `variants` nommés
          aux MotionText descendants à travers ce Stack intermédiaire (pas de
          motion ici) comme à travers n'importe quel élément DOM classique. */}
      <Stack ref={pinContainerRef} spacing={{ base: 6, xl: 8 }} width="100%">
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

        <ProjectGallery works={WorksList} pinContainerRef={pinContainerRef} />
      </Stack>
    </MotionStack>
  )
}

export default memo(FeaturedWorksSection)
