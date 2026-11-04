import { memo } from 'react'
import {
  AspectRatio,
  Icon,
  Image,
  Link,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import { BiLinkExternal } from 'react-icons/bi'
import { Work } from 'config/works'
import {
  scrollReveal,
  scrollRevealReduced,
  hoverLift,
  hoverLiftReduced,
} from 'config/animations'

export type FeaturedCardProps = {
  work: Work
  idx: number
}

const IMAGE_EXTENSION_PATTERN = /\.(jpe?g|png|gif|webp|svg|avif)(\?.*)?$/i

// Un lien "voir le projet" ne doit s'afficher que si `ctaUrl` est une vraie
// URL externe (http/https), distincte de l'image de couverture et ne pointant
// pas elle-même vers un fichier image — corrige le bug (US-001/audit) où
// Becquet! et GESCOM affichaient un lien vers leur propre capture d'écran
// plutôt qu'un vrai site, et empêche un chemin local mal orthographié (ex.
// GIPROD Androy, "/giprod.jp") d'être pris pour un lien valide.
const isExternalProjectLink = (
  ctaUrl: string | undefined,
  src: string
): boolean => {
  if (!ctaUrl || ctaUrl === src) {
    return false
  }

  let parsed: URL
  try {
    parsed = new URL(ctaUrl)
  } catch {
    // chemin relatif/local : pas une URL externe
    return false
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return false
  }

  return !IMAGE_EXTENSION_PATTERN.test(parsed.pathname)
}

const MotionStack = motion(Stack)

// Carte de la galerie "best-of" : révélation individuelle au scroll
// (scrollReveal, même mécanique que chaque entrée de la timeline Experience,
// US-005) et effet de profondeur au survol — légère élévation (hoverLift,
// déjà utilisée ailleurs sur les cartes interactives) combinée à une ombre
// qui se creuse et une bordure qui s'accentue, pour un signal de profondeur
// sobre plutôt qu'un effet tape-à-l'œil (zoom/parallaxe marqué).
const FeaturedCard = ({ work, idx }: FeaturedCardProps) => {
  const { title, description, src, ctaUrl, objectPosition } = work
  const shouldReduceMotion = useReducedMotion()

  const itemVariants: Variants = shouldReduceMotion
    ? scrollRevealReduced
    : scrollReveal
  const hoverLiftTarget = (shouldReduceMotion ? hoverLiftReduced : hoverLift)
    .hover

  const showProjectLink = isExternalProjectLink(ctaUrl, src)

  return (
    <MotionStack
      as="article"
      spacing={0}
      bg="bg.surface"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius={0}
      overflow="hidden"
      height="100%"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={itemVariants}
      whileHover={hoverLiftTarget}
      _hover={{ boxShadow: 'lg', borderColor: 'accent.default' }}
      sx={{ transition: 'box-shadow 0.3s ease, border-color 0.3s ease' }}
    >
      <AspectRatio ratio={16 / 10}>
        <Image
          src={src}
          alt={title}
          objectFit="cover"
          objectPosition={objectPosition}
          loading="lazy"
          fallback={<Skeleton height="100%" width="100%" />}
        />
      </AspectRatio>

      <Stack spacing={3} p={{ base: 4, md: 6 }} flex="1">
        <Text as="h3" textStyle="subtitle">
          <Text as="span" variant="accentAlternative" textStyle="label">
            #0{idx}{' '}
          </Text>
          {title}
        </Text>
        <Text variant="description" fontSize="sm">
          {description}
        </Text>
        {showProjectLink && (
          <Link
            href={ctaUrl}
            target="_blank"
            rel="noreferrer"
            fontSize="sm"
            display="inline-flex"
            alignItems="center"
            gap={1}
            alignSelf="flex-start"
            marginTop="auto"
          >
            Voir le projet
            <Icon as={BiLinkExternal} />
          </Link>
        )}
      </Stack>
    </MotionStack>
  )
}

export default memo(FeaturedCard)
