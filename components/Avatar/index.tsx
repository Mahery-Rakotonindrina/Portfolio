import { useColorModeValue, chakra, useBreakpointValue } from '@chakra-ui/react'
import Image from 'next/image'
import {
  motion,
  AnimatePresence,
  isValidMotionProp,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { useEffect } from 'react'
import { avatarAnimation } from 'config/animations'
import usePointerParallax from 'hooks/usePointerParallax'

const AvatarImages = {
  DarkMode: '/Profil_MaheryRakotonindrina.png',
  LightMode: '/Profil_MaheryRakotonindrina.png',
}

declare global {
  interface Window {
    preloadedPictures?: HTMLImageElement[]
  }
}

// ✅ Correction ici
const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || typeof prop === 'string',
})

// Amplitude de parallaxe de l'avatar (px), volontairement différente de la
// grille de la Sidebar (components/Sidebar/PerspectiveGrid.tsx, ~12px) pour
// donner une impression de profondeur à 2 couches (US-013 /
// DESIGN_PROPOSAL_V2 §2). Flottement idle + parallaxe réservés au desktop
// (même limite `xl` que le panneau Sidebar fixed) et désactivés sous
// `prefers-reduced-motion`.
const AVATAR_PARALLAX_AMPLITUDE = 6
const IDLE_FLOAT_ANIMATE = { y: [0, -4, 0, 4, 0] }
const IDLE_FLOAT_TRANSITION = {
  duration: 4,
  repeat: Infinity,
  ease: 'easeInOut' as const,
}

const Avatar = () => {
  const imgAvatar = useColorModeValue(
    AvatarImages.LightMode,
    AvatarImages.DarkMode
  )
  const shouldReduceMotion = useReducedMotion()
  const isDesktop = useBreakpointValue({ base: false, xl: true })
  const ambientEnabled = Boolean(isDesktop) && !shouldReduceMotion

  const { x, y } = usePointerParallax(ambientEnabled)
  const parallaxX = useTransform(
    x,
    [-0.5, 0.5],
    [AVATAR_PARALLAX_AMPLITUDE, -AVATAR_PARALLAX_AMPLITUDE]
  )
  const parallaxY = useTransform(
    y,
    [-0.5, 0.5],
    [AVATAR_PARALLAX_AMPLITUDE, -AVATAR_PARALLAX_AMPLITUDE]
  )

  useEffect(() => {
    const images = [AvatarImages.DarkMode, AvatarImages.LightMode]
    const preloadedImages: HTMLImageElement[] = images.map((imageSrc) => {
      const img = new window.Image()
      img.src = imageSrc
      return img
    })
    window.preloadedPictures = preloadedImages
  }, [])

  return (
    <AnimatePresence>
      <MotionBox
        id="klAvatar"
        boxSize={{ base: 64, lg: 'sm' }}
        padding={{ base: 8 }}
        marginBottom={{ base: 10, md: 0, lg: 0 }}
        // Bugfix post US-015 (PO) : au verrouillage scrubbed du texte voisin
        // (Detail.tsx, sticky uniquement à `xl`), la colonne About passe à
        // ~250vh — sans son propre `position: sticky`, l'Avatar (hauteur
        // normale, pas verrouillé) sortait entièrement de l'écran par le
        // haut après ~20% du scroll verrouillé, alors que le texte continue
        // de se révéler. Limité à `xl` (seul breakpoint où le verrouillage
        // existe) — mobile/tablette gardent un comportement inchangé (pas de
        // hauteur verrouillée, rien à corriger).
        //
        // Bugfix post US-015-fix (PO) : `top={0}` collait littéralement
        // l'Avatar derrière le Menu/nav desktop fixe (`position:fixed;top:0`,
        // components/Menu/styles.module.css), qui se superposait visuellement
        // aux 4 liens de navigation. Mesuré par `getBoundingClientRect()` réel
        // (pas une valeur inventée) : une fois le scroll passé sous l'Avatar,
        // `useScrollDirection` bascule la nav dans son état "pill" permanent
        // (hooks/useScrollDirection.tsx — `isBelowAvatar && !isMobile` force
        // `ScrollDirection.Down` quel que soit le sens réel du scroll), qui
        // empile les 4 liens verticalement avec un padding de 40px : hauteur
        // mesurée = 264px, stable à 1280px comme à 1440px de large (ne
        // dépend pas de la largeur, seulement de l'empilement du contenu).
        // Pas le même offset que `ProgressHUD.tsx` (140px) : ce 140px est
        // calé sur un tout autre élément (jauge HUD étroite collée au bord
        // droit) et ne correspond pas à la hauteur réelle de la nav dans son
        // état "pill" — le réutiliser tel quel laisserait encore 124px de
        // chevauchement. `top: 288px` (264px de hauteur nav mesurée + 24px
        // d'espacement propre, échelle Chakra `space.6`) dégage l'Avatar de
        // la nav avec une marge de sécurité raisonnable.
        position={{ base: 'static', xl: 'sticky' }}
        top={{ xl: '288px' }}
        // Bugfix (PO, capture à l'appui) : sans zIndex explicite, l'ordre de
        // peinture dépendait juste de la position dans le DOM — ScrollMore
        // (monté après la grille principale, pages/index.tsx) passait par-
        // dessus cette photo sticky dès que son widget email vertical
        // apparaissait au même endroit à l'écran. zIndex=1 ici (ScrollMore
        // passe lui-même à 1, cf. ce fichier) suffit à inverser l'ordre sans
        // dépasser ProgressHUD (2-3) ni le Menu (100).
        zIndex={2}
        initial="initial"
        animate="animate"
        variants={avatarAnimation}
        exit={{ opacity: 0 }}
      >
        <motion.div style={{ x: parallaxX, y: parallaxY }}>
          <motion.div
            animate={ambientEnabled ? IDLE_FLOAT_ANIMATE : { y: 0 }}
            transition={ambientEnabled ? IDLE_FLOAT_TRANSITION : undefined}
          >
            <Image
              src={imgAvatar}
              alt="Mahery Rakotonindrina"
              width={250}
              height={250}
              quality={90}
              priority
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                background: 'transparent',
                margin: 'auto',
              }}
            />
          </motion.div>
        </motion.div>
      </MotionBox>
    </AnimatePresence>
  )
}

export default Avatar
