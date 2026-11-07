import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useColorModeValue,
} from '@chakra-ui/react'
import { useReducedMotion } from 'framer-motion'
import styles from './styles.module.css'
import SkillsRelationMap from './SkillsRelationMap'
import { modalEnter, modalEnterReduced } from 'config/animations'
import useLenisLock from 'hooks/useLenisLock'

type ISkillSetModal = {
  isOpen: boolean
  onClose(): void
}

// US-016 — remplace l'ancienne petite Modal Chakra (listes de compétences,
// US-004) par un overlay plein écran ("carte de relations", voir
// DESIGN_PROPOSAL_V2 §4). Toujours la Modal Chakra en dessous (`size="full"`)
// — tous les acquis d'accessibilité déjà validés (focus trap, fermeture
// `Escape`, aria-* automatiques, retour de focus au déclencheur — US-004/
// US-010) sont donc conservés sans rien réécrire : seul le contenu
// (ModalBody) change, remplacé par <SkillsRelationMap />.
const SkillSetModal = ({ isOpen, onClose }: ISkillSetModal) => {
  const shouldReduceMotion = useReducedMotion()
  // Fond flouté/obscurci demandé explicitement pour cet overlay plein écran
  // (DESIGN_PROPOSAL_V2 §4) — un alpha par mode n'a pas d'équivalent dans les
  // semantic tokens de config/theme.ts (qui ne couvrent que des couleurs
  // pleines), d'où ce useColorModeValue ciblé plutôt qu'un nouveau token.
  const overlayBg = useColorModeValue(
    'rgba(237, 242, 247, 0.88)',
    'rgba(11, 13, 18, 0.9)'
  )

  // Même bugfix que ProjectDetailModal.tsx (PO) — voir hooks/useLenisLock.ts.
  useLenisLock(isOpen)

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
        display="flex"
        flexDirection="column"
        sx={{ backdropFilter: 'blur(16px)' }}
        motionProps={{
          initial: 'initial',
          animate: 'animate',
          exit: 'exit',
          // modalEnter : fondu + léger zoom à l'ouverture (US-002), réduit à
          // un simple fondu si prefers-reduced-motion.
          variants: shouldReduceMotion ? modalEnterReduced : modalEnter,
        }}
      >
        <ModalHeader>
          <Text as="h2" textStyle="subtitle">
            Ensemble de mes compétences
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          className={styles.skillModal}
          display="flex"
          flexDirection="column"
          flex="1"
        >
          <SkillsRelationMap />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SkillSetModal
