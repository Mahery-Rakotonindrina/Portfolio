import { memo } from 'react'
import {
  AspectRatio,
  Box,
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
  DURATIONS,
} from 'config/animations'

export type FeaturedCardProps = {
  work: Work
  idx: number
  // US-018 : ouvre la vue de détail en morph (ProjectDetailModal, piloté par
  // ProjectGallery). `imageLayoutId` est partagé entre la vignette ici et
  // l'image de la modal pour le FLIP Framer Motion.
  onOpenDetail: (work: Work, imageLayoutId: string) => void
}

const IMAGE_EXTENSION_PATTERN = /\.(jpe?g|png|gif|webp|svg|avif)(\?.*)?$/i

// Un lien "voir le projet" ne doit s'afficher que si `ctaUrl` est une vraie
// URL externe (http/https), distincte de l'image de couverture et ne pointant
// pas elle-même vers un fichier image — corrige le bug (US-001/audit) où
// Becquet! et GESCOM affichaient un lien vers leur propre capture d'écran
// plutôt qu'un vrai site, et empêche un chemin local mal orthographié (ex.
// GIPROD Androy, "/giprod.jp") d'être pris pour un lien valide.
// Exportée (US-018) : ProjectGallery/ProjectDetailModal réutilisent la même
// logique à l'identique pour décider d'afficher le lien dans la vue de détail
// en morph — aucune divergence possible entre la carte et le détail.
export const isExternalProjectLink = (
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
const MotionImage = motion(Image)

// Carte de la galerie "best-of" : révélation individuelle au scroll
// (scrollReveal, même mécanique que chaque entrée de la timeline Experience,
// US-005) et effet de profondeur au survol — légère élévation (hoverLift,
// déjà utilisée ailleurs sur les cartes interactives) combinée à une ombre
// qui se creuse et une bordure qui s'accentue, pour un signal de profondeur
// sobre plutôt qu'un effet tape-à-l'œil (zoom/parallaxe marqué).
// US-018 : `role="group"` sur la carte pilote (via `_groupHover`, pur CSS —
// aucun conflit avec le `layoutId`/`whileHover` Framer posés sur l'image, cf.
// `_hover`+`whileHover` déjà combinés sans problème sur ce même composant
// depuis US-006) le zoom de l'image + l'overlay (index/titre décoratifs,
// lien réel conditionnel) au survol desktop. Le bouton transparent plein
// cadre ouvre la vue de détail en morph (`onOpenDetail`, voir ProjectGallery/
// ProjectDetailModal) ; le lien externe réel reste un `<a>` distinct, placé
// après le bouton dans le DOM pour intercepter le clic sur sa propre petite
// zone sans naviguer vers le détail.
const FeaturedCard = ({ work, idx, onOpenDetail }: FeaturedCardProps) => {
  const { title, description, src, ctaUrl, objectPosition } = work
  const shouldReduceMotion = useReducedMotion()

  const itemVariants: Variants = shouldReduceMotion
    ? scrollRevealReduced
    : scrollReveal
  const hoverLiftTarget = (shouldReduceMotion ? hoverLiftReduced : hoverLift)
    .hover

  const showProjectLink = isExternalProjectLink(ctaUrl, src)
  const imageLayoutId = `project-image-${idx}`

  return (
    <MotionStack
      as="article"
      role="group"
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
      // US-020 : consommé par CustomCursor (closest('[data-cursor-label]'))
      // pour afficher le label "VOIR" au survol — uniquement posé si cette
      // carte a un vrai lien externe (showProjectLink, cf. isExternalProjectLink
      // ci-dessus), jamais sur les 3 cartes sans lien réel.
      data-cursor-label={showProjectLink ? 'voir' : undefined}
    >
      <Box position="relative" overflow="hidden">
        <AspectRatio ratio={16 / 10}>
          <MotionImage
            src={src}
            alt={title}
            objectFit="cover"
            objectPosition={objectPosition}
            // Bugfix (remonté par le PO, "parfois ça ne s'affiche pas") : ces 4
            // images sont peu nombreuses et connues à l'avance, et la section
            // entière dépend de leur largeur réelle (ProjectGallery.tsx calcule
            // la distance de scrub GSAP sur `track.scrollWidth`) — `lazy`
            // n'apporte ici aucun bénéfice réel (l'utilisateur traverse
            // forcément les 4 cartes via le pin+scrub) mais retarde
            // inutilement leur chargement. Le filet de sécurité qui corrige
            // toute désynchronisation résiduelle (quelle qu'en soit la cause :
            // ces images, l'avatar de la Sidebar, une police qui swap...) est
            // le `ResizeObserver` posé sur `wrapper`/`track` dans
            // ProjectGallery.tsx.
            loading="eager"
            fallback={<Skeleton height="100%" width="100%" />}
            // Partagé avec l'image de ProjectDetailModal : Framer Motion
            // anime le FLIP entre les deux au clic. Désactivé sous
            // prefers-reduced-motion (simple fondu dans la modal à la place).
            layoutId={shouldReduceMotion ? undefined : imageLayoutId}
            _groupHover={{ transform: 'scale(1.06)' }}
            sx={{ transition: `transform ${DURATIONS.VeryFast}s ease` }}
          />
        </AspectRatio>

        {/* Overlay de survol (desktop) : index + titre dupliqués à des fins
            purement décoratives (le vrai texte existe déjà ci-dessous, donc
            `aria-hidden` pour ne pas le faire annoncer deux fois) + lien
            réel conditionnel. */}
        <Box
          position="absolute"
          inset={0}
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          p={4}
          opacity={0}
          pointerEvents="none"
          aria-hidden="true"
          _groupHover={{ opacity: 1 }}
          sx={{
            transition: `opacity ${DURATIONS.VeryFast}s ease`,
            background:
              'linear-gradient(to top, rgba(11,13,18,0.85), rgba(11,13,18,0) 65%)',
          }}
        >
          <Text as="span" textStyle="label" color="accent.default">
            #0{idx}
          </Text>
          <Text as="span" textStyle="subtitle" color="white">
            {title}
          </Text>
        </Box>

        <Box
          as="button"
          type="button"
          aria-label={`Voir le détail du projet ${title}`}
          onClick={() => onOpenDetail(work, imageLayoutId)}
          position="absolute"
          inset={0}
          width="100%"
          height="100%"
          bg="transparent"
          border="none"
          p={0}
          cursor="pointer"
          _focusVisible={{ boxShadow: 'outline' }}
        />

        {showProjectLink && (
          <Link
            href={ctaUrl}
            target="_blank"
            rel="noreferrer"
            aria-hidden="true"
            tabIndex={-1}
            position="absolute"
            bottom={4}
            right={4}
            zIndex={1}
            fontSize="sm"
            display="inline-flex"
            alignItems="center"
            gap={1}
            color="white"
            opacity={0}
            pointerEvents="none"
            _groupHover={{ opacity: 1, pointerEvents: 'auto' }}
            sx={{ transition: `opacity ${DURATIONS.VeryFast}s ease` }}
          >
            Voir le projet
            <Icon as={BiLinkExternal} />
          </Link>
        )}
      </Box>

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
