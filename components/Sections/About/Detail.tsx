import { memo } from 'react'
import {
  Text,
  List,
  ListItem,
  ListIcon,
  Icon,
  SimpleGrid,
  Box,
  Tooltip,
  Stack,
} from '@chakra-ui/react'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import { GiCoffeePot } from 'react-icons/gi'
import { IoMdOpen } from 'react-icons/io'
import { Skills } from 'config/skills'
import {
  scrollReveal,
  scrollRevealReduced,
  hoverLift,
  hoverLiftReduced,
} from 'config/animations'

type IDetail = {
  onOpen(): void
}

const Detail = ({ onOpen }: IDetail) => {
  const shouldReduceMotion = useReducedMotion()
  const currentYear = new Date().getFullYear()
  const professionalYears = currentYear - 2019

  const MotionStack = motion(Stack)
  const MotionText = motion(Text)
  const MotionSimpleGrid = motion(SimpleGrid)

  // scrollReveal : entrée en cascade au scroll (US-002), désactivée (fondu
  // seul) si prefers-reduced-motion. Même pattern que heroBoot/Sidebar
  // (US-003), déclencheur différent (whileInView plutôt que mount).
  const itemVariants: Variants = shouldReduceMotion
    ? scrollRevealReduced
    : scrollReveal
  const parentVariants: Variants = {
    animate: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } },
  }
  const hoverLiftTarget = (shouldReduceMotion ? hoverLiftReduced : hoverLift)
    .hover

  return (
    <MotionStack
      width={{ base: '100%', lg: '70%' }}
      spacing={{ base: 6, xl: 8 }}
      as="section"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={parentVariants}
    >
      <MotionText as="h4" textStyle="title" variants={itemVariants}>
        Ce que je fais.
      </MotionText>
      <MotionText
        variant="description"
        textStyle="body"
        variants={itemVariants}
      >
        Cela fait maintenant {professionalYears} ans que je code{' '}
        professionnellement, avec une spécialisation en <b>Frontend</b>{' '}
        notamment en React et Next.js. J&apos;interviens principalement sur{' '}
        <b>la conception d&apos;interfaces modernes et performantes</b>, l&apos;{' '}
        <b>l&apos;architecture front-end, l&apos;ntégration d&apos;APIs</b>, et{' '}
        <Text as="span" variant="emphasis">
          la <b>gestion de logiques métier côté client</b>
        </Text>
        <br /> <br />
        Voici quelques technologies qui font partie de mon quotidien, mon petit{' '}
        <Tooltip
          label="Le thé ? Uniquement en cas d’urgence. 😄"
          aria-label="I hate Tea!"
          hasArrow
        >
          <Text as="span" variant="emphasis" textDecorationLine="line-through">
            thé
          </Text>
        </Tooltip>{' '}
        café <Icon as={GiCoffeePot} color="accent.default" />.
      </MotionText>

      <MotionSimpleGrid columns={2} spacing={4} variants={itemVariants}>
        <List spacing={3}>
          {Skills.frontend.map((skill) => (
            <ListItem
              key={skill.name}
              fontSize="sm"
              display="flex"
              alignItems="center"
            >
              <ListIcon as={skill.icon} color="accent.default" fontSize="2em" />
              {skill.name}
            </ListItem>
          ))}
        </List>
        <List spacing={3}>
          {Skills.backend.map((skill) => (
            <ListItem
              key={skill.name}
              fontSize="sm"
              display="flex"
              alignItems="center"
            >
              <ListIcon as={skill.icon} color="accent.default" fontSize="2em" />
              {skill.name}
            </ListItem>
          ))}
        </List>
        <Box>
          <MotionText
            as="button"
            variant="emphasis"
            textStyle="label"
            textAlign="left"
            onClick={onOpen}
            whileHover={hoverLiftTarget}
          >
            Mon attirail de développeur <Icon as={IoMdOpen} />
          </MotionText>
        </Box>
      </MotionSimpleGrid>
    </MotionStack>
  )
}

export default memo(Detail)
