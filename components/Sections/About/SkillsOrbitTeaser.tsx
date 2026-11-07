import { memo } from 'react'
import { Box } from '@chakra-ui/react'
import { MotionValue } from 'framer-motion'
import OrbitLabel from './OrbitLabel'
import { Skills, SkillCategory } from 'config/skills'
import useOrbitAngle from 'hooks/useOrbitAngle'

type Props = {
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
}

// Teaser orbital (US-015) : au survol du CTA "Mon attirail de développeur",
// les 9 libellés réels de catégories (config/skills.ts) orbitent légèrement
// autour du curseur, à proximité du bouton — un aperçu du contenu de
// l'overlay Skills avant de l'ouvrir. Desktop uniquement, jamais sous
// prefers-reduced-motion (gating fait par l'appelant, Detail.tsx).
const CATEGORIES = Object.keys(Skills) as SkillCategory[]

// Bugfix post US-015 (PO) : à rayon fixe (56px) et espacement angulaire égal
// (360°/9), les 9 libellés (longueur très variable : "cicd" à 4 caractères
// vs "productivity boost" à 19) se chevauchaient massivement entre eux ET
// avec le texte du CTA. JetBrains Mono (config/theme.ts, textStyle "label")
// est une police à chasse FIXE : la largeur d'un libellé est donc
// directement proportionnelle à son nombre de caractères, sans avoir besoin
// de mesurer le DOM. On alloue à chaque libellé un arc de cercle
// proportionnel à sa largeur estimée (+ une marge fixe), puis on dimensionne
// le rayon pour que la circonférence totale contienne exactement la somme de
// ces arcs — par construction, deux libellés adjacents ne se chevauchent
// jamais, quelle que soit la combinaison de longueurs.
const ORBIT_FONT_SIZE_PX = 10
// Chasse mono + letterSpacing "widest" (0.1em) combinées, en multiple de la
// taille de police — mesurée empiriquement à ~0.7em/caractère (getBoundingClientRect
// réel des 9 libellés rendus), 0.74 garde une petite marge de sécurité sans
// gonfler artificiellement le rayon nécessaire (donc l'empiétement sur le
// contenu voisin, cf. note plus bas).
const CHAR_WIDTH_EM = 0.74
const MIN_GAP_PX = 16
// Marge verticale (au-delà du rayon) pour garantir que le point le plus bas
// de l'orbite reste toujours au-dessus du CTA, quelle que soit la position
// du curseur sur le bouton (survol au ras du bord bas = cas le plus
// défavorable) — couvre une hauteur de bouton généreuse (une ligne de texte
// + icône) sans avoir à mesurer le DOM du bouton en direct.
//
// Compromis assumé, à signaler au designer (cf. mémoire developer.md) : ce
// décalage vertical fait orbiter les libellés au-dessus du CTA, dans la
// même bande verticale que la grille de compétences (Skills.frontend/backend)
// juste au-dessus — chevauchement déjà documenté comme connu/mineur avec un
// rayon de 56px avant ce correctif, mécaniquement plus visible maintenant
// que le rayon est plus grand (nécessaire pour éliminer le chevauchement
// label-label et label-CTA, les 2 points demandés). Aucune direction de
// repli (en dessous : sort du viewport verrouillé ; à droite : empiète sur
// le cadre HUD selon la largeur d'écran xl réelle) n'est strictement plus
// sûre — compromis documenté plutôt que tranché unilatéralement.
const BUTTON_CLEARANCE_PX = 56

const computeOrbitLayout = (categories: SkillCategory[]) => {
  const charWidthPx = ORBIT_FONT_SIZE_PX * CHAR_WIDTH_EM
  const slotWidths = categories.map(
    (category) => category.length * charWidthPx + MIN_GAP_PX
  )
  const totalArc = slotWidths.reduce((sum, width) => sum + width, 0)
  const radius = totalArc / (2 * Math.PI)
  let cumulative = 0
  const baseAngles = slotWidths.map((width) => {
    const angleDeg = ((cumulative + width / 2) / totalArc) * 360
    cumulative += width
    return angleDeg
  })
  return { radius, baseAngles }
}

const { radius: ORBIT_RADIUS, baseAngles: ORBIT_BASE_ANGLES } =
  computeOrbitLayout(CATEGORIES)
const ORBIT_VERTICAL_OFFSET = ORBIT_RADIUS + BUTTON_CLEARANCE_PX

const SkillsOrbitTeaser = ({ pointerX, pointerY }: Props) => {
  const angle = useOrbitAngle()

  return (
    <Box
      position="absolute"
      inset={0}
      pointerEvents="none"
      overflow="visible"
      aria-hidden="true"
    >
      {CATEGORIES.map((category, index) => (
        <OrbitLabel
          key={category}
          category={category}
          baseAngle={ORBIT_BASE_ANGLES[index]}
          radius={ORBIT_RADIUS}
          verticalOffset={ORBIT_VERTICAL_OFFSET}
          fontSize={ORBIT_FONT_SIZE_PX}
          pointerX={pointerX}
          pointerY={pointerY}
          angle={angle}
        />
      ))}
    </Box>
  )
}

export default memo(SkillsOrbitTeaser)
