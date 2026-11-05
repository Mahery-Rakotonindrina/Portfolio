import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import theme from 'config/theme'
import FavIconProvider from 'components/Misc/FavIconProvider'
import SmoothScrollProvider from 'components/Misc/SmoothScrollProvider'
import CustomCursor from 'components/Misc/CustomCursor'

function KLSite({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <AnimatePresence mode="wait">
      <ChakraProvider theme={theme}>
        <FavIconProvider>
          <SmoothScrollProvider>
            <Component {...pageProps} />
          </SmoothScrollProvider>
        </FavIconProvider>
        {/* US-020 : montée une seule fois, globalement — se rend `null`
            d'elle-même tant que le curseur personnalisé n'est pas activé
            (tactile/prefers-reduced-motion), cf. CustomCursor.tsx. */}
        <CustomCursor />
      </ChakraProvider>
    </AnimatePresence>
  )
}
export default KLSite
