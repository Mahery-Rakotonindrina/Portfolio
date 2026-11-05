import { memo, useEffect, useState } from 'react'
import {
  Text,
  Stack,
  Link,
  Icon,
  Box,
  useBreakpointValue,
  useColorModeValue,
  useClipboard,
} from '@chakra-ui/react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import dynamic from 'next/dynamic'
import { RiHeartPulseFill, RiGithubFill } from 'react-icons/ri'
import {
  scrollReveal,
  scrollRevealReduced,
  hoverLift,
  hoverLiftReduced,
} from 'config/animations'
import useScrambleText from 'hooks/useScrambleText'

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

// Scène de clôture 3D (US-019 / DESIGN_PROPOSAL_V2 §7) : chargée uniquement
// côté client (next/dynamic ssr:false), jamais importée statiquement — seule
// pièce 3D du site, et le composant n'est rendu plus bas que lorsque la
// section Contact entre dans le viewport ET que prefers-reduced-motion est
// désactivé. `dynamic()` lui-même ne déclenche aucun chargement : l'import()
// sous-jacent n'est exécuté que quand React rend réellement le composant.
const ContactScene = dynamic(() => import('./ContactScene'), { ssr: false })

const EMAIL_ADDRESS = 'maeryrakotonindrina17@gmail.com'

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
  const [sceneRef, sceneInView] = useInView({ triggerOnce: true })
  const shouldReduceMotion = useReducedMotion()
  const isDesktop = Boolean(useBreakpointValue({ base: false, xl: true }))
  const wireframeColor = useColorModeValue('#1456C9', '#4D9FFF')

  // Évite un mismatch d'hydratation : `shouldReduceMotion` (Framer Motion)
  // peut déjà valoir `true` dès le tout premier rendu CLIENT (résolution
  // synchrone de matchMedia, cf. BootLog.tsx/Menu — US-008/US-013), alors
  // que le SSR calcule toujours `false`. Ce flag pilote ici la présence même
  // d'un sous-arbre DOM différent (canvas WebGL vs fond plat), pas seulement
  // un style — on ne bascule donc qu'après montage client (`mounted`), même
  // pattern que BootLog.tsx/Menu.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const effectiveReducedMotion = mounted && Boolean(shouldReduceMotion)
  const shouldMountCanvas = !effectiveReducedMotion && sceneInView

  // Rappel du scramble du Hero (US-013) sur l'email, en fin de parcours
  // (DESIGN_PROPOSAL_V2 §7). `scrambleActive` ne passe jamais à `true` sous
  // prefers-reduced-motion (callback `onAnimationStart` non câblé plus bas) :
  // aucun risque d'hydratation ici, `onAnimationStart` ne rend jamais de
  // DOM/attribut, exactement le pattern déjà validé dans Sidebar/index.tsx.
  const [scrambleActive, setScrambleActive] = useState(false)
  const scrambledEmail = useScrambleText(EMAIL_ADDRESS, scrambleActive)
  const { hasCopied, onCopy } = useClipboard(EMAIL_ADDRESS)

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
      ref={sceneRef}
      width={{ base: '99%', lg: '60%', xl: '75%' }}
      height="100%"
      spacing={{ base: 6, xl: 8 }}
      as="footer"
      position="relative"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={parentVariants}
    >
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        overflow="hidden"
        pointerEvents="none"
        aria-hidden="true"
      >
        {effectiveReducedMotion && (
          <Box position="absolute" inset={0} bg="accent.subtle" />
        )}
        {shouldMountCanvas && (
          <Box position="absolute" inset={0}>
            <ContactScene color={wireframeColor} interactive={isDesktop} />
          </Box>
        )}
      </Box>

      {/* position relative + zIndex garantissent la peinture au-dessus du
          canvas (US-019) ; pointerEvents="none" laisse en revanche la souris
          "traverser" ces blocs vers le canvas en arrière-plan sur tout leur
          espace vide (sinon, en tant qu'éléments positionnés occupant toute
          la largeur, ils intercepteraient le survol même là où ils n'ont
          aucun contenu visible) — seuls les éléments réellement interactifs
          ci-dessous ré-activent explicitement pointerEvents="auto". */}
      <MotionText
        as="h2"
        textStyle="title"
        position="relative"
        zIndex={1}
        pointerEvents="none"
        variants={itemVariants}
      >
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
        position="relative"
        zIndex={1}
        pointerEvents="none"
        variants={itemVariants}
      >
        Bon, je suis plutôt introverti de nature, mais je réponds toujours avec
        plaisir — tant que ma batterie sociale le permet 😄. Que ce soit pour
        parler code, boulot, moto, sport ou même des trucs un peu geek. <br />
        Tu peux me contacter sur les réseaux ou m’envoyer un{' '}
        <Link
          href={`mailto:${EMAIL_ADDRESS}`}
          target="_blank"
          rel="noreferrer"
          textDecoration="underline"
          pointerEvents="auto"
        >
          mail{' '}
        </Link>
        quand tu veux !
      </MotionText>

      <MotionBox
        position="relative"
        zIndex={1}
        pointerEvents="none"
        textAlign="center"
        variants={itemVariants}
        onAnimationStart={
          shouldReduceMotion ? undefined : () => setScrambleActive(true)
        }
      >
        <Text
          as="span"
          textStyle="label"
          color="text.tertiary"
          display="block"
          marginBottom={2}
        >
          Écris-moi directement
        </Text>
        <Box
          as="button"
          type="button"
          onClick={onCopy}
          aria-label={`Copier l'adresse e-mail ${EMAIL_ADDRESS}`}
          pointerEvents="auto"
          background="none"
          border="none"
          padding={0}
          cursor="pointer"
          fontFamily="mono"
          fontSize={{ base: 'md', md: 'xl' }}
          color={hasCopied ? 'accent.default' : 'text.primary'}
          _hover={{ color: 'accent.default' }}
          _focusVisible={{ boxShadow: 'outline' }}
          sx={{ transition: 'color 0.2s ease' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            whileTap={{ scale: 0.97 }}
          >
            {scrambledEmail}
          </motion.span>
        </Box>
        <Text
          as="span"
          display="block"
          textStyle="label"
          color="accent.default"
          marginTop={2}
          minHeight="1em"
          opacity={hasCopied ? 1 : 0}
          sx={{ transition: 'opacity 0.2s ease' }}
          aria-live="polite"
        >
          {hasCopied ? 'Copié !' : ''}
        </Text>
      </MotionBox>

      <MotionBox
        position="relative"
        zIndex={1}
        pointerEvents="none"
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
          pointerEvents="auto"
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
