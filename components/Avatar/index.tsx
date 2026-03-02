import {
  SkeletonCircle,
  useColorModeValue,
  chakra,
} from '@chakra-ui/react'
import Image from 'next/image'
import { motion, AnimatePresence, isValidMotionProp } from 'framer-motion'
import { useEffect } from 'react'
import { avatarAnimation } from 'config/animations'

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

const Avatar = () => {
  const imgAvatar = useColorModeValue(
    AvatarImages.LightMode,
    AvatarImages.DarkMode
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
      </MotionBox>
    </AnimatePresence>
  )
}

export default Avatar
