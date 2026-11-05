import { useCallback, useMemo, useState } from 'react'
import { Box, useBreakpointValue } from '@chakra-ui/react'
import { useReducedMotion } from 'framer-motion'
import CategoryAccordion from './CategoryAccordion'
import RelationDiagram from './RelationDiagram'
import { CATEGORIES } from './skillCategoryLabels'
import { SkillCategory } from 'config/skills'

// Pas de SSR à gérer ici : ce composant n'existe que dans l'arbre de la
// Modal, qui ne rend ses enfants qu'une fois ouverte côté client (cf.
// SkillSetModal.tsx) — aucun rendu serveur de ce contenu, donc pas de risque
// de mismatch d'hydratation (contrairement à Sidebar/BootLog/Detail qui
// rendent dès le premier paint). `useReducedMotion()` peut donc être utilisé
// directement, sans le pattern `mounted && reduced` établi ailleurs.
const SkillsRelationMap = () => {
  const prefersReducedMotion = Boolean(useReducedMotion())
  // Même convention que Sidebar/Avatar/Detail (US-013/US-015) : le
  // basculement radial (desktop) / accordéon (mobile-tablette) se fait au
  // même seuil `xl` que le reste du site (voir aussi `mobileBreakpointsMap`,
  // identique à `!isDesktop`).
  const isDesktop = Boolean(useBreakpointValue({ base: false, xl: true }))

  const [pinned, setPinned] = useState<Set<SkillCategory>>(() => new Set())
  const [hovered, setHovered] = useState<SkillCategory | null>(null)
  const [focused, setFocused] = useState<SkillCategory | null>(null)

  const isExpanded = useCallback(
    (category: SkillCategory) =>
      pinned.has(category) || hovered === category || focused === category,
    [pinned, hovered, focused]
  )

  const togglePin = useCallback((category: SkillCategory) => {
    setPinned((previous) => {
      const next = new Set(previous)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }, [])

  const handleHoverStart = useCallback(
    (category: SkillCategory) => setHovered(category),
    []
  )
  const handleHoverEnd = useCallback(() => setHovered(null), [])
  const handleFocusCategory = useCallback(
    (category: SkillCategory) => setFocused(category),
    []
  )
  const handleBlurCategory = useCallback(() => setFocused(null), [])

  // `useId()` (React 18) n'est pas disponible ici : `@types/react` reste
  // pinné en 17.0.15 (incohérence pré-existante documentée en faisabilité
  // Phase 2, cf. .claude/memory/developer.md) et ne déclare pas ce hook, bien
  // que le runtime React 18.3.1 l'ait réellement. Un préfixe statique suffit
  // : une seule instance de SkillsRelationMap est jamais montée à la fois
  // (contenu de la Modal Skills, pas de répétition sur la page).
  const panelIdFor = useCallback(
    (category: SkillCategory) => `skills-relation-map-panel-${category}`,
    []
  )

  const expandedCategories = useMemo(
    () => CATEGORIES.filter((category) => isExpanded(category)),
    [isExpanded]
  )

  return (
    <Box
      width="100%"
      // `flex="1"` (pas `height="100%"`) : ce Box est un enfant direct d'un
      // conteneur flex en colonne (ModalBody, SkillSetModal.tsx) — une
      // hauteur en pourcentage sur un item flexbox imbriqué ne se résout pas
      // de façon fiable à travers plusieurs niveaux (vérifié : donnait un
      // Box réduit à la hauteur naturelle du contenu, 440px, au lieu de
      // remplir l'espace disponible). `display="flex"` ici aussi, pour que
      // RelationDiagram (son enfant direct) puisse à son tour utiliser
      // `flex="1"` plutôt qu'un `height="100%"` qui buterait sur le même
      // problème un niveau plus bas — chaîne de `flex` de bout en bout,
      // aucune résolution de pourcentage de hauteur nécessaire.
      display={isDesktop ? 'flex' : 'block'}
      flexDirection="column"
      flex={isDesktop ? '1' : undefined}
      minH={isDesktop ? 0 : 'auto'}
    >
      {isDesktop ? (
        <RelationDiagram
          categories={CATEGORIES}
          expandedCategories={expandedCategories}
          isExpanded={isExpanded}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          onFocusCategory={handleFocusCategory}
          onBlurCategory={handleBlurCategory}
          onTogglePin={togglePin}
          panelIdFor={panelIdFor}
          prefersReducedMotion={prefersReducedMotion}
        />
      ) : (
        <CategoryAccordion
          categories={CATEGORIES}
          isExpanded={isExpanded}
          onToggle={togglePin}
          onFocusCategory={handleFocusCategory}
          onBlurCategory={handleBlurCategory}
          panelIdFor={panelIdFor}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}
    </Box>
  )
}

export default SkillsRelationMap
