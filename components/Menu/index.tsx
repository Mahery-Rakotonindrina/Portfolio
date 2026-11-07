import { useEffect, useState } from 'react'
import { Container, useBreakpointValue } from '@chakra-ui/react'
import { motion, Variants, useAnimation, useReducedMotion } from 'framer-motion'
import styles from './styles.module.css'
import Navigation from './Navigation'
import { mobileBreakpointsMap } from 'config/theme'
import useScrollDirection, { ScrollDirection } from 'hooks/useScrollDirection'

const mobileMenuVariants: Variants = {
  hidden: {
    opacity: [1, 0.85, 0],
    y: -80,
    transition: {
      ease: 'easeInOut',
      duration: 0.35,
    },
  },
  show: {
    opacity: [0, 0.85, 1],
    y: 0,
    transition: {
      ease: 'easeInOut',
      duration: 0.28,
    },
  },
}

// Contrepartie `prefers-reduced-motion` : même mécanique de fondu que les
// tokens `*Reduced` de `config/animations.ts` (fondu seul, sans translation
// ni cascade d'opacité intermédiaire).
// `y: 0` explicite (pas omis) dans les deux états : si `y` n'est jamais la
// cible d'une transition, Framer Motion laisse la valeur courante de `y`
// inchangée au lieu de la réinitialiser — un résidu `translateY(-80px)` capté
// par `initial="hidden"` avant que `shouldReduceMotion` ne se résolve peut
// alors rester bloqué indéfiniment (vérifié : sans ce `y: 0`, la barre mobile
// reste hors-écran sous `prefers-reduced-motion`, rendant le hamburger
// inatteignable).
const mobileMenuVariantsReduced: Variants = {
  hidden: { opacity: 0, y: 0, transition: { duration: 0.01 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.01 } },
}

const Menu = () => {
  const controls = useAnimation()
  const isMobile = useBreakpointValue(mobileBreakpointsMap)
  const scrollDirection = useScrollDirection(true, isMobile)

  // Même piège d'hydratation que `Navigation.tsx` (voir le commentaire sur
  // `shouldReduceMotion` dans ce fichier) : `useReducedMotion()` résout
  // `window.matchMedia(...)` de façon synchrone dès le premier appel client,
  // avant même que React n'ait fini de comparer ce rendu à celui du SSR. Ne
  // piloter `motion.div` qu'avec une valeur locale qui vaut `false` au
  // premier rendu client (identique au SSR), mise à jour seulement après
  // montage via un effet — évite tout `style` divergent pendant l'hydratation.
  const prefersReducedMotion = useReducedMotion()
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  useEffect(() => {
    setShouldReduceMotion(Boolean(prefersReducedMotion))
  }, [prefersReducedMotion])

  useEffect(() => {
    if (scrollDirection === ScrollDirection.Down && isMobile) {
      controls.start('hidden')
    } else {
      controls.start('show')
    }
  }, [isMobile, controls, scrollDirection])
  return (
    <motion.div
      initial={isMobile ? 'hidden' : false}
      variants={
        shouldReduceMotion ? mobileMenuVariantsReduced : mobileMenuVariants
      }
      animate={controls}
      className={isMobile ? styles.mobileMenuContainer : ''}
    >
      <Container
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding={{ base: 5, lg: 0 }}
        paddingY={{ base: 5, lg: 0 }}
        backgroundColor={isMobile ? 'bg.canvas' : 'transparent'}
        width="100vw"
        maxWidth="100vw"
        margin={0}
      >
        <Navigation />
      </Container>
    </motion.div>
  )
}

export default Menu
