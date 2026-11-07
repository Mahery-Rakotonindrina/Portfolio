import { memo } from 'react'
import {
  AspectRatio,
  Box,
  Icon,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { BiLinkExternal } from 'react-icons/bi'
import { Work } from 'config/works'
import { modalEnter, modalEnterReduced } from 'config/animations'
import useLenisLock from 'hooks/useLenisLock'

export type ProjectDetailModalProps = {
  work: Work | null
  imageLayoutId: string | null
  isOpen: boolean
  onClose: () => void
  showProjectLink: boolean
  shouldReduceMotion: boolean
}

const MotionImage = motion(Image)

// US-018 — vue de détail en morph (DESIGN_PROPOSAL_V2 §6). Réutilise la
// Modal Chakra (focus trap, fermeture Escape, aria-*, retour de focus au
// déclencheur — acquis US-004/US-010/US-016, cf. SkillSetModal.tsx), donc
// aucun de ces acquis n'est à réécrire ici. Seule l'image partage un
// `layoutId` avec la vignette cliquée (FeaturedCard.tsx) pour un vrai morph
// FLIP piloté par Framer Motion ; désactivé sous prefers-reduced-motion
// (simple fondu via modalEnterReduced, comme SkillSetModal). Le titre et la
// description/étude de cas affichés sont EXACTEMENT ceux de
// `config/works.ts` (aucun mot inventé) — déjà le texte complet, pas un
// extrait tronqué ailleurs. `work.caseStudy`, quand présent (PO, "la modale
// répète exactement le même texte que la carte"), remplace la description
// courte par une vraie étude de cas (contexte/défi/résultat) — sinon la
// carte et la modale restent volontairement identiques, comme avant.
const ProjectDetailModal = ({
  work,
  imageLayoutId,
  isOpen,
  onClose,
  showProjectLink,
  shouldReduceMotion,
}: ProjectDetailModalProps) => {
  const overlayBg = useColorModeValue(
    'rgba(237, 242, 247, 0.92)',
    'rgba(11, 13, 18, 0.92)'
  )

  // Bugfix (PO, "je scroll dans le détail et la galerie scroll en
  // background") : voir hooks/useLenisLock.ts — Chakra ne bloque que le
  // scroll natif du body, pas Lenis, qui continuait de faire défiler la
  // page (et donc le scrub GSAP de la galerie) sous ce modal plein écran.
  useLenisLock(isOpen)

  if (!work) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent
        bg={overlayBg}
        color="text.primary"
        borderRadius={0}
        sx={{ backdropFilter: 'blur(16px)' }}
        motionProps={{
          initial: 'initial',
          animate: 'animate',
          exit: 'exit',
          variants: shouldReduceMotion ? modalEnterReduced : modalEnter,
        }}
      >
        <ModalCloseButton zIndex={1} />
        {/* Bugfix (PO, "je ne veux pas de scroll, tout sur une page, image à
            gauche et texte à droite") : image/texte passent en 2 colonnes à
            partir de `md`, hauteur du bloc plafonnée à la fenêtre (padding du
            ModalCloseButton déduit) pour que tout rentre sans défiler.
            Bugfix 2 (PO, "l'image est coupée") : une 1ère version étirait la
            colonne image à `height: 100%` de la ligne (`align-items: stretch`)
            — sur une étude de cas longue (texte haut), ça forçait l'image dans
            un cadre bien plus étroit/haut que son vrai ratio 16:10, et
            `objectFit="cover"` rognait large des deux côtés. L'image garde
            maintenant son vrai ratio (`AspectRatio`, calée sur la largeur de
            sa colonne, 45%) à toutes les tailles ; la ligne est centrée
            verticalement (`alignItems: center`) plutôt qu'étirée. En dessous
            de `md` (pas de place pour 2 colonnes), empilement vertical
            inchangé, défilement standard d'un modal plein écran mobile.
            `scrollBehavior="inside"` du Modal (ci-dessus) reste un filet de
            sécurité pur, pas le comportement visé — tailles de texte et
            espacements resserrés spécifiquement pour que l'étude de cas (3
            sections) tienne sans jamais y recourir sur un écran desktop
            courant. */}
        <ModalBody
          display="flex"
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="center"
          width="100%"
          maxWidth="1100px"
          maxHeight={{ md: 'calc(100vh - 96px)' }}
          mx="auto"
          my="auto"
          py={{ base: 16, md: 8 }}
          gap={{ base: 6, md: 10 }}
        >
          <Box width={{ base: '100%', md: '45%' }} flexShrink={0}>
            <AspectRatio ratio={16 / 10}>
              <MotionImage
                src={work.src}
                alt={work.title}
                objectFit="cover"
                objectPosition={work.objectPosition}
                layoutId={
                  shouldReduceMotion ? undefined : imageLayoutId ?? undefined
                }
              />
            </AspectRatio>
          </Box>
          <Stack
            flex="1"
            justifyContent="center"
            spacing={4}
            textAlign={{ base: 'center', md: 'left' }}
            overflowY="auto"
            minHeight={0}
          >
            <Text as="h2" textStyle="title">
              {work.title}
            </Text>
            {work.caseStudy ? (
              // Étude de cas (PO, "la modale répète exactement le même texte
              // que la carte") : contexte/défi/résultat, en plus de la
              // description courte déjà affichée sur la carte. Seuls
              // Becquet!/CoreWeb/Assisteo Agny/Tikou l'ont pour l'instant
              // (faits confirmés par le PO) ; les autres projets gardent la
              // description seule.
              <Stack spacing={3} width="100%">
                <Box>
                  <Text
                    as="h3"
                    textStyle="label"
                    color="accent.default"
                    fontSize="xs"
                    marginBottom={0.5}
                  >
                    Contexte
                  </Text>
                  <Text variant="description" fontSize="sm">
                    {work.caseStudy.context}
                  </Text>
                </Box>
                <Box>
                  <Text
                    as="h3"
                    textStyle="label"
                    color="accent.default"
                    fontSize="xs"
                    marginBottom={0.5}
                  >
                    Le défi
                  </Text>
                  <Text variant="description" fontSize="sm">
                    {work.caseStudy.challenge}
                  </Text>
                </Box>
                <Box>
                  <Text
                    as="h3"
                    textStyle="label"
                    color="accent.default"
                    fontSize="xs"
                    marginBottom={0.5}
                  >
                    Résultat
                  </Text>
                  <Text variant="description" fontSize="sm">
                    {work.caseStudy.result}
                  </Text>
                </Box>
              </Stack>
            ) : (
              <Text variant="description" textStyle="body">
                {work.description}
              </Text>
            )}
            {showProjectLink && (
              <Link
                href={work.ctaUrl}
                target="_blank"
                rel="noreferrer"
                display="inline-flex"
                alignItems="center"
                justifyContent={{ base: 'center', md: 'flex-start' }}
                gap={1}
                fontSize="sm"
              >
                Voir le projet
                <Icon as={BiLinkExternal} />
              </Link>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default memo(ProjectDetailModal)
