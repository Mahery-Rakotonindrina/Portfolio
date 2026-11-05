import { memo, useRef } from 'react'
import {
  Text,
  Stack,
  Flex,
  Box,
  HStack,
  Image,
  List,
  ListIcon,
  ListItem,
  Skeleton,
  useColorMode,
} from '@chakra-ui/react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { BiRightArrow } from 'react-icons/bi'
import { CompanyDetail } from 'config/experience'
import {
  scrollRevealReduced,
  hoverLift,
  hoverLiftReduced,
} from 'config/animations'

// US-017 — un `motion(X)` par type d'élément, hissé au scope module (piège
// documenté : recréer la factory dans le corps du composant force un
// remount complet à chaque re-render).
const MotionDot = motion(Box)
const MotionLineFill = motion(Box)
const MotionCard = motion(Stack)

const LIT_COLOR = 'var(--chakra-colors-accent-default)'
const UNLIT_COLOR = 'var(--chakra-colors-border-subtle)'
// Seuil de progression (0-1, propre à CETTE entrée) à partir duquel le point
// est considéré "atteint" par le tracé — léger epsilon plutôt que 0 strict
// pour éviter un allumage avant même que la ligne n'ait commencé à se
// dessiner.
const LIT_THRESHOLD = 0.02
// Plage de progression sur laquelle la carte se révèle (fondu + légère
// montée), synchronisée sur le même seuil que l'allumage du point : la carte
// apparaît pendant que le tracé l'atteint, pas avant ni après.
const CARD_REVEAL_RANGE: [number, number] = [0, 0.18]

type TimelineItemProps = {
  company: CompanyDetail
  isLast: boolean
  prefersReducedMotion: boolean
}

// Chaque entrée mesure sa PROPRE progression de scroll (plutôt qu'une mesure
// DOM manuelle de la position de chaque point sur un rail commun) : 0 quand
// le haut de l'entrée franchit une ligne de référence à 65% de la hauteur du
// viewport, 1 quand son bas la franchit. Le bas de l'entrée i coïncidant
// avec le haut de l'entrée i+1, la progression de l'une se termine
// exactement quand celle de la suivante démarre — tracé visuellement
// continu sans avoir à mesurer la hauteur réelle (variable, cf. Vivetic plus
// longue que Domoti/Pushtech) de chaque carte.
const TimelineItem = ({
  company,
  isLast,
  prefersReducedMotion,
}: TimelineItemProps) => {
  const { colorMode } = useColorMode()
  const itemRef = useRef<HTMLLIElement>(null)

  const { scrollYProgress: rawProgress } = useScroll({
    target: itemRef,
    offset: ['start 0.65', 'end 0.65'],
  })

  // Toujours appelés (règles des hooks) : seul leur USAGE dépend de
  // `prefersReducedMotion`, pas leur présence.
  const dotColor = useTransform(rawProgress, (value) =>
    value > LIT_THRESHOLD ? LIT_COLOR : UNLIT_COLOR
  )
  const cardOpacity = useTransform(rawProgress, CARD_REVEAL_RANGE, [0, 1])
  const cardY = useTransform(rawProgress, CARD_REVEAL_RANGE, [32, 0])

  const hoverLiftTarget = (prefersReducedMotion ? hoverLiftReduced : hoverLift)
    .hover

  // Contenu de la carte partagé par les deux mécanismes de révélation
  // ci-dessous (évite de le dupliquer dans les deux branches JSX).
  const cardContent = (
    <>
      <HStack spacing={4} align="center">
        <Image
          src={colorMode === 'dark' ? company.logo.dark : company.logo.light}
          alt={company.longName}
          maxWidth="64px"
          maxHeight="64px"
          objectFit="contain"
          fallback={<Skeleton height="64px" width="64px" />}
        />
        <Stack spacing={0}>
          <Text as="h3" textStyle="subtitle">
            {company.longName}
          </Text>
          <Text as="span" textStyle="label" color="text.tertiary">
            {company.duration}
          </Text>
        </Stack>
      </HStack>

      <List spacing={3}>
        {company.roles?.map((roleDesc, roleIdx) => (
          <ListItem
            key={`${company.name}-desc-${roleIdx}`}
            fontSize="sm"
            display="flex"
            alignItems="flex-start"
          >
            <ListIcon
              as={BiRightArrow}
              color="accent.default"
              mt={1}
              flexShrink={0}
            />
            <Text as="span" variant="description">
              {roleDesc}
            </Text>
          </ListItem>
        ))}
      </List>
    </>
  )

  const cardStyleProps = {
    spacing: 4,
    bg: 'bg.surface',
    borderWidth: '1px',
    borderColor: 'border.subtle',
    borderRadius: 0,
    p: { base: 4, md: 6 },
    whileHover: hoverLiftTarget,
  }

  return (
    <Flex as="li" ref={itemRef} align="stretch">
      <Flex
        direction="column"
        align="center"
        flexShrink={0}
        mr={{ base: 4, md: 6 }}
      >
        <MotionDot
          w={3}
          h={3}
          borderRadius="full"
          flexShrink={0}
          mt={2}
          style={{
            backgroundColor: prefersReducedMotion ? LIT_COLOR : dotColor,
          }}
        />
        {!isLast && (
          <Box
            position="relative"
            flex="1"
            width="2px"
            bg="border.subtle"
            my={2}
            overflow="hidden"
          >
            <MotionLineFill
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              bg="accent.default"
              style={{
                scaleY: prefersReducedMotion ? 1 : rawProgress,
                originY: 0,
              }}
            />
          </Box>
        )}
      </Flex>

      <Box flex="1" pb={isLast ? 0 : { base: 8, md: 10 }}>
        {prefersReducedMotion ? (
          <MotionCard
            key="reduced"
            {...cardStyleProps}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={scrollRevealReduced}
          >
            {cardContent}
          </MotionCard>
        ) : (
          <MotionCard
            key="scrub"
            {...cardStyleProps}
            style={{ opacity: cardOpacity, y: cardY }}
          >
            {cardContent}
          </MotionCard>
        )}
      </Box>
    </Flex>
  )
}

export default memo(TimelineItem)
