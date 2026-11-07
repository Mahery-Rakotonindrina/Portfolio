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
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { BiLinkExternal } from 'react-icons/bi'
import { Work } from 'config/works'
import { modalEnter, modalEnterReduced } from 'config/animations'

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
// description affichés sont EXACTEMENT ceux de `config/works.ts` (aucun mot
// inventé) — déjà le texte complet, pas un extrait tronqué ailleurs.
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
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          maxWidth="720px"
          mx="auto"
          py={{ base: 16, md: 10 }}
          gap={6}
        >
          <Box width="100%">
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
          <Text as="h2" textStyle="title" textAlign="center">
            {work.title}
          </Text>
          <Text variant="description" textStyle="body" textAlign="center">
            {work.description}
          </Text>
          {showProjectLink && (
            <Link
              href={work.ctaUrl}
              target="_blank"
              rel="noreferrer"
              display="inline-flex"
              alignItems="center"
              gap={1}
              fontSize="sm"
            >
              Voir le projet
              <Icon as={BiLinkExternal} />
            </Link>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default memo(ProjectDetailModal)
