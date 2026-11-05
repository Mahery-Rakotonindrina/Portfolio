import { useEffect, useState } from 'react'
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion'
import HUDMarker, { Scene } from './HUDMarker'
import { mobileBreakpointsMap } from 'config/theme'

// Ancres réelles déjà en place (components/Menu/Navigation.tsx, pages/index.tsx)
// — aucune nouvelle ancre créée ici. La scène "Hero" réutilise `#mainGrid`
// (id déjà posé sur le conteneur racine, pages/index.tsx) pour bénéficier du
// même défilement animé par Lenis (`anchors: true`, US-012) que les 4 autres
// repères, plutôt que le saut instantané d'un `href="#"` brut (Lenis
// n'intercepte pas un hash vide — cf. le cas desktop "A propos" existant).
const SCENES: Scene[] = [
  { href: '#mainGrid', anchorId: null, number: '01', label: 'Accueil' },
  { href: '#aboutMe', anchorId: 'aboutMe', number: '02', label: 'À propos' },
  { href: '#jobs', anchorId: 'jobs', number: '03', label: 'Expériences' },
  { href: '#works', anchorId: 'works', number: '04', label: 'Réalisations' },
  { href: '#contact', anchorId: 'contact', number: '05', label: 'Contact' },
]

// Ligne d'activation : à mi-hauteur du viewport. Une scène devient "active"
// dès que le haut de son ancre a franchi cette ligne en remontant.
const ACTIVATION_RATIO = 0.5

const CORNER_POSITIONS = [
  {
    id: 'top-left',
    top: 0,
    left: 0,
    borderTopWidth: '1px',
    borderLeftWidth: '1px',
  },
  {
    id: 'top-right',
    top: 0,
    right: 0,
    borderTopWidth: '1px',
    borderRightWidth: '1px',
  },
  {
    id: 'bottom-left',
    bottom: 0,
    left: 0,
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
  },
  {
    id: 'bottom-right',
    bottom: 0,
    right: 0,
    borderBottomWidth: '1px',
    borderRightWidth: '1px',
  },
]

/**
 * US-014 — Fil conducteur HUD : cadre + jauge de progression à travers les 5
 * scènes du site, complémentaire à `components/Menu` (jamais un remplacement).
 */
const ProgressHUD = (): JSX.Element => {
  const isMobile = useBreakpointValue(mobileBreakpointsMap)

  // Même pattern que Menu/Navigation/BootLog (US-008/US-013) : ne piloter les
  // variantes qu'avec une valeur locale qui vaut `false` au premier rendu
  // client (identique au SSR), mise à jour après montage via un effet.
  const prefersReducedMotion = useReducedMotion()
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  useEffect(() => {
    setShouldReduceMotion(Boolean(prefersReducedMotion))
  }, [prefersReducedMotion])

  const { scrollY, scrollYProgress } = useScroll()
  const smoothedProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.3,
  })
  // Reduced motion : saut instantané à la valeur courante, pas de lissage par
  // ressort (critère d'acceptation US-014).
  const fillProgress = shouldReduceMotion ? scrollYProgress : smoothedProgress

  const [activeIndex, setActiveIndex] = useState(0)

  // Les offsets des ancres sont recalculés à chaque évènement de scroll
  // plutôt que mis en cache une seule fois au montage : `GetInTouch`
  // (ancre `#contact`) est chargé via `next/dynamic` (pages/index.tsx) et son
  // noeud DOM n'existe pas encore au moment où `ProgressHUD` monte — un cache
  // figé au montage aurait rendu la scène Contact impossible à activer. Le
  // coût (4 lectures `getBoundingClientRect` par évènement) reste négligeable
  // et s'adapte aussi nativement à un redimensionnement, sans listener dédié.
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (typeof window === 'undefined') {
      return
    }
    const activationLine = latest + window.innerHeight * ACTIVATION_RATIO
    let index = 0
    for (let i = 1; i < SCENES.length; i += 1) {
      const { anchorId } = SCENES[i]
      if (!anchorId) {
        continue
      }
      const el = document.getElementById(anchorId)
      if (!el) {
        continue
      }
      const top = el.getBoundingClientRect().top + latest
      if (top <= activationLine) {
        index = i
      }
    }
    setActiveIndex(index)
  })

  if (isMobile) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        height="3px"
        bg="border.subtle"
        zIndex={60}
        pointerEvents="none"
        aria-hidden="true"
      >
        <motion.div
          style={{
            height: '100%',
            width: '100%',
            transformOrigin: 'left',
            scaleX: fillProgress,
            backgroundColor: 'var(--chakra-colors-accent-default)',
          }}
        />
      </Box>
    )
  }

  return (
    <>
      <Box
        position="fixed"
        inset="16px"
        border="1px solid"
        borderColor="border.subtle"
        pointerEvents="none"
        zIndex={2}
        aria-hidden="true"
      >
        {CORNER_POSITIONS.map(({ id, ...corner }) => (
          <Box
            key={id}
            position="absolute"
            width="20px"
            height="20px"
            borderColor="accent.default"
            opacity={0.4}
            {...corner}
          />
        ))}
      </Box>
      <Flex
        position="fixed"
        top="140px"
        bottom="140px"
        right="16px"
        width="72px"
        direction="column"
        justify="space-between"
        align="flex-end"
        zIndex={3}
      >
        <Box
          position="absolute"
          top={0}
          bottom={0}
          right={0}
          width="2px"
          bg="border.subtle"
        />
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '2px',
            height: '100%',
            transformOrigin: 'top',
            scaleY: fillProgress,
            backgroundColor: 'var(--chakra-colors-accent-default)',
          }}
        />
        {SCENES.map((scene, index) => (
          <HUDMarker
            key={scene.href}
            scene={scene}
            isActive={index === activeIndex}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </Flex>
    </>
  )
}

export default ProgressHUD
