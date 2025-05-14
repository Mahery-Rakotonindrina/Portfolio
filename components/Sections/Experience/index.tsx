import { memo } from 'react'
import { Heading, Text, Stack } from '@chakra-ui/react'
import ExperienceTab from './ExperienceTab'
const DetailSection = () => (
  <Stack
    width={{ base: '99%', lg: '60%', xl: '75%' }}
    height="100%"
    spacing={{ base: 6, xl: 8 }}
  >
    <Heading
      size="2xl"
      style={{
        fontVariantCaps: 'small-caps',
      }}
    >
      Parcours professionnel.
    </Heading>
    <Text variant="description">
      Depuis 2019, j’ai eu la chance de collaborer avec plusieurs entreprises
      m’ont permis de relever de beaux défis et d’affiner mes compétences, aussi
      bien humaines que techniques. <br />
      Chacune de ces expériences a contribué à façonner le développeur que je
      suis aujourd’hui, et garde une place particulière dans mon parcours.
    </Text>

    <ExperienceTab />
  </Stack>
)

export default memo(DetailSection)
