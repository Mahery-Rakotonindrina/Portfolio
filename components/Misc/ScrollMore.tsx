import {
  Box,
  Icon,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import { RiMouseLine } from 'react-icons/ri'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import useScrollDirection, { ScrollDirection } from 'hooks/useScrollDirection'
import { mobileBreakpointsMap } from 'config/theme'

const scrollMoreVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  hidden: {
    opacity: [0, 1],
    transition: {
      duration: 0.5,
      delay: 1,
      ease: 'easeIn',
    },
  },
  bounce: {
    y: [0, -18, 0],
    transition: {
      duration: 1.6,
      ease: 'easeInOut',
      loop: Infinity,
    },
  },
}

const emailVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 250,
  },
  show: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: [1, 0],
    y: [0, 250],
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

// Bugfix (PO, capture à l'appui) : ce widget passait PAR-DESSUS la photo
// (Avatar/index.tsx, `position: sticky` dans la section À propos) quand les
// deux se trouvaient à l'écran en même temps — ni l'un ni l'autre n'avait de
// `zIndex` explicite, donc l'empilement dépendait juste de l'ordre dans le
// DOM (pages/index.tsx monte `<ScrollMore />` après la grille principale, il
// peignait donc par-dessus). Plutôt que retirer ce widget (le PO préfère le
// garder), `zIndex` explicite ici (`Avatar/index.tsx` passe à une valeur plus
// haute) : la photo passe maintenant devant, le texte vertical disparaît
// derrière elle au lieu de s'imprimer sur le visage/la cravate.
const ScrollMore = () => {
  const isMobile = useBreakpointValue(mobileBreakpointsMap)
  const scrollDirection = useScrollDirection(false, isMobile)
  const emailColor = useColorModeValue('gray.800', 'gray.400')
  const emailLine = useColorModeValue('teal.500', 'cyan.200')

  return (
    <Box
      position="fixed"
      bottom="1em"
      right="3%"
      zIndex={1}
      display={isMobile ? 'none' : 'block'}
    >
      <AnimatePresence>
        {[ScrollDirection.Initial, ScrollDirection.Up].includes(
          scrollDirection
        ) && (
          <motion.div
            initial="initial"
            animate={['hidden', 'bounce']}
            variants={scrollMoreVariants}
          >
            <Icon
              w={6}
              h={6}
              as={RiMouseLine}
              color="currentColor"
              opacity="0.75"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {scrollDirection === ScrollDirection.Down && (
          <motion.div
            initial="hidden"
            animate="show"
            exit="exit"
            variants={emailVariants}
            whileHover={{ y: -50 }}
            style={{
              writingMode: 'vertical-rl',
              position: 'fixed',
              right: '8%',
              bottom: '-8%',
            }}
          >
            <Text
              as="a"
              paddingY={3}
              fontFamily="monospace"
              href="mailto:maeryrakotonindrina17@gmail.com"
              target="_blank"
              rel="noreferrer"
              color={emailColor}
              _hover={{
                color: emailLine,
                _after: {
                  backgroundColor: emailLine,
                  opacity: 1,
                },
              }}
              position="relative"
              letterSpacing={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
              _after={{
                backgroundColor: emailLine,
                width: '2px',
                opacity: 0.5,
                content: '""',
                flex: 1,
                height: { base: '5em', xl: '8em' },
                margin: 'auto',
                marginTop: '10px',
              }}
            >
              maeryrakotonindrina17@gmail.com{' '}
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default ScrollMore
