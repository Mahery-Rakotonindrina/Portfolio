import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import usePointerCursorEnabled from 'hooks/usePointerCursorEnabled'

type CursorKind =
  | { kind: 'default' }
  | { kind: 'grow' }
  | { kind: 'label'; label: string }

const DEFAULT_KIND: CursorKind = { kind: 'default' }

const RING_SPRING = { stiffness: 500, damping: 40, mass: 0.4 }
// Tailles alignées sur DESIGN_PROPOSAL_V2.md §8 : repos 24px, "grossit" ~40px
// — le même agrandissement sert à la fois l'état générique (grow, sans
// label) et les 2 états avec label ("VOIR"/"+"), le document ne décrit pas
// une 3e taille distincte pour ces derniers.
const RING_SIZE_DEFAULT = 24
const RING_SIZE_GROWN = 40
// Tout élément interactif générique (lien, bouton...) fait grossir l'anneau
// par défaut — c'est l'état "grow" du critère d'acceptation. Les familles
// qui portent un label dédié ("VOIR"/"+") s'annoncent via l'attribut
// `data-cursor-label`, posé explicitement sur les éléments concernés
// (FeaturedCard, RelationNode) plutôt que déduit ici. L'attribut porte un
// identifiant sémantique stable (`voir`/`plus`), traduit ici en texte
// affiché — évite de coupler le marquage DOM au libellé visuel exact.
const LABEL_DISPLAY: Record<string, string> = {
  voir: 'VOIR',
  plus: '+',
}
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select'

// US-020 — curseur personnalisé contextuel, desktop uniquement (souris fine +
// hover possible, cf. `usePointerCursorEnabled`). Monté une seule fois,
// globalement, dans `pages/_app.tsx` (même convention que FavIconProvider/
// SmoothScrollProvider). Rendu `null` tant que désactivé (tactile ou
// `prefers-reduced-motion`) : AUCUN DOM, AUCUN listener posé dans ce cas —
// pas seulement masqué visuellement (critère d'acceptation explicite).
const CustomCursor = (): JSX.Element | null => {
  const enabled = usePointerCursorEnabled()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, RING_SPRING)
  const y = useSpring(rawY, RING_SPRING)

  const [cursorKind, setCursorKind] = useState<CursorKind>(DEFAULT_KIND)
  const kindRef = useRef<CursorKind>(DEFAULT_KIND)
  const [visible, setVisible] = useState(false)
  // Tant qu'aucun mouvement de souris n'a suivi une navigation clavier
  // (`Tab`), l'anneau reste masqué — garantit qu'il ne peut jamais recouvrir
  // visuellement l'indicateur de focus natif (`:focus-visible`, acquis
  // US-010) : il ne "saute" jamais sur l'élément focusé, il disparaît
  // simplement jusqu'au prochain déplacement réel de la souris.
  const [hiddenForKeyboard, setHiddenForKeyboard] = useState(false)

  // Masque le curseur système natif tant que le curseur personnalisé est
  // actif (DESIGN_PROPOSAL_V2.md §8) — ne touche que la propriété CSS
  // `cursor` (icône de la souris), jamais l'indicateur de focus clavier
  // (`outline`/`:focus-visible`), mécanisme CSS totalement indépendant.
  // Restauré dès que `enabled` redevient faux (tactile, reduced-motion).
  useEffect(() => {
    if (!enabled) {
      return undefined
    }
    const previousCursor = document.body.style.cursor
    document.body.style.cursor = 'none'
    return () => {
      document.body.style.cursor = previousCursor
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    const handlePointerMove = (event: PointerEvent) => {
      rawX.set(event.clientX)
      rawY.set(event.clientY)
      setVisible(true)
      setHiddenForKeyboard(false)

      const target = event.target as Element | null
      const labelEl = target?.closest<HTMLElement>('[data-cursor-label]')
      let nextKind: CursorKind = DEFAULT_KIND
      if (labelEl) {
        const key = labelEl.dataset.cursorLabel ?? ''
        nextKind = {
          kind: 'label',
          label: LABEL_DISPLAY[key] ?? key.toUpperCase(),
        }
      } else if (target?.closest(INTERACTIVE_SELECTOR)) {
        nextKind = { kind: 'grow' }
      }

      const previous = kindRef.current
      const changed =
        previous.kind !== nextKind.kind ||
        (previous.kind === 'label' &&
          nextKind.kind === 'label' &&
          previous.label !== nextKind.label)
      if (changed) {
        kindRef.current = nextKind
        setCursorKind(nextKind)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setHiddenForKeyboard(true)
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, rawX, rawY])

  if (!enabled || !visible || hiddenForKeyboard) {
    return null
  }

  const label = cursorKind.kind === 'label' ? cursorKind.label : null
  const size =
    cursorKind.kind === 'default' ? RING_SIZE_DEFAULT : RING_SIZE_GROWN

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        // Toujours au-dessus de tout le reste, y compris les portails Modal
        // Chakra (z-index ~1400) — strictement décoratif et `pointerEvents:
        // 'none'`, ne peut jamais intercepter un clic ni gêner une
        // interaction.
        zIndex: 2147483000,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        animate={{ width: size, height: size }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          borderRadius: '50%',
          border: '1px solid var(--chakra-colors-accent-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: label
            ? 'var(--chakra-colors-bg-surface)'
            : 'transparent',
        }}
      >
        {label && (
          <span
            style={{
              fontFamily: 'var(--chakra-fonts-mono)',
              fontSize: 10,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--chakra-colors-accent-default)',
            }}
          >
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  )
}

export default CustomCursor
