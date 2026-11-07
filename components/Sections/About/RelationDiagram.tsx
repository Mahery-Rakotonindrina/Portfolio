import { memo } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { categoryLabels } from './skillCategoryLabels'
import RelationNode from './RelationNode'
import SkillChips from './SkillChips'
import { DURATIONS } from 'config/animations'
import { SkillCategory, Skills } from 'config/skills'

// Taille fixe du "stage" radial, en px — volontairement non responsive
// (indépendante de la largeur du viewport) pour calculer les positions des
// nœuds par une simple trigonométrie, sans mesure DOM (`getBoundingClientRect`)
// ni risque de course avec la mise en page. L'overlay est plein écran (xl+,
// ≥1280px) : 440px + le panneau de détail tiennent toujours confortablement.
const DIAGRAM_SIZE_PX = 440
const CENTER_PX = DIAGRAM_SIZE_PX / 2

// Même technique validée en bugfix post-US-015 (SkillsOrbitTeaser.tsx) : les
// 9 intitulés de catégorie ont des longueurs très inégales ("CI/CD & Cloud"
// vs "Backend") — un espacement angulaire égal (360°/9) à rayon fixe
// chevaucherait les libellés les plus longs. On alloue à chaque nœud un arc
// de cercle proportionnel à la largeur estimée de son libellé (chasse fixe
// JetBrains Mono, textStyle "label"), puis on dimensionne le rayon pour que
// la circonférence totale contienne exactement la somme de ces arcs — deux
// libellés adjacents ne peuvent jamais se chevaucher, quelle que soit la
// combinaison de longueurs réelles de config/skills.ts.
const NODE_FONT_SIZE_PX = 11
const CHAR_WIDTH_EM = 0.74
const NODE_SLOT_PADDING_PX = 30

const computeRelationLayout = (categories: SkillCategory[]) => {
  const charWidthPx = NODE_FONT_SIZE_PX * CHAR_WIDTH_EM
  const slotWidths = categories.map(
    (category) =>
      categoryLabels[category].length * charWidthPx + NODE_SLOT_PADDING_PX
  )
  const totalArc = slotWidths.reduce((sum, width) => sum + width, 0)
  const radius = totalArc / (2 * Math.PI)
  let cumulative = 0
  const angles = slotWidths.map((width) => {
    // -90° : démarre en haut du cercle plutôt qu'à droite.
    const angleDeg = ((cumulative + width / 2) / totalArc) * 360 - 90
    cumulative += width
    return angleDeg
  })
  return { radius, angles }
}

type RelationDiagramProps = {
  categories: SkillCategory[]
  expandedCategories: SkillCategory[]
  isExpanded: (category: SkillCategory) => boolean
  onHoverStart: (category: SkillCategory) => void
  onHoverEnd: () => void
  onFocusCategory: (category: SkillCategory) => void
  onBlurCategory: () => void
  onTogglePin: (category: SkillCategory) => void
  panelIdFor: (category: SkillCategory) => string
  prefersReducedMotion: boolean
}

const RelationDiagram = ({
  categories,
  expandedCategories,
  isExpanded,
  onHoverStart,
  onHoverEnd,
  onFocusCategory,
  onBlurCategory,
  onTogglePin,
  panelIdFor,
  prefersReducedMotion,
}: RelationDiagramProps) => {
  const { radius, angles } = computeRelationLayout(categories)

  const nodePosition = (index: number) => {
    const rad = (angles[index] * Math.PI) / 180
    return {
      x: CENTER_PX + radius * Math.cos(rad),
      y: CENTER_PX + radius * Math.sin(rad),
    }
  }

  return (
    <Flex
      width="100%"
      flex="1"
      minH={0}
      align="center"
      justify="center"
      gap={{ xl: 10, '2xl': 16 }}
      wrap="nowrap"
    >
      <Box
        position="relative"
        width={`${DIAGRAM_SIZE_PX}px`}
        height={`${DIAGRAM_SIZE_PX}px`}
        flexShrink={0}
        overflow="visible"
      >
        <Box
          as="svg"
          position="absolute"
          inset={0}
          width="100%"
          height="100%"
          viewBox={`0 0 ${DIAGRAM_SIZE_PX} ${DIAGRAM_SIZE_PX}`}
          pointerEvents="none"
          aria-hidden="true"
        >
          <circle
            cx={CENTER_PX}
            cy={CENTER_PX}
            r={4}
            fill="var(--chakra-colors-accent-default)"
          />
          {categories.map((category, index) => {
            const { x, y } = nodePosition(index)
            const active = isExpanded(category)
            return (
              <g key={category}>
                <line
                  x1={CENTER_PX}
                  y1={CENTER_PX}
                  x2={x}
                  y2={y}
                  stroke="var(--chakra-colors-accent-default)"
                  strokeWidth={1}
                  opacity={active ? 0.55 : 0.18}
                />
                {active && !prefersReducedMotion && (
                  // Pouls lumineux : un second trait en pointillés dont le
                  // décalage (stroke-dashoffset) est animé en boucle — coût
                  // négligeable (un seul attribut SVG animé), jamais rendu
                  // sous prefers-reduced-motion (critère d'acceptation).
                  <motion.line
                    x1={CENTER_PX}
                    y1={CENTER_PX}
                    x2={x}
                    y2={y}
                    stroke="var(--chakra-colors-accent-default)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray="6 18"
                    animate={{ strokeDashoffset: [0, -24] }}
                    transition={{
                      duration: DURATIONS.Fast,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                )}
              </g>
            )
          })}
        </Box>

        {categories.map((category, index) => {
          const { x, y } = nodePosition(index)
          const active = isExpanded(category)
          return (
            <RelationNode
              key={category}
              category={category}
              x={x}
              y={y}
              active={active}
              fontSize={NODE_FONT_SIZE_PX}
              panelId={panelIdFor(category)}
              onHoverStart={() => onHoverStart(category)}
              onHoverEnd={onHoverEnd}
              onFocus={() => onFocusCategory(category)}
              onBlur={onBlurCategory}
              onClick={() => onTogglePin(category)}
            />
          )
        })}
      </Box>

      <Box flex="1" minW={0} maxW="480px" height="100%" overflowY="auto" pr={2}>
        {expandedCategories.length === 0 ? (
          <Text color="text.tertiary" textStyle="body" fontSize="sm">
            Survolez ou sélectionnez un nœud du schéma pour révéler les
            compétences associées.
          </Text>
        ) : (
          <Flex direction="column" gap={6}>
            {expandedCategories.map((category) => (
              <SkillChips
                key={category}
                id={panelIdFor(category)}
                title={categoryLabels[category]}
                skills={Skills[category]}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </Flex>
        )}
      </Box>
    </Flex>
  )
}

export default memo(RelationDiagram)
