import { memo, useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import {
  Text,
  List,
  ListItem,
  ListIcon,
  Icon,
  SimpleGrid,
  Box,
  Tooltip,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
  MotionValue,
} from 'framer-motion'
import { GiCoffeePot } from 'react-icons/gi'
import { IoMdOpen } from 'react-icons/io'
import RevealBlock, { RevealMode } from './RevealBlock'
import SkillsOrbitTeaser from './SkillsOrbitTeaser'
import { Skills } from 'config/skills'
import { hoverLift, hoverLiftReduced } from 'config/animations'

type IDetail = {
  onOpen(): void
}

const MotionText = motion(Text)

// Seuils de progression (0-1) à l'intérieur de la plage verrouillée (US-015)
// où chaque bloc se balaie de gauche à droite (clip-path inset qui se
// referme sur le bord droit). Espacés pour que les 3 révélations restent
// séquentielles plutôt que simultanées.
const HEADING_RANGE: [number, number] = [0, 0.3]
const PARAGRAPH_RANGE: [number, number] = [0.35, 0.65]
const GRID_RANGE: [number, number] = [0.7, 1]

const useSweepClipPath = (
  progress: MotionValue<number>,
  range: [number, number]
) => {
  const rightInset = useTransform(progress, range, [100, 0])
  return useMotionTemplate`inset(0% ${rightInset}% 0% 0%)`
}

const Detail = ({ onOpen }: IDetail) => {
  const prefersReducedMotionRaw = useReducedMotion()
  // Pattern "mounted && reduced" (cf. BootLog.tsx/US-013) : ce choix pilote
  // désormais une STRUCTURE (sticky + hauteur verrouillée vs flux normal),
  // pas seulement un style — un mismatch SSR/client ici serait bien plus
  // grave qu'un simple résidu de transform. Le tout premier rendu client
  // doit rester identique au SSR (toujours "non réduit").
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  const prefersReducedMotion = mounted && Boolean(prefersReducedMotionRaw)

  // Même convention que Sidebar/Avatar (US-013) : `false` au SSR et au
  // premier rendu client (base), se résout après montage.
  const isDesktop = useBreakpointValue({ base: false, xl: true })
  const isScrubLocked = Boolean(isDesktop) && !prefersReducedMotion
  const showOrbitTeaser = isScrubLocked

  const revealMode: RevealMode = (() => {
    if (isScrubLocked) {
      return 'scrub'
    }
    return prefersReducedMotion ? 'fade' : 'sweep'
  })()

  const currentYear = new Date().getFullYear()
  const professionalYears = currentYear - 2019

  const scrollTargetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ['start start', 'end end'],
  })

  // Piège trouvé en vérification : la toute première mesure interne de
  // `useScroll` peut rester figée sur la hauteur "auto" (pré-verrouillage)
  // si le conteneur passe à 250vh après ce premier calcul — la jauge reste
  // juste au repos avec une légère révélation prématurée jusqu'au premier
  // vrai scroll (qui force Framer Motion à remesurer). Un `resize` forcé au
  // moment précis où le verrouillage s'active déclenche cette remesure
  // immédiatement, sans attendre un scroll réel de l'utilisateur.
  useEffect(() => {
    if (isScrubLocked) {
      window.dispatchEvent(new Event('resize'))
    }
  }, [isScrubLocked])

  const headingClip = useSweepClipPath(scrollYProgress, HEADING_RANGE)
  const paragraphClip = useSweepClipPath(scrollYProgress, PARAGRAPH_RANGE)
  const gridClip = useSweepClipPath(scrollYProgress, GRID_RANGE)

  const hoverLiftTarget = (prefersReducedMotion ? hoverLiftReduced : hoverLift)
    .hover

  // Teaser orbital (US-015) : position du curseur relative au conteneur du
  // CTA, mise à jour tant que le survol dure. N'est lu que si
  // `showOrbitTeaser && isCtaHovered` (desktop, hors reduced-motion).
  const ctaWrapperRef = useRef<HTMLDivElement>(null)
  const [isCtaHovered, setIsCtaHovered] = useState(false)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  const updatePointerFromEvent = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = ctaWrapperRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }
    pointerX.set(event.clientX - rect.left)
    pointerY.set(event.clientY - rect.top)
  }

  return (
    <Box
      ref={scrollTargetRef}
      width="100%"
      position="relative"
      height={isScrubLocked ? '250vh' : 'auto'}
    >
      <Box
        position={isScrubLocked ? 'sticky' : 'static'}
        top={0}
        minH={isScrubLocked ? '100vh' : 'auto'}
        display="flex"
        alignItems="center"
      >
        <Stack
          as="section"
          width={{ base: '100%', lg: '70%' }}
          spacing={{ base: 6, xl: 8 }}
        >
          <RevealBlock mode={revealMode} clipPath={headingClip}>
            <Text as="h4" textStyle="title">
              Ce que je fais.
            </Text>
          </RevealBlock>

          <RevealBlock mode={revealMode} clipPath={paragraphClip}>
            <Text variant="description" textStyle="body">
              Cela fait maintenant {professionalYears} ans que je code{' '}
              professionnellement, avec une spécialisation en <b>Frontend</b>{' '}
              notamment en React et Next.js. J&apos;interviens principalement
              sur{' '}
              <b>la conception d&apos;interfaces modernes et performantes</b>,
              l&apos;{' '}
              <b>
                l&apos;architecture front-end, l&apos;ntégration d&apos;APIs
              </b>
              , et{' '}
              <Text as="span" variant="emphasis">
                la <b>gestion de logiques métier côté client</b>
              </Text>
              <br /> <br />
              Voici quelques technologies qui font partie de mon quotidien, mon
              petit{' '}
              <Tooltip
                label="Le thé ? Uniquement en cas d’urgence. 😄"
                aria-label="I hate Tea!"
                hasArrow
              >
                <Text
                  as="span"
                  variant="emphasis"
                  textDecorationLine="line-through"
                >
                  thé
                </Text>
              </Tooltip>{' '}
              café <Icon as={GiCoffeePot} color="accent.default" />.
            </Text>
          </RevealBlock>

          <RevealBlock mode={revealMode} clipPath={gridClip}>
            <SimpleGrid columns={2} spacing={4}>
              <List spacing={3}>
                {Skills.frontend.map((skill) => (
                  <ListItem
                    key={skill.name}
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                  >
                    <ListIcon
                      as={skill.icon}
                      color="accent.default"
                      fontSize="2em"
                    />
                    {skill.name}
                  </ListItem>
                ))}
              </List>
              <List spacing={3}>
                {Skills.backend.map((skill) => (
                  <ListItem
                    key={skill.name}
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                  >
                    <ListIcon
                      as={skill.icon}
                      color="accent.default"
                      fontSize="2em"
                    />
                    {skill.name}
                  </ListItem>
                ))}
              </List>
              <Box
                ref={ctaWrapperRef}
                position="relative"
                onMouseEnter={(event) => {
                  setIsCtaHovered(true)
                  updatePointerFromEvent(event)
                }}
                onMouseMove={updatePointerFromEvent}
                onMouseLeave={() => setIsCtaHovered(false)}
              >
                {showOrbitTeaser && isCtaHovered && (
                  <SkillsOrbitTeaser pointerX={pointerX} pointerY={pointerY} />
                )}
                <MotionText
                  as="button"
                  type="button"
                  variant="emphasis"
                  textStyle="label"
                  textAlign="left"
                  borderBottom="1px solid transparent"
                  onClick={onOpen}
                  whileHover={hoverLiftTarget}
                  _hover={{ borderBottomColor: 'accent.default' }}
                  sx={{ transition: 'border-color 0.3s ease' }}
                >
                  Mon attirail de développeur <Icon as={IoMdOpen} />
                </MotionText>
              </Box>
            </SimpleGrid>
          </RevealBlock>
        </Stack>
      </Box>
    </Box>
  )
}

export default memo(Detail)
