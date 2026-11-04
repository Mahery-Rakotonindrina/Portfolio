import { memo } from 'react'
import {
  Text,
  Stack,
  Flex,
  Box,
  HStack,
  Image,
  List,
  ListIcon,
  ListItem,
  Skeleton,
  useColorMode,
} from '@chakra-ui/react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import { BiRightArrow } from 'react-icons/bi'
import { ExperiencesList } from 'config/experience'
import {
  scrollReveal,
  scrollRevealReduced,
  hoverLift,
  hoverLiftReduced,
} from 'config/animations'

// Timeline verticale : remplace l'ancien système d'onglets (illisible en
// orientation horizontale sur mobile, scroll horizontal nécessaire). Chaque
// entrée se révèle individuellement à son entrée dans le viewport
// (scrollReveal), plutôt qu'en cascade groupée avec le titre de section —
// plus immersif sur une liste qui s'étend sur toute la hauteur de la page.
const ExperienceTimeline = () => {
  const { colorMode } = useColorMode()
  const shouldReduceMotion = useReducedMotion()

  const MotionFlex = motion(Flex)
  const MotionStack = motion(Stack)

  const itemVariants: Variants = shouldReduceMotion
    ? scrollRevealReduced
    : scrollReveal
  const hoverLiftTarget = (shouldReduceMotion ? hoverLiftReduced : hoverLift)
    .hover

  return (
    <Stack as="ol" spacing={0} width="100%" listStyleType="none">
      {ExperiencesList.map((company, idx) => {
        const isLast = idx === ExperiencesList.length - 1
        return (
          <MotionFlex
            as="li"
            key={company.name}
            align="stretch"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={itemVariants}
          >
            <Flex
              direction="column"
              align="center"
              flexShrink={0}
              mr={{ base: 4, md: 6 }}
            >
              <Box
                w={3}
                h={3}
                borderRadius="full"
                bg="accent.default"
                flexShrink={0}
                mt={2}
              />
              {!isLast && (
                <Box flex="1" width="2px" bg="border.subtle" my={2} />
              )}
            </Flex>

            <Box flex="1" pb={isLast ? 0 : { base: 8, md: 10 }}>
              <MotionStack
                spacing={4}
                bg="bg.surface"
                borderWidth="1px"
                borderColor="border.subtle"
                borderRadius={0}
                p={{ base: 4, md: 6 }}
                whileHover={hoverLiftTarget}
              >
                <HStack spacing={4} align="center">
                  <Image
                    src={
                      colorMode === 'dark'
                        ? company.logo.dark
                        : company.logo.light
                    }
                    alt={company.longName}
                    maxWidth="64px"
                    maxHeight="64px"
                    objectFit="contain"
                    fallback={<Skeleton height="64px" width="64px" />}
                  />
                  <Stack spacing={0}>
                    <Text as="h3" textStyle="subtitle">
                      {company.longName}
                    </Text>
                    <Text as="span" textStyle="label" color="text.tertiary">
                      {company.duration}
                    </Text>
                  </Stack>
                </HStack>

                <List spacing={3}>
                  {company.roles?.map((roleDesc, roleIdx) => (
                    <ListItem
                      key={`${company.name}-desc-${roleIdx}`}
                      fontSize="sm"
                      display="flex"
                      alignItems="flex-start"
                    >
                      <ListIcon
                        as={BiRightArrow}
                        color="accent.default"
                        mt={1}
                        flexShrink={0}
                      />
                      <Text as="span" variant="description">
                        {roleDesc}
                      </Text>
                    </ListItem>
                  ))}
                </List>
              </MotionStack>
            </Box>
          </MotionFlex>
        )
      })}
    </Stack>
  )
}

export default memo(ExperienceTimeline)
