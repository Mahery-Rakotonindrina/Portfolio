import { memo, useEffect, useState } from 'react'
import { Stack } from '@chakra-ui/react'
import { useReducedMotion } from 'framer-motion'
import TimelineItem from './TimelineItem'
import { ExperiencesList } from 'config/experience'

// Timeline verticale : remplace l'ancien système d'onglets (illisible en
// orientation horizontale sur mobile, scroll horizontal nécessaire).
// US-017 : le tracé (ligne + points) de chaque entrée est désormais piloté
// par sa propre progression de scroll (`TimelineItem`, `useScroll`/
// `useTransform`) plutôt que révélé en bloc via `whileInView` — voir ce
// fichier pour le détail du mécanisme.
const ExperienceTimeline = () => {
  // Pattern "mounted && reduced" (cf. Menu/Navigation, Detail.tsx — US-008/
  // US-015) : `useReducedMotion()` peut déjà valoir `true` dès le tout
  // premier rendu client, avant même l'hydratation, ce qui romprait la
  // parité avec le rendu SSR (toujours "non réduit"). On ne bascule qu'après
  // montage.
  const prefersReducedMotionRaw = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  const prefersReducedMotion = mounted && Boolean(prefersReducedMotionRaw)

  return (
    <Stack as="ol" spacing={0} width="100%" listStyleType="none">
      {ExperiencesList.map((company, idx) => {
        const isLast = idx === ExperiencesList.length - 1
        return (
          <TimelineItem
            key={company.name}
            company={company}
            isLast={isLast}
            prefersReducedMotion={prefersReducedMotion}
          />
        )
      })}
    </Stack>
  )
}

export default memo(ExperienceTimeline)
