import {
  Image as ChkImage,
  SkeletonCircle,
  useColorModeValue,
  chakra,
} from '@chakra-ui/react'
import { motion, AnimatePresence, isValidMotionProp } from 'framer-motion'
import { useEffect } from 'react'
import { avatarAnimation } from 'config/animations'

const AvatarImages = {
  DarkMode: '/profil.png',
  LightMode: './profil.png',
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

const Avatar = () => {
  const imgAvatar = useColorModeValue(
    AvatarImages.LightMode,
    AvatarImages.DarkMode
  )

  useEffect(() => {
    const images = [AvatarImages.DarkMode, AvatarImages.LightMode]
    const preloadedImages = images.map((imageSrc) => {
      const img = new Image()
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
        <ChkImage
          src={imgAvatar}
          alt="Mahery Avatar"
          htmlWidth="250"
          htmlHeight="250"
          margin="auto"
          boxSize="250px" // largeur + hauteur égales
          borderRadius="full" // rend l'image ronde
          objectFit="cover" // optionnel : évite la déformation
          background="transparent"
          fallback={<SkeletonCircle height="100%" width="100%" />}
        />
      </MotionBox>
    </AnimatePresence>
  )
}

export default Avatar
