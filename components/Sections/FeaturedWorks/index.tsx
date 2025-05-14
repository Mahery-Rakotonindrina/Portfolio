import { memo } from 'react'
import {
  Heading,
  Text,
  Stack,
  Grid,
  GridItem,
  useBreakpointValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import FeaturedCard from './FeaturedCard'
import { fadeInUpSlower, galleryStagger } from 'config/animations'
import { mobileBreakpointsMap } from 'config/theme'
const MotionGrid = motion(Grid)
const MotionGridItem = motion(GridItem)

const FeaturedWorksSection = () => {
  const isMobile = useBreakpointValue(mobileBreakpointsMap)
  return (
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
        Mon best-of 💥
      </Heading>
      <Text variant="description">
        Qu’ils soient nés en freelance, en entreprise ou dans mes nuits
        d’inspiration . . . <br /> voici un petit best-of de ce que j’ai
        construit avec passion (et parfois un peu de caféine).
      </Text>

      <MotionGrid
        templateRows="repeat(1, 1fr)"
        templateColumns="repeat(6, 1fr)"
        gap={{ base: 5, md: 6 }}
        variants={galleryStagger}
      >
        <MotionGridItem colSpan={6} variants={fadeInUpSlower}>
          <FeaturedCard
            idx={1}
            title="Becquet!"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDISAczkXoOFk4kQLgIKPB9pz4VeeWGUZaLQ&s"
            description="Becquet est un site e-commerce développé avec Next.js pour le frontend et C# .NET côté backend.
              C’est l’un des projets les plus ambitieux sur lesquels j’ai travaillé : il a mobilisé un large éventail de compétences techniques,
              allant de Next.js, WCF, GraphQL, .NET, jusqu’à l’utilisation avancée de procédures stockées."
            height={{ base: '130px', md: '225px', '2xl': '300px' }}
            ctaUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDISAczkXoOFk4kQLgIKPB9pz4VeeWGUZaLQ&s"
            objectPosition="right 20%"
            isMobile={isMobile}
          />
        </MotionGridItem>

        <MotionGridItem colSpan={6} variants={fadeInUpSlower}>
          <FeaturedCard
            idx={2}
            title="GIPROD Androy"
            description="En mission freelance chez Diapen'tech, j’ai développé une application de gestion des ressources,
            territoires, projets et membres, avec intégration de cartes interactives via ArcGIS.
            Les technos utilisées : Laravel 9 & Vue.js."
            src="/giprod.jpg"
            height={{ base: '130px', md: '225px', '2xl': '300px' }}
            ctaUrl="/giprod.jp"
            isMobile={isMobile}
          />
        </MotionGridItem>

        <MotionGridItem colSpan={6} variants={fadeInUpSlower}>
          <FeaturedCard
            idx={3}
            title="E-Kaly"
            description="Un de mes projets personnels en cours, lancé avec Symfony 5 en backend et Next.js en frontend.
            Initialement dédié à la gestion des commandes en restauration, il a évolué pour inclure la gestion des livreurs
            (disponibilité, affectation) et un système de contact direct entre restaurants et livreurs via le web. Je prévois
            également de développer une application mobile pour ce projet à l'avenir."
            src="/works/agora.webp"
            height={{ base: '130px', md: '225px', '2xl': '300px' }}
            ctaUrl="https://dev.agora-school.com"
            objectPosition="right 20%"
            isMobile={isMobile}
          />
        </MotionGridItem>

        <MotionGridItem colSpan={6} variants={fadeInUpSlower}>
          <FeaturedCard
            idx={4}
            title="GESCOM"
            description="Mon tout premier projet d’envergure, réalisé dans le cadre de mon stage de fin d'études
            chez SIDINA (Groupe MANAO),pour l’obtention de mon Master 2.
            On a conçu et développé l'application de A à Z avec CodeIgniter 4 et jQuery pour les animations et
            interactions JavaScript."
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4QmHWzGjMU4y_gXyntQfWQQD93cQPklwA1w&s"
            height={{ base: '10px', md: '225px', '2xl': '300px' }}
            ctaUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4QmHWzGjMU4y_gXyntQfWQQD93cQPklwA1w&s"
            isMobile={isMobile}
          />
        </MotionGridItem>
      </MotionGrid>
    </Stack>
  )
}

export default memo(FeaturedWorksSection)
