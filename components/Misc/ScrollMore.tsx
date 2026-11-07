import { Box, Icon, useBreakpointValue } from '@chakra-ui/react'
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

// Retiré (PO) : ce composant portait aussi un lien email vertical
// (`writing-mode: vertical-rl`) qui apparaissait en bas à droite au scroll
// vers le bas — exactement la zone où l'Avatar sticky peut se trouver,
// d'où le texte qui s'imprimait littéralement par-dessus la photo (bug
// remonté par le PO, capture à l'appui). Doublon par ailleurs : l'email est
// déjà accessible via le CTA de la Sidebar et la section Contact (avec son
// propre effet de scramble + copie), donc retiré plutôt que repositionné —
// une 3e voie d'accès, moins soignée (couleurs `teal`/`cyan` hors des
// tokens sémantiques du thème) et bogguée, n'apportait rien. Le repère
// "scroll" (souris qui rebondit) reste, lui n'a jamais posé ce problème.
const ScrollMore = () => {
  const isMobile = useBreakpointValue(mobileBreakpointsMap)
  const scrollDirection = useScrollDirection(false, isMobile)

  return (
    <Box
      position="fixed"
      bottom="1em"
      right="3%"
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
    </Box>
  )
}

export default ScrollMore
