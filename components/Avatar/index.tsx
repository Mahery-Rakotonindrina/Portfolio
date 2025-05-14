import {
  Box,
  Image as ChkImage,
  Text,
  Link,
  SkeletonCircle,
  useColorModeValue,
  chakra,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { avatarAnimation } from 'config/animations'

const AvatarImages = {
  DarkMode: '/KL_avatar.png',
  LightMode: './KL_avatar_light.png',
}

declare global {
  interface Window {
    preloadedPictures?: HTMLImageElement[]
  }
}

const Avatar = () => {
  // Utilisation de `chakra` pour rendre Box compatible avec `motion`
  const MotionBox = motion(chakra(Box))
  const imgAvatar = useColorModeValue(
    AvatarImages.LightMode,
    AvatarImages.DarkMode
  )

  useEffect(() => {
    // Préchargement des images
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
          alt="KL Lawingco Avatar"
          htmlWidth="250"
          htmlHeight="250"
          margin="auto"
          fallback={<SkeletonCircle height="100%" width="100%" />}
        />
        <Text textAlign="center" fontSize="smaller" variant="description">
          Art by{' '}
          <Link
            href="https://twitter.com/kojiro_ai"
            target="_blank"
            aria-label="KojiroArt"
            rel="noreferrer"
          >
            KojiroArt
          </Link>
        </Text>
      </MotionBox>
    </AnimatePresence>
  )
}

export default Avatar
