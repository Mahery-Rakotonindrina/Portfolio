import { memo } from 'react'
import { Text, Stack, Link, Icon, Box } from '@chakra-ui/react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { RiHeartPulseFill, RiGithubFill } from 'react-icons/ri'
import {
  scrollReveal,
  scrollRevealReduced,
  hoverLift,
  hoverLiftReduced,
} from 'config/animations'

// Composants motion hissés au niveau module (pas dans le corps du composant) :
// GetInTouch a son propre `useInView()` local (émoji rimuru) qui déclenche un
// re-render à chaque bascule de `inView`. Si `motion(Stack)`/`motion(Text)`/...
// étaient recréés à chaque render (pattern utilisé ailleurs — Sidebar,
// Detail.tsx, Experience/index.tsx, FeaturedWorks/index.tsx — mais sans hook
// local déclenchant un re-render), React traiterait la nouvelle identité de
// composant comme un type différent et démonterait/remonterait tout l'arbre à
// chaque render : le `ref` de l'IntersectionObserver change alors de nœud DOM,
// recréant un nouvel observer qui redéclenche immédiatement `inView`, d'où une
// boucle de remount infinie (vérifiée via `MutationObserver` : ~180
// mutations/s sur `#contact` avant ce correctif, 0 après). Composants stables
// ici pour casser la boucle.
const MotionStack = motion(Stack)
const MotionText = motion(Text)
const MotionBox = motion(Box)
const MotionLink = motion(Link)

const rimuruVariant: Variants = {
  shake: {
    rotate: [0, 15, 0, -15, 0],
    transition: {
      delay: 1.2,
      duration: 0.5,
      repeat: 2,
      ease: 'easeInOut',
    },
  },
  jump: {
    y: [0, -35, 0],
    transition: {
      delay: 1.8,
      duration: 0.5,
      repeat: 3,
      ease: 'easeInOut',
    },
  },
}

// scrollReveal : entrée en cascade au scroll (US-002), désactivée (fondu
// seul) si prefers-reduced-motion — même pattern que Detail.tsx (US-004),
// Experience/index.tsx et FeaturedWorks/index.tsx (US-005/US-006).
const GetInTouch = () => {
  const [ref, inView] = useInView()
  const shouldReduceMotion = useReducedMotion()

  const itemVariants: Variants = shouldReduceMotion
    ? scrollRevealReduced
    : scrollReveal
  const parentVariants: Variants = {
    animate: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } },
  }
  const hoverLiftTarget = (shouldReduceMotion ? hoverLiftReduced : hoverLift)
    .hover

  return (
    <MotionStack
      width={{ base: '99%', lg: '60%', xl: '75%' }}
      height="100%"
      spacing={{ base: 6, xl: 8 }}
      as="footer"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={parentVariants}
    >
      <MotionText as="h2" textStyle="title" variants={itemVariants}>
        On discute ?{' '}
        <Text as="span" variant="emphasis" fontSize="inherit">
          <motion.div
            style={{ display: 'inline-block' }}
            variants={rimuruVariant}
            ref={ref}
            animate={inView ? ['shake', 'jump'] : false}
          >
            (⁀ᗢ⁀)
          </motion.div>
        </Text>
      </MotionText>
      <MotionText
        variant="description"
        textStyle="body"
        variants={itemVariants}
      >
        Bon, je suis plutôt introverti de nature, mais je réponds toujours avec
        plaisir — tant que ma batterie sociale le permet 😄. Que ce soit pour
        parler code, boulot, moto, sport ou même des trucs un peu geek. <br />
        Tu peux me contacter sur les réseaux ou m’envoyer un{' '}
        <Link
          href="mailto:maeryrakotonindrina17@gmail.com"
          target="_blank"
          rel="noreferrer"
        >
          mail{' '}
        </Link>
        quand tu veux !
      </MotionText>

      <MotionBox
        textAlign="center"
        borderTop="1px solid"
        borderColor="border.subtle"
        paddingTop={{ base: 10, lg: 20, xl: 20 }}
        paddingBottom={{ base: 5, lg: 18 }}
        variants={itemVariants}
      >
        <MotionLink
          textDecoration="none"
          rel="noreferrer"
          href="https://github.com/Mahery-Rakotonindrina"
          target="_blank"
          display="inline-block"
          _focus={{ boxShadow: 'none' }}
          whileHover={hoverLiftTarget}
        >
          <Text as="span" textStyle="label" color="text.tertiary">
            <Icon as={RiGithubFill} h={6} w={6} color="accent.default" />
            <br />
            Designed and Made with{' '}
            <Icon as={RiHeartPulseFill} color="accent.default" />
          </Text>
        </MotionLink>
      </MotionBox>
    </MotionStack>
  )
}

export default memo(GetInTouch)
