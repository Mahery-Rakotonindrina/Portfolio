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
