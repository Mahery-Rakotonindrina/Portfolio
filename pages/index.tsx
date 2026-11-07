/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Grid,
  GridItem,
  Stack,
  Box,
  Link,
  useBreakpointValue,
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import OpenGraphHead from 'components/Misc/OpenGraphHead'
import ProgressHUD from 'components/Misc/ProgressHUD'
import FadeInLayout from 'components/Layout/FadeWhenVisible'
import Menu from 'components/Menu'
import Sidebar from 'components/Sidebar'
import Avatar from 'components/Avatar'
import About from 'components/Sections/About'
import Experience from 'components/Sections/Experience'
import FeaturedWorks from 'components/Sections/FeaturedWorks'
import ScrollMore from 'components/Misc/ScrollMore'
// These are on bottom sections so no need to render it instantly

const GetInTouch = dynamic(() => import('components/Sections/GetInTouch'))

const Portfolio = (): JSX.Element => {
  const sideBarPadding = useBreakpointValue({ base: '5', md: '8', lg: '14' })
  const mainContent = useBreakpointValue({
    base: '5',
    md: '14',
    lg: '14',
    xl: 0,
  })
  const paddTop = useBreakpointValue({ base: '20', sm: 20, md: 20 })
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS_ID}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_ANALYTICS_ID}');
        `}
      </Script>
      <OpenGraphHead />
      {/* Accessibilité : premier élément focusable de la page, invisible tant
          qu'il n'a pas le focus clavier — permet de sauter directement au
          contenu sans traverser la nav/Sidebar à chaque Tab. Absent du site
          jusqu'ici (revue PO). */}
      <Link
        href="#main-content"
        position="absolute"
        left="-9999px"
        top="0"
        width="1px"
        height="1px"
        overflow="hidden"
        zIndex="popover"
        padding={3}
        bg="bg.surface"
        color="text.primary"
        borderWidth="1px"
        borderColor="accent.default"
        _focus={{
          left: 4,
          top: 4,
          width: 'auto',
          height: 'auto',
          overflow: 'visible',
        }}
      >
        Aller au contenu principal
      </Link>
      <Menu />
      <ProgressHUD />
      <Grid
        id="mainGrid"
        templateColumns={{
          base: 'repeat(1, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(5, 1fr)',
        }}
        templateRows={{
          sm: 'repeat(1, 0)',
          lg: 'repeat(2, 1fr)',
        }}
        gap={4}
      >
        <GridItem
          padding={sideBarPadding}
          marginTop={paddTop}
          rowSpan={2}
          colSpan={{ base: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
          display="flex"
          alignContent="center"
          as="div"
          flexDirection={'row'}
        >
          <Sidebar />
        </GridItem>
        <GridItem
          id="main-content"
          as="main"
          padding={mainContent}
          rowSpan={2}
          colSpan={{ base: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
          // US-015 : `overflow: hidden` sur CET ancêtre désactive totalement
          // `position: sticky` pour tout descendant (CSS en fait le
          // "conteneur de scroll" de référence, qui ne défile jamais
          // lui-même puisque c'est `window` qui scrolle, pas lui — le
          // verrouillage sticky de Detail.tsx ne collait donc jamais,
          // confirmé par mesure réelle). Limité à `xl` (seul breakpoint où
          // le verrouillage s'active) ; `base`/withdrawn breakpoints
          // gardent la protection anti-débordement horizontal d'origine.
          // Vérifié sans régression de largeur (scrollWidth === clientWidth)
          // à 375/768/1440px après ce changement.
          overflow={{ base: 'hidden', xl: 'visible' }}
        >
          <Stack w="100" spacing={24}>
            <FadeInLayout>
              <Box
                id="aboutMe"
                className="contentRow"
                minH={{ lg: '100vh' }}
                display="flex"
                // US-015 : au verrouillage scrubbed de Detail.tsx (desktop,
                // hors reduced-motion), la colonne About devient très haute
                // (sticky-lock ~250vh) ; `flex-start` évite que l'Avatar
                // (sibling plus court) se retrouve centré au milieu de cette
                // hauteur verrouillée (quasi hors-écran pendant le lock) —
                // décision technique à valider par le designer/PO si le
                // rendu ne convient pas.
                alignItems={{ base: 'center', xl: 'flex-start' }}
                paddingTop={{ base: 0, lg: 20, xl: 0 }}
                paddingBottom={{ base: 12, lg: 0 }}
                flexDirection={{
                  base: 'column-reverse',
                  lg: 'row',
                }}
              >
                <About />
                <Avatar />
              </Box>
            </FadeInLayout>
            <FadeInLayout>
              <Box
                id="jobs"
                className="contentRow"
                paddingTop={{ base: 0, lg: 20, xl: 0 }}
                paddingBottom={{ base: 12, lg: 10 }}
                paddingX={0}
                flexDirection={'row'}
              >
                <Experience />
              </Box>
            </FadeInLayout>
            {/* threshold=0 : voir le commentaire dans FadeWhenVisible.tsx —
                ce wrapper englobe le pin-spacer GSAP de ProjectGallery
                (US-018), potentiellement très haut, qui rend le seuil 30%
                par défaut mathématiquement inatteignable à certaines
                tailles de fenêtre. */}
            <FadeInLayout threshold={0}>
              <Box
                id="works"
                className="contentRow"
                paddingTop={{ base: 0, lg: 20, xl: 20 }}
                paddingBottom={{ base: 12, lg: 10 }}
                paddingX={0}
                flexDirection={'row'}
              >
                <FeaturedWorks />
              </Box>
            </FadeInLayout>
            <FadeInLayout>
              <Box
                id="contact"
                className="contentRow"
                paddingTop={{ base: 0, lg: 20, xl: 20 }}
                paddingX={0}
                flexDirection={'row'}
              >
                <GetInTouch />
              </Box>
            </FadeInLayout>
          </Stack>
        </GridItem>
      </Grid>
      <ScrollMore />
    </>
  )
}

export default Portfolio
