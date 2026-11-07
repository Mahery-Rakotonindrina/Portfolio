import { useEffect, useState } from 'react'
import {
  Stack,
  Text,
  Button,
  useColorMode,
  Container,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import styles from './styles.module.css'
import BootLog from './BootLog'
import PerspectiveGrid from './PerspectiveGrid'
import SocialIcon from './SocialIcon'
import {
  heroBoot,
  heroBootReduced,
  hoverLift,
  hoverLiftReduced,
  scaleUp,
} from 'config/animations'
import { SocialMedias } from 'config/sidebar'
import useScrambleText from 'hooks/useScrambleText'
import { getTypewriterDurationMs } from 'hooks/useTypewriterLines'

// Vraies données déjà affichées plus bas dans ce composant — source unique
// réutilisée par le journal de boot (BOOT_LINES) pour ne jamais dupliquer/
// désynchroniser un texte inventé (US-013 / DESIGN_PROPOSAL_V2 §2).
const FIRST_NAME = 'Mahery'
const LAST_NAME = 'RAKOTONINDRINA'
const ROLE = 'Développeur Frontend'
const CV_FILE_PATH = '/cv/Mahery-Rakotonindrina-CV.pdf'

const BOOT_LINES = [
  '> INITIALISATION DEVELOPER.EXE',
  `> PROFIL: ${FIRST_NAME} ${LAST_NAME}`,
  `> RÔLE: ${ROLE}`,
]
// Durée totale du journal de boot normal, dérivée des mêmes constantes de
// cadence que le hook de typewriter (pas de valeur dupliquée) + un court
// temps de lecture avant de s'effacer.
const BOOT_HOLD_MS = 150
const BOOT_TOTAL_MS = getTypewriterDurationMs(BOOT_LINES) + BOOT_HOLD_MS
// Sous prefers-reduced-motion : bloc affiché brièvement puis effacé, pas de
// cascade typewriter (DESIGN_PROPOSAL_V2 §2).
const BOOT_REDUCED_TOTAL_MS = 500

// Définis au niveau module (pas dans le corps du composant) : Sidebar a
// maintenant son propre état local (bootLogVisible/scrambleActive, US-013).
// Recréer ces HOC `motion(...)` à chaque rendu changerait leur identité de
// composant à chaque changement d'état, forçant React à démonter/remonter
// tout l'arbre (et donc à relancer `delayChildren`/les transitions depuis
// zéro à chaque fois) — même piège que celui déjà documenté et corrigé sur
// GetInTouch/Navigation (US-007/US-008).
const MotionText = motion(Text)
const MotionStack = motion(Stack)
const MotionButton = motion(Button)
const MotionBox = motion(Box)

const Sidebar = () => {
  const { colorMode } = useColorMode()
  const shouldReduceMotion = useReducedMotion()
  const display = useBreakpointValue({ base: 'none', lg: 'block' })
  // Le panneau Sidebar reste `position: fixed` à partir de `xl` (US-003) :
  // c'est cette même limite qui définit "desktop" pour la parallaxe souris
  // et le flottement idle de l'avatar (US-013 / DESIGN_PROPOSAL_V2 §2).
  const isDesktop = useBreakpointValue({ base: false, xl: true })
  const parallaxEnabled = Boolean(isDesktop) && !shouldReduceMotion

  const [bootLogVisible, setBootLogVisible] = useState(true)
  const [scrambleActive, setScrambleActive] = useState(false)
  const scrambledLastName = useScrambleText(LAST_NAME, scrambleActive)

  useEffect(() => {
    const totalMs = shouldReduceMotion ? BOOT_REDUCED_TOTAL_MS : BOOT_TOTAL_MS
    const timeoutId = window.setTimeout(() => setBootLogVisible(false), totalMs)
    return () => window.clearTimeout(timeoutId)
  }, [shouldReduceMotion])

  // heroBoot : animation d'entrée signature du Hero (US-002). En cascade sur
  // chaque ligne via `staggerChildren`, désactivée si prefers-reduced-motion.
  // `delayChildren` repousse le début de cette cascade jusqu'à la fin du
  // journal de boot (BootLog, ci-dessous) — le contenu réel ne se révèle
  // qu'une fois la mise en scène du "démarrage" terminée.
  const itemVariants: Variants = shouldReduceMotion ? heroBootReduced : heroBoot
  const parentVariants: Variants = {
    animate: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren:
          (shouldReduceMotion ? BOOT_REDUCED_TOTAL_MS : BOOT_TOTAL_MS) / 1000,
      },
    },
  }
  const hoverLiftTarget = (shouldReduceMotion ? hoverLiftReduced : hoverLift)
    .hover

  return (
    <MotionBox
      initial="initial"
      animate="animate"
      position={{ base: 'relative', xl: 'fixed' }}
      maxWidth={{ xl: '34%' }}
      top={{ lg: 0 }}
    >
      <PerspectiveGrid parallaxEnabled={parallaxEnabled} />
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
        <MotionStack variants={parentVariants} spacing={4} w="100%">
          <BootLog
            lines={BOOT_LINES}
            reduced={Boolean(shouldReduceMotion)}
            visible={bootLogVisible}
          />
          {/* Tier 1 — IDENTITÉ : le salut n'est plus qu'une petite ligne de
              politesse (tout le poids visuel va au nom, en dessous), la
              gratitude de l'ancien paragraphe est remontée ici en une phrase
              courte plutôt que diluée au milieu du texte (refonte Hero,
              2026-11-07 — cf. .claude/memory/designer.md). */}
          <MotionText
            variants={itemVariants}
            color="text.tertiary"
            fontWeight="normal"
            fontSize="sm"
          >
            Hey, merci d’être passé par ici 👋
          </MotionText>
          <MotionText
            as="h3"
            textStyle="title"
            paddingRight={{ lg: '20' }}
            textTransform="uppercase"
            variants={itemVariants}
          >
            {FIRST_NAME}
          </MotionText>
          <MotionText
            as="h4"
            lang="fr"
            textStyle="hero"
            variant="emphasis"
            className={styles.marginTopForce}
            textTransform="uppercase"
            overflowWrap="break-word"
            // Le nom de famille est un seul mot de 14 lettres : à la taille
            // "hero" (jusqu'à 7xl), il ne tient jamais sur une ligne dans la
            // colonne de 34% et coupe mal (ex. une seule lettre esseulée sur
            // la 2e ligne). Taille réduite spécifiquement ici plutôt que sur
            // le textStyle partagé (US-002, utilisé ailleurs potentiellement).
            fontSize={{ base: '4xl', md: '5xl', xl: '5xl' }}
            sx={{ hyphens: 'auto', WebkitHyphens: 'auto', msHyphens: 'auto' }}
            variants={itemVariants}
            onAnimationStart={
              shouldReduceMotion ? undefined : () => setScrambleActive(true)
            }
          >
            {scrambledLastName}
          </MotionText>
          {/* Retiré (PO) : "Remote (UTC+3) · FR / EN / MG" laissait entendre
              une recherche limitée au remote, alors qu'il vise toutes les
              opportunités. Le rôle seul reste — pas une heading, une méta-
              info (le nom porte déjà les h3/h4 ci-dessus). */}
          <MotionText
            textStyle="label"
            color="accent.default"
            className={styles.marginTopSmall}
            variants={itemVariants}
          >
            {ROLE}
          </MotionText>

          {/* Repère HUD purement décoratif : marque la bascule "identité" →
              "pitch", dans le même esprit que la grille/les labels mono déjà
              posés ailleurs sur ce composant — pas une ligne grise générique. */}
          <MotionBox
            aria-hidden="true"
            width="32px"
            height="2px"
            bg="accent.default"
            className={styles.marginTopGroup}
            variants={itemVariants}
          />

          {/* Tier 2 — PITCH : une accroche forte et unique (l'ancienne 3e
              phrase du paragraphe, élevée au rang de point d'entrée) suivie
              d'une seule ligne de contexte secondaire — plus de mur de texte
              à trois phrases égales. */}
          <MotionText
            fontSize={{ base: 'lg', md: 'xl' }}
            lineHeight="short"
            fontWeight="medium"
            maxWidth={{ base: '100%', lg: '90%' }}
            variants={itemVariants}
          >
            Prendre un problème compliqué et le rendre simple à l’écran · voilà
            ce qui me fait vibrer.
          </MotionText>
          <MotionText
            variant="description"
            textStyle="body"
            fontSize="sm"
            className={styles.marginTopSmall}
            paddingRight={{ lg: '12' }}
            maxWidth={{ base: '100%', lg: '80%' }}
            variants={itemVariants}
          >
            React & Next.js au quotidien, avec un vrai goût du détail.
          </MotionText>

          {/* Tier 3 — ACTION : un seul CTA domine (contact, en accent plein),
              le second (CV) reste volontairement en retrait. */}
          <MotionBox
            display="flex"
            flexWrap="wrap"
            gap={4}
            className={styles.marginTopGroup}
            variants={itemVariants}
          >
            <MotionButton
              size="lg"
              variant="accent"
              fontWeight="normal"
              fontSize="sm"
              width="160px"
              whileHover={hoverLiftTarget}
              as={'a'}
              href="mailto:maeryrakotonindrina17@gmail.com"
              target="_blank"
            >
              Entrons en contact!
            </MotionButton>
            <MotionButton
              size="lg"
              variant="outlineAlternative"
              fontWeight="normal"
              fontSize="sm"
              width="160px"
              whileHover={hoverLiftTarget}
              as={'a'}
              href={CV_FILE_PATH}
              download
            >
              Télécharger mon CV
            </MotionButton>
          </MotionBox>

          {/* Tier 4 — CANAUX secondaires : filet supérieur discret pour
              signaler "en plus, pas en concurrence" avec le CTA ci-dessus. */}
          <MotionBox
            display="flex"
            gap={4}
            borderTop="1px solid"
            borderColor="border.subtle"
            paddingTop={4}
            variants={itemVariants}
          >
            {SocialMedias.map((socMedia) => (
              <SocialIcon
                key={socMedia.label}
                socialMedia={socMedia}
                hoverLiftTarget={hoverLiftTarget}
              />
            ))}
          </MotionBox>
        </MotionStack>
      </Container>
    </MotionBox>
  )
}

export default Sidebar
