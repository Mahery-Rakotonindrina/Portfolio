import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import theme from 'config/theme'
import FavIconProvider from 'components/Misc/FavIconProvider'
import SmoothScrollProvider from 'components/Misc/SmoothScrollProvider'

function KLSite({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <AnimatePresence mode="wait">
      <ChakraProvider theme={theme}>
        <FavIconProvider>
          <SmoothScrollProvider>
            <Component {...pageProps} />
          </SmoothScrollProvider>
        </FavIconProvider>
      </ChakraProvider>
    </AnimatePresence>
  )
}
export default KLSite
