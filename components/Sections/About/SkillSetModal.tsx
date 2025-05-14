/* eslint-disable react/no-multi-comp */
import {
  Heading,
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
  useColorModeValue,
  Divider,
} from '@chakra-ui/react'
import styles from './styles.module.css'
import { Skill, Skills, splitSkills } from 'config/skills'

type ISkillSetModal = {
  isOpen: boolean
  onClose(): void
}

const SkillList = ({
  title,
  columns,
}: {
  title: string
  columns: Skill[][]
}) => {
  const emphasis = useColorModeValue('teal.500', 'cyan.200')
  const [colOne, colTwo = []] = columns
  return (
    <>
      <Heading as="div" size="sm" paddingBottom={1} variant="description">
        {title}
      </Heading>
      <Divider marginBottom={4} />
      <SimpleGrid columns={2} spacing={4} paddingBottom={6}>
        <List spacing={3}>
          {colOne.map((item) => (
            <ListItem
              key={item.name}
              fontSize="small"
              display="flex"
              alignItems="center"
            >
              <ListIcon as={item.icon} color={emphasis} fontSize="2em" />
              {item.name}
            </ListItem>
          ))}
        </List>
        <List spacing={3}>
          {colTwo.map((item) => (
            <ListItem
              key={item.name}
              fontSize="small"
              display="flex"
              alignItems="center"
            >
              <ListIcon as={item.icon} color={emphasis} fontSize="2em" />
              {item.name}
            </ListItem>
          ))}
        </List>
      </SimpleGrid>
    </>
  )
}
const SkillSetModal = ({ isOpen, onClose }: ISkillSetModal) => {
  const backendCols = splitSkills(Skills.backend)
  const frontendCols = splitSkills(Skills.frontend)
  const dataBaseCols = splitSkills(Skills.database)
  const uiFrameWorkCols = splitSkills(Skills['ui frameworks'])
  const productivityCols = splitSkills(Skills['productivity boost'])
  const mobileCols = splitSkills(Skills.mobile)
  const desktopCols = splitSkills(Skills.desktop)
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ensemble de mes compétences</ModalHeader>
        <ModalCloseButton />
        <ModalBody className={styles.skillModal}>
          <SkillList title="Backend " columns={backendCols} />
          <SkillList title="Frontend " columns={frontendCols} />
          <SkillList title="Base de donnée" columns={dataBaseCols} />
          <SkillList title="Ui Frameworks" columns={uiFrameWorkCols} />
          <SkillList title="Mobile Development" columns={mobileCols} />
          <SkillList title="Desktop App" columns={desktopCols} />
          <SkillList title="Productivity boosts" columns={productivityCols} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SkillSetModal
