import { ReactNode, useEffect, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { motion, useAnimation, MotionValue, Variants } from 'framer-motion'
import { DURATIONS, easing, scrollRevealReduced } from 'config/animations'

// US-015 — révélation scrubbed par balayage (DESIGN_PROPOSAL_V2 §3).
// 3 modes de révélation par bloc, choisis une seule fois par Detail.tsx et
// partagés par les 3 blocs :
//  - 'scrub'  : desktop, hors prefers-reduced-motion — clip-path piloté
//               directement par la position de scroll (useScroll), pendant
//               le verrouillage sticky.
//  - 'sweep'  : mobile/tablette, hors prefers-reduced-motion — même visuel
//               de balayage clip-path, déclenché à l'entrée dans le
//               viewport, pas de verrouillage.
//  - 'fade'   : prefers-reduced-motion (tout breakpoint) — fondu d'opacité
//               seul (scrollRevealReduced, déjà existant), pas de direction,
//               pas de verrouillage.
export type RevealMode = 'scrub' | 'sweep' | 'fade'

const MotionBox = motion(Box)

const sweepReveal: Variants = {
  initial: { clipPath: 'inset(0% 100% 0% 0%)' },
  animate: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: DURATIONS.Fast, ease: easing },
  },
}

type RevealBlockProps = {
  mode: RevealMode
  clipPath: MotionValue<string>
  children: ReactNode
}

// Piège trouvé en vérification, cause racine confirmée empiriquement :
// `whileInView`/`viewport={{ amount: 0.3 }}` (Framer Motion natif) ET
// `useInView` de `react-intersection-observer` échouaient tous les deux,
// jamais aucune révélation quelle que soit la méthode de scroll réelle
// testée (wheel, scrollIntoView, scrollTo). Isolé à coups d'`IntersectionObserver`
// posés à la main avec différentes options : un `threshold` NUMÉRIQUE UNIQUE
// non nul (`0.3`, ou même `[0.3]` en tableau à un seul élément) ne se
// déclenche JAMAIS ici, alors qu'un tableau incluant `0` (`[0, 0.3, 0.5, 1]`)
// se déclenche correctement. Cause : avec un changement de géométrie abrupt
// (saut direct, pas de défilement image par image passant progressivement
// par tous les ratios intermédiaires — notre cas avec Lenis qui anime son
// propre `scrollTop`), le navigateur peut ne jamais échantillonner le ratio
// exact où `0.3` est franchi ; `threshold: 0` se déclenche dès qu'il y a ne
// serait-ce qu'1px visible, donc ne peut jamais être "sauté". Implémentation
// manuelle (`useEffect`/`useRef`/`useState`) avec `threshold: 0` plutôt que
// de dépendre d'une lib tierce sur ce point précis — contournement robuste
// documenté plutôt qu'un correctif risqué dans une dépendance tierce.
const useManualInView = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || inView) {
      return undefined
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
          }
        })
      },
      { threshold: 0 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [inView])

  return [ref, inView] as const
}

const RevealBlock = ({ mode, clipPath, children }: RevealBlockProps) => {
  const controls = useAnimation()
  const [ref, inView] = useManualInView()

  useEffect(() => {
    if (inView) {
      controls.start('animate')
    }
  }, [controls, inView])

  // `key={mode}` : le tout premier rendu client calcule toujours
  // `mode === 'sweep'` par construction (SSR-safe, cf. Detail.tsx), y
  // compris quand le mode final réel est 'fade' ou 'scrub'. Sans `key`
  // distinct par mode, Framer Motion garde la MotionValue `clipPath` créée
  // par ce premier rendu transitoire et ne la réinitialise jamais pour les
  // variants/style suivants qui ne la mentionnent plus — déjà corrigé une
  // fois, piège réintroduit par inadvertance lors du remplacement de
  // `whileInView` par `useManualInView` ci-dessus (à ne pas reperdre si ce
  // fichier est retouché). `key` force un remontage complet à chaque
  // changement de mode : plus aucun état Framer ne survit d'un mode à
  // l'autre.
  if (mode === 'scrub') {
    return (
      <MotionBox key={mode} style={{ clipPath }}>
        {children}
      </MotionBox>
    )
  }

  return (
    <MotionBox
      key={mode}
      ref={ref}
      initial="initial"
      animate={controls}
      variants={mode === 'fade' ? scrollRevealReduced : sweepReveal}
    >
      {children}
    </MotionBox>
  )
}

export default RevealBlock
