/* eslint-disable react/no-multi-comp */
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react'
import { useReducedMotion } from 'framer-motion'
import styles from './styles.module.css'
import { Skill, SkillCategory, Skills, splitSkills } from 'config/skills'
import { modalEnter, modalEnterReduced } from 'config/animations'

type ISkillSetModal = {
  isOpen: boolean
  onClose(): void
}

// Intitulé affiché pour chaque catégorie de config/skills.ts. Le typage
// Record<SkillCategory, string> force une erreur de compilation si une
// catégorie est ajoutée sans intitulé : plus aucune compétence ne peut être
// oubliée du modal (bug pré-existant corrigé ici — "cicd" et "games"
// n'étaient jamais rendus, voir .claude/memory/developer.md).
const categoryLabels: Record<SkillCategory, string> = {
  backend: 'Backend',
  frontend: 'Frontend',
  cicd: 'CI/CD & Cloud',
  database: 'Base de donnée',
  'ui frameworks': 'Ui Frameworks',
  'productivity boost': 'Productivity boosts',
  mobile: 'Mobile Development',
  games: 'Game Dev',
  desktop: 'Desktop App',
}

const SkillList = ({
  title,
  columns,
}: {
  title: string
  columns: Skill[][]
}) => {
  const [colOne, colTwo = []] = columns
  return (
    <>
      <Text as="div" textStyle="label" color="text.secondary" paddingBottom={2}>
        {title}
      </Text>
      <Divider marginBottom={4} borderColor="border.subtle" />
      <SimpleGrid columns={2} spacing={4} paddingBottom={6}>
        <List spacing={3}>
          {colOne.map((item) => (
            <ListItem
              key={item.name}
              fontSize="sm"
              display="flex"
              alignItems="center"
            >
              <ListIcon as={item.icon} color="accent.default" fontSize="2em" />
              {item.name}
            </ListItem>
          ))}
        </List>
        <List spacing={3}>
          {colTwo.map((item) => (
            <ListItem
              key={item.name}
              fontSize="sm"
              display="flex"
              alignItems="center"
            >
              <ListIcon as={item.icon} color="accent.default" fontSize="2em" />
              {item.name}
            </ListItem>
          ))}
        </List>
      </SimpleGrid>
    </>
  )
}
const SkillSetModal = ({ isOpen, onClose }: ISkillSetModal) => {
  const shouldReduceMotion = useReducedMotion()
  // Object.keys() renvoie toujours string[] en TypeScript : cast sûr ici
  // puisque Skills est typé `{ [key in SkillCategory]: Skill[] }` — toute
  // catégorie ajoutée à config/skills.ts apparaît donc automatiquement ici.
  const categories = Object.keys(Skills) as SkillCategory[]

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        bg="bg.surface"
        borderWidth="1px"
        borderColor="border.subtle"
        borderRadius={0}
        motionProps={{
          initial: 'initial',
          animate: 'animate',
          exit: 'exit',
          // modalEnter : fondu + léger zoom à l'ouverture (US-002), réduit à
          // un simple fondu si prefers-reduced-motion.
          variants: shouldReduceMotion ? modalEnterReduced : modalEnter,
        }}
      >
        <ModalHeader>
          <Text as="h2" textStyle="subtitle">
            Ensemble de mes compétences
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles.skillModal}>
          {categories.map((category) => (
            <SkillList
              key={category}
              title={categoryLabels[category]}
              columns={splitSkills(Skills[category])}
            />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SkillSetModal
