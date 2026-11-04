import {
  Stack,
  Text,
  Button,
  useColorMode,
  Container,
  Link,
  Box,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import styles from './styles.module.css'
import {
  heroBoot,
  heroBootReduced,
  hoverLift,
  hoverLiftReduced,
  scaleUp,
} from 'config/animations'
import { SocialMedias } from 'config/sidebar'

const Sidebar = () => {
  const { colorMode } = useColorMode()
  const shouldReduceMotion = useReducedMotion()
  const display = useBreakpointValue({ base: 'none', lg: 'block' })

  const MotionText = motion(Text)
  const MotionStack = motion(Stack)
  const MotionButton = motion(Button)
  const MotionBox = motion(Box)
  const MotionLink = motion(Link)

  // heroBoot : animation d'entrée signature du Hero (US-002). En cascade sur
  // chaque ligne via `staggerChildren`, désactivée si prefers-reduced-motion.
  const itemVariants: Variants = shouldReduceMotion ? heroBootReduced : heroBoot
  const parentVariants: Variants = {
    animate: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } },
  }
  const hoverLiftTarget = (shouldReduceMotion ? hoverLiftReduced : hoverLift)
    .hover

  return (
    <MotionBox
      initial="initial"
      animate="animate"
      position={{ xl: 'fixed' }}
      maxWidth={{ xl: '34%' }}
      top={{ lg: 0 }}
    >
      <motion.div
        id="sidebarCircle"
        className={`${styles.sidebar} ${
          colorMode === 'light' ? styles.dark : ''
        }`}
        variants={scaleUp}
        style={{ display: display }}
        animate={colorMode === 'dark' ? 'animate' : 'lightMode'}
      ></motion.div>
      <Container
        padding={0}
        margin={0}
        height={{ xl: '100vh' }}
        display={{ xl: 'flex' }}
        alignItems={{ xl: 'center' }}
      >
        <MotionStack variants={parentVariants} spacing={6} w="100">
          <MotionText
            variants={itemVariants}
            variant="accent"
            fontWeight="light"
            fontSize="sm"
          >
            Hey, bienvenu sur mon petit coin du Web! Moi c’est
          </MotionText>
          <MotionText
            as="h3"
            textStyle="title"
            paddingRight={{ lg: '20' }}
            textTransform="uppercase"
            variants={itemVariants}
          >
            Solofomahery D.
          </MotionText>
          <MotionText
            as="h4"
            lang="fr"
            textStyle="hero"
            variant="emphasis"
            className={styles.marginTopForce}
            textTransform="uppercase"
            overflowWrap="break-word"
            sx={{ hyphens: 'auto', WebkitHyphens: 'auto', msHyphens: 'auto' }}
            variants={itemVariants}
          >
            RAKOTONINDRINA
          </MotionText>
          <MotionText
            variant="accentAlternative"
            fontSize="sm"
            className={styles.marginTopForce}
            variants={itemVariants}
          >
            ou vous pouvez m’appeler Mahery, ça marche aussi 😉
          </MotionText>

          <MotionText
            as="h3"
            textStyle="label"
            color="accent.default"
            className={styles.marginTopSmall}
            variants={itemVariants}
          >
            Développeur Frontend
          </MotionText>

          <MotionText
            variant="description"
            textStyle="body"
            paddingRight={{ lg: '12' }}
            variants={itemVariants}
            maxWidth={{ base: '100%', lg: '80%' }}
          >
            Oh, quelle bonne surprise de vous voir ici,
            <Text variant="emphasis" as="span">
              {' '}
              Merci beaucoup !
            </Text>
            <br />
            Je suis un développeur web passionné depuis l’enfance.
            <br /> <br />
            Ce que j’aime ? Transformer des idées complexes en solutions simples
            et efficaces, du back-end solide aux interfaces intuitives.
            <br />
          </MotionText>
          <MotionButton
            size="lg"
            variant="outline"
            borderWidth="1px"
            borderRadius="0"
            fontWeight="normal"
            fontSize="sm"
            width="160px"
            variants={itemVariants}
            whileHover={hoverLiftTarget}
            as={'a'}
            href="mailto:maeryrakotonidrina17@gmail.com"
            target="_blank"
          >
            Entrons en contact!
          </MotionButton>

          <MotionBox display="flex" gap={4} variants={itemVariants}>
            {SocialMedias.map((socMedia) => (
              <MotionLink
                variant="description"
                key={socMedia.label}
                aria-label={socMedia.label}
                rel="noreferrer"
                width={8}
                href={socMedia.href}
                target="_blank"
                _focus={{ boxShadow: 'none' }}
                whileHover={hoverLiftTarget}
              >
                <Icon w={6} h={6} as={socMedia.icon} color="currentColor" />
              </MotionLink>
            ))}
          </MotionBox>
        </MotionStack>
      </Container>
    </MotionBox>
  )
}

export default Sidebar
