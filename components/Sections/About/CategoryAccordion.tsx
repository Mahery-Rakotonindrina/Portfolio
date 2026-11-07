import { memo } from 'react'
import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { categoryLabels } from './skillCategoryLabels'
import SkillChips from './SkillChips'
import { DURATIONS, easing } from 'config/animations'
import { SkillCategory, Skills } from 'config/skills'

// Hissé au niveau module — ce composant a des enfants qui montent/démontent
// selon un state du parent (SkillsRelationMap), même précaution que partout
// ailleurs dans le projet dès qu'un motion(X) est réutilisé entre rendus.
const MotionPanel = motion.div

type CategoryAccordionProps = {
  categories: SkillCategory[]
  isExpanded: (category: SkillCategory) => boolean
  onToggle: (category: SkillCategory) => void
  onFocusCategory: (category: SkillCategory) => void
  onBlurCategory: () => void
  panelIdFor: (category: SkillCategory) => string
  prefersReducedMotion: boolean
}

// Mobile/tablette (< xl) : la disposition radiale n'est pas lisible/tactile
// (DESIGN_PROPOSAL_V2 §4) — accordéon vertical des 9 catégories, même ordre.
// Le trait de connexion devient un rail vertical fin, écho visuel délibéré
// avec la timeline d'Experience (Timeline.tsx : dot w=3/h=3 accent.default +
// rail 2px border.subtle) — mêmes valeurs de layout, sans dépendre du
// composant Experience lui-même.
const CategoryAccordion = ({
  categories,
  isExpanded,
  onToggle,
  onFocusCategory,
  onBlurCategory,
  panelIdFor,
  prefersReducedMotion,
}: CategoryAccordionProps) => (
  <Box as="ul" listStyleType="none" m={0} p={0} role="list">
    {categories.map((category, index) => {
      const active = isExpanded(category)
      const isLast = index === categories.length - 1
      return (
        <Flex as="li" key={category} role="listitem" align="stretch">
          <Flex direction="column" align="center" flexShrink={0} mr={4}>
            <Box
              w={3}
              h={3}
              borderRadius="full"
              bg={active ? 'accent.default' : 'border.subtle'}
              flexShrink={0}
              mt={4}
              sx={{ transition: 'background-color 0.2s ease' }}
              aria-hidden="true"
            />
            {!isLast && <Box flex="1" width="2px" bg="border.subtle" my={2} />}
          </Flex>

          <Box flex="1" pb={isLast ? 0 : 2}>
            <Box
              as="button"
              type="button"
              width="100%"
              textAlign="left"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              py={3}
              onClick={() => onToggle(category)}
              onFocus={() => onFocusCategory(category)}
              onBlur={onBlurCategory}
              aria-expanded={active}
              aria-controls={panelIdFor(category)}
              _focusVisible={{
                boxShadow: '0 0 0 2px',
                color: 'accent.default',
              }}
            >
              <Text
                as="span"
                textStyle="label"
                color={active ? 'accent.default' : 'text.primary'}
              >
                {categoryLabels[category]}
              </Text>
              <Icon as={active ? FiMinus : FiPlus} color="text.tertiary" />
            </Box>

            {prefersReducedMotion ? (
              active && (
                <Box pb={4}>
                  <SkillChips
                    id={panelIdFor(category)}
                    title={categoryLabels[category]}
                    skills={Skills[category]}
                    prefersReducedMotion
                    showTitle={false}
                  />
                </Box>
              )
            ) : (
              <AnimatePresence initial={false}>
                {active && (
                  <MotionPanel
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: DURATIONS.VeryFast, ease: easing }}
                    style={{ overflow: 'hidden' }}
                  >
                    <Box pb={4}>
                      <SkillChips
                        id={panelIdFor(category)}
                        title={categoryLabels[category]}
                        skills={Skills[category]}
                        prefersReducedMotion={false}
                        showTitle={false}
                      />
                    </Box>
                  </MotionPanel>
                )}
              </AnimatePresence>
            )}
          </Box>
        </Flex>
      )
    })}
  </Box>
)

export default memo(CategoryAccordion)
