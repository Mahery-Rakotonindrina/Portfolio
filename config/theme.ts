import { extendTheme, ColorMode } from '@chakra-ui/react'
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools'

interface IThemeMode {
  Light: ColorMode
  Dark: ColorMode
}

export const ThemeMode: IThemeMode = {
  Light: 'light',
  Dark: 'dark',
}

export const mobileBreakpointsMap = {
  base: true,
  md: true,
  lg: true,
  xl: false,
}

// Theme Config
const config = {
  initialColorMode: ThemeMode.Dark,
  useSystemColorMode: false,
}

// ---------------------------------------------------------------------------
// Design system — direction artistique "DEVELOPER.EXE" (US-002)
// Interfaces AAA/sci-fi minimalistes : fond quasi-noir à dominante bleutée,
// texte blanc cassé, un seul accent "bleu électrique". Contrastes vérifiés
// WCAG AA (ratios calculés — voir .claude/memory/designer.md pour le détail).
// ---------------------------------------------------------------------------

const colors = {
  black: '#121212', // jeton historique, toujours consommé tel quel par components/Menu
  night: {
    50: '#F4F6F9',
    100: '#E4E7ED',
    200: '#C7CCD6',
    300: '#A3A9B8',
    400: '#7D8699',
    500: '#565E6D',
    600: '#1C1F27', // bordures subtiles sur fond sombre
    700: '#15181F', // surfaces / cartes sur fond sombre
    800: '#101217',
    900: '#0B0D12', // fond "canvas" sombre — noir profond, teinte bleutée
  },
  accent: {
    50: '#EAF3FF',
    100: '#D2E4FF',
    200: '#A9CBFF',
    300: '#7FB1FF',
    400: '#4D9FFF', // accent principal dark mode — 7.14:1 sur night.900
    500: '#2F81FF',
    600: '#1456C9', // accent principal light mode — 5.82:1 sur gray.100
    700: '#0F4FBD',
    800: '#0D3E94',
    900: '#0A2F70',
  },
}

// Jetons sémantiques : la logique light/dark est centralisée ici une seule
// fois. Les composants pourront consommer `bg.canvas`, `accent.default`, etc.
// directement (sans refaire de useColorModeValue) au fil de leur migration
// (US-003 et suivantes) — aucun composant de section n'est modifié dans cette
// tâche.
const semanticTokens = {
  colors: {
    'bg.canvas': { default: 'gray.100', _dark: 'night.900' },
    'bg.surface': { default: 'white', _dark: 'night.700' },
    'border.subtle': { default: 'gray.200', _dark: 'night.600' },
    'text.primary': { default: 'gray.800', _dark: 'whiteAlpha.900' },
    'text.secondary': { default: 'gray.700', _dark: 'gray.400' },
    'text.tertiary': { default: '#595959', _dark: '#A6A6A6' },
    'accent.default': { default: 'accent.600', _dark: 'accent.400' },
    'accent.subtle': {
      default: 'rgba(20, 86, 201, 0.08)',
      _dark: 'rgba(77, 159, 255, 0.08)',
    },
  },
}

const styles = {
  global: () => ({
    body: {
      color: 'text.primary',
      bg: 'bg.canvas',
    },
  }),
}

const textVariants = {
  emphasis: () => ({
    color: 'accent.default',
  }),
  description: () => ({
    color: 'text.secondary',
  }),
  accent: () => ({
    color: 'accent.default',
  }),
  accentAlternative: () => ({
    color: 'text.tertiary',
  }),
}

// Échelle typographique — niveaux hero / titre / section / corps / label.
// Police d'affichage et de corps : Poppins (déjà chargée, poids 100 à 600 —
// voir pages/_document.tsx), conservée telle quelle : expressive, déjà en
// place, pas de nouvelle police pour les textes courants. Une police
// additionnelle, JetBrains Mono, est réservée aux éléments "HUD" (labels,
// repères de section, meta-infos) pour appuyer le concept .EXE sans devenir
// une deuxième police de lecture.
const fonts = {
  heading: 'Poppins, sans-serif',
  body: 'Poppins, sans-serif',
  mono: "'JetBrains Mono', monospace",
}

const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 600, // Poppins n'est chargé qu'au poids 600 max — éviter le faux-gras navigateur
}

const textStyles = {
  hero: {
    fontFamily: 'heading',
    fontWeight: 'semibold',
    fontSize: { base: '4xl', md: '6xl', xl: '7xl' },
    lineHeight: 'shorter', // 1.25
    letterSpacing: 'tight',
  },
  title: {
    fontFamily: 'heading',
    fontWeight: 'semibold',
    fontSize: { base: '3xl', md: '4xl' },
    lineHeight: 'shorter',
    letterSpacing: 'tight',
  },
  subtitle: {
    fontFamily: 'heading',
    fontWeight: 'medium',
    fontSize: { base: 'xl', md: '2xl' },
    lineHeight: 'short', // 1.375
  },
  body: {
    fontFamily: 'body',
    fontWeight: 'normal',
    fontSize: { base: 'md', md: 'lg' },
    lineHeight: 'tall', // 1.625
    maxW: 'contentMax',
  },
  label: {
    fontFamily: 'mono',
    fontWeight: 'medium',
    fontSize: 'xs',
    letterSpacing: 'widest',
    textTransform: 'uppercase',
  },
}

// Tailles de layout. La grille d'espacement reste l'échelle Chakra existante
// (base 4px : space 1 = 4px, 2 = 8px, 4 = 16px, 8 = 32px...) — aucune valeur
// hors échelle n'est introduite. Convention de rythme vertical à appliquer
// lors de l'implémentation des sections (US-003+) : py={{ base: 12, md: 16,
// xl: 24 }} entre sections, p={6} minimum pour une carte/bloc, gap={4}/{6}/{8}
// pour les grilles d'éléments.
const sizes = {
  contentMax: '65ch', // mesure de lecture confortable pour un paragraphe
  sectionMaxW: '1280px', // largeur max du contenu desktop (= breakpoint xl)
}

const theme = extendTheme({
  config,
  fonts,
  fontWeights,
  textStyles,
  colors,
  semanticTokens,
  sizes,
  styles,
  components: {
    Link: {
      baseStyle: () => ({
        color: 'accent.default',
      }),
      variants: {
        ...textVariants,
        description: () => ({
          color: 'text.secondary',
          _hover: {
            color: 'accent.default',
            textDecoration: 'none',
          },
        }),
      },
    },
    Text: {
      variants: textVariants,
    },
    Heading: {
      variants: textVariants,
    },
    Button: {
      variants: {
        outline: () => ({
          borderColor: 'accent.default',
        }),
        outlineAlternative: (props: StyleFunctionProps) => ({
          borderWidth: '1px',
          borderRadius: 0,
          borderColor: mode('#595959', 'whiteAlpha.500')(props),
          _hover: {
            backgroundColor: 'accent.subtle',
          },
        }),
      },
    },
    Icon: {
      variants: {
        accent: (props: StyleFunctionProps) => ({
          borderColor: mode('gray.800', 'gray.400')(props),
        }),
      },
    },
    Divider: {
      variants: {
        solid: (props: StyleFunctionProps) => ({
          borderColor: mode('gray.800', 'gray.400')(props),
          marginLeft: 'auto',
          marginRight: 'auto',
        }),
      },
    },
  },
})
export default theme
