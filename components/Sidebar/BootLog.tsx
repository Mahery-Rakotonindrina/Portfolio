import { useEffect, useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import useTypewriterLines from 'hooks/useTypewriterLines'

type BootLogProps = {
  lines: string[]
  reduced: boolean
  visible: boolean
}

const MotionBox = motion(Box)

// Journal de boot affiché une seule fois au montage du Hero/Sidebar : mise en
// scène du nom/titre déjà réels (lignes fournies par l'appelant, jamais de
// texte inventé ici). US-013 / DESIGN_PROPOSAL_V2 §2.
// Normal : lignes révélées en cascade typewriter (useTypewriterLines).
// Reduced motion : lignes affichées d'un bloc, simple fondu d'opacité.
// `aria-hidden` : purement décoratif, duplique une information déjà
// présente ailleurs dans le DOM réel (nom, rôle) — évite une double
// annonce aux lecteurs d'écran.
const BootLog = ({ lines, reduced, visible }: BootLogProps) => {
  // `reduced` (dérivé de useReducedMotion()) peut déjà valoir `true` dès le
  // tout premier rendu client, avant même la réconciliation d'hydratation,
  // alors que le SSR (pas de `window`) ne peut jamais l'anticiper — mismatch
  // d'hydratation si on s'y fie directement (même piège que celui déjà
  // documenté et corrigé sur Menu/Navigation, US-008). `mounted` reste
  // `false` au tout premier rendu client (identique au SSR, qui calcule
  // forcément `reduced=false`) et ne bascule qu'après coup dans un effet ;
  // `effectiveReduced` ne peut donc jamais valoir `true` avant que le rendu
  // client ait eu une chance de correspondre au rendu serveur.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const effectiveReduced = mounted && reduced

  const typedLines = useTypewriterLines(lines, visible && !effectiveReduced)
  const displayedLines = effectiveReduced ? lines : typedLines

  return (
    <AnimatePresence>
      {visible && (
        <MotionBox
          aria-hidden="true"
          initial={{ opacity: effectiveReduced ? 0 : 1 }}
          animate={{
            opacity: 1,
            transition: { duration: effectiveReduced ? 0.4 : 0.2 },
          }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          fontFamily="mono"
          fontSize="xs"
          letterSpacing="wide"
          color="text.tertiary"
          lineHeight="tall"
        >
          {displayedLines.map((line, index) => (
            <Text key={`${index}-${line.length > 0}`} as="p" margin={0}>
              {line || ' '}
            </Text>
          ))}
        </MotionBox>
      )}
    </AnimatePresence>
  )
}

export default BootLog
