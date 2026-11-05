import { useReducedMotion } from 'framer-motion'
import useFinePointer from './useFinePointer'

// Condition unique qui pilote à la fois le curseur personnalisé
// (CustomCursor) et l'effet magnétique des 3 familles de cibles ciblées par
// US-020 (icônes sociales du Hero, nœuds du diagramme Skills, repères de la
// jauge HUD) — jamais deux conditions à maintenir en synchro séparément.
// SSR-safe par construction : `useFinePointer()` vaut `false` au tout
// premier rendu client (identique au SSR), donc le résultat combiné aussi,
// quelle que soit la valeur retournée par `useReducedMotion()` à ce même
// instant (résolution synchrone documentée en US-008/US-013) — pas besoin du
// pattern `mounted` distinct ici.
const usePointerCursorEnabled = (): boolean => {
  const hasFinePointer = useFinePointer()
  const prefersReducedMotion = useReducedMotion()
  return hasFinePointer && !prefersReducedMotion
}

export default usePointerCursorEnabled
