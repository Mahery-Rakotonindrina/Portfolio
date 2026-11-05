import { memo, useCallback, useEffect, useState, MouseEvent } from 'react'
import {
  Container,
  Link,
  Flex,
  Box,
  IconButton,
  useColorMode,
  useBreakpointValue,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { motion, useCycle, useReducedMotion, Variants } from 'framer-motion'
import styles from './styles.module.css'
import MobileMenu from './toggle'
import { ThemeMode, mobileBreakpointsMap } from 'config/theme'
import { easing, menuAnim } from 'config/animations'
import useScrollDirection, { ScrollDirection } from 'hooks/useScrollDirection'

// Hissé au niveau module (pas dans le corps du composant) : `Navigation` a son
// propre état local (`useCycle` pour le menu mobile) — si `MotionContainer`
// était recréé à chaque render, React traiterait la nouvelle identité comme un
// composant différent et démonterait/remonterait tout l'arbre à chaque
// ouverture/fermeture du menu mobile (même piège que GetInTouch, US-007).
const MotionContainer = motion(Container)

// Contrepartie `prefers-reduced-motion` de `menuAnim` (config/animations.ts) :
// fondu seul, sans glissement vertical. `y: 0` est explicite (pas omis) dans
// les deux états — `menuAnim.hide.y` vaut -100 ; si `y` n'est jamais la cible
// d'une transition vers `show`, Framer Motion laisse la valeur courante
// inchangée au lieu de la réinitialiser, ce qui peut bloquer le menu hors-champ
// (même piège que `mobileMenuVariantsReduced`, components/Menu/index.tsx).
const menuAnimReduced: Variants = {
  show: { opacity: 1, y: 0, transition: { duration: 0.01 } },
  hide: { opacity: 0, y: 0, transition: { duration: 0.01 } },
}

interface NavItem {
  label: string
  href: string
  // Cas particulier historique : sur desktop, "A propos" pointe vers `#`
  // (retour en haut de page, où Sidebar + About sont déjà côte à côte) plutôt
  // que vers `#aboutMe` — comportement existant conservé tel quel.
  desktopHref?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'A propos', href: '#aboutMe', desktopHref: '#' },
  { label: 'Expériences', href: '#jobs' },
  { label: 'Réalisations', href: '#works' },
  { label: 'Contact', href: '#contact' },
]

const Navigation = () => {
  const { toggleColorMode, colorMode } = useColorMode()
  const [isOpen, toggleOpen] = useCycle(false, true)
  const isMobile = useBreakpointValue(mobileBreakpointsMap)

  // `useReducedMotion()` (Framer Motion) résout `window.matchMedia(...)` de
  // façon SYNCHRONE dès le premier appel client, y compris pendant le rendu
  // d'hydratation lui-même (pas seulement après un effet) — contrairement au
  // SSR, qui n'a pas de `window` et retombe donc toujours sur la variante
  // normale. `MotionContainer` combine `variants` ET un `style` prop littéral
  // calculé sur le même élément : la variante "hide" de `menuAnimReduced`
  // fixe `y: 0` explicitement (nécessaire pour éviter le bug précédent de
  // cette US — un menu mobile bloqué hors-écran), ce qui fait calculer à
  // Framer un `transform: none` concret pendant ce premier rendu client — une
  // valeur de `style` différente de celle rendue par le SSR
  // (`transform: translateY(-100px)`), d'où le mismatch d'hydratation React.
  // Pour les autres sections (Sidebar, Detail, Experience...), la variante
  // `*Reduced` OMET `y` plutôt que de le fixer à 0 : Framer ne calcule alors
  // aucune propriété `transform` du tout pour ce premier rendu, donc aucune
  // valeur de `style` divergente à comparer — rien à avertir.
  // Correctif : ne piloter `MotionContainer` qu'avec une valeur locale qui
  // vaut `false` au premier rendu client (identique au SSR, par construction
  // de `useState`), mise à jour seulement après montage via un effet. Le menu
  // "rattrape" la bonne variante un instant après le montage — sans jamais
  // rendre, y compris en hydratation, une valeur différente du SSR.
  const prefersReducedMotion = useReducedMotion()
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  useEffect(() => {
    setShouldReduceMotion(Boolean(prefersReducedMotion))
  }, [prefersReducedMotion])

  const IsDark = colorMode === ThemeMode.Dark
  const Icon = IsDark ? SunIcon : MoonIcon
  const onMenuItemClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.stopPropagation()
      if (isMobile) {
        toggleOpen()
      }
    },
    [isMobile, toggleOpen]
  )
  const scrollDirection = useScrollDirection()

  return (
    <>
      <Box
        display={{ base: 'flex', xl: 'none' }}
        alignItems="center"
        paddingTop={1}
        className={styles.menuBar}
        zIndex={100}
        top="3%"
      >
        <IconButton
          aria-label="Color Mode"
          variant="ghost"
          icon={<Icon />}
          boxShadow="none"
          onClick={toggleColorMode}
          padding={0}
        />
        <MobileMenu isDarkMode={IsDark} toggle={toggleOpen} isOpen={isOpen} />
      </Box>

      <MotionContainer
        width="100%"
        // US-009 (bug trouvé par le tester) : un fond translucide
        // (`rgba(..., 0.9)`/`rgba(..., 0.95)`) laissait le contenu de la
        // Sidebar visible en transparence derrière le menu mobile/tablette
        // ouvert, superposé aux 4 liens de navigation. Vérifié pixel par
        // pixel (lecture `getImageData` sur la capture réelle, pas juste à
        // l'œil) : même à 0.98-0.99 d'opacité, un résidu de quelques unités
        // RGB restait mesurable ET visible sur une capture agrandie — seul
        // un fond totalement opaque élimine la fuite. `bg.canvas` (jeton
        // sémantique déjà utilisé par le reste du site, `config/theme.ts`)
        // est exactement la couleur qui était précédemment codée en dur en
        // rgba ici, sans le canal alpha devenu inutile.
        backgroundColor="bg.canvas"
        maxWidth={{ base: '100%', sm: '100%', lg: '50%', xl: '60%' }}
        className={styles.menu}
        right={{
          lg:
            !isMobile && scrollDirection === ScrollDirection.Down
              ? '2%'
              : '3.5%',
        }}
        initial="hide"
        animate={(!isMobile || isOpen) && 'show'}
        style={{
          width:
            !isMobile && scrollDirection === ScrollDirection.Down
              ? '12%'
              : '100%',
          top: !isOpen && isMobile ? '-100vh' : undefined,
          opacity: !isOpen && isMobile ? 0 : undefined,
          left: isOpen && isMobile ? 0 : undefined,
        }}
        borderColor={isOpen && isMobile && 'accent.default'}
        borderBottomWidth={isOpen && isMobile && '1px'}
        paddingBottom={isOpen && isMobile && '1px'}
        ease={easing}
        variants={shouldReduceMotion ? menuAnimReduced : menuAnim}
        marginTop={0}
        paddingTop={1}
        as="nav"
      >
        <Flex
          justifyContent={{ base: 'center', lg: 'flex-end' }}
          direction={{
            base: 'column',
            lg: scrollDirection === ScrollDirection.Down ? 'column' : 'row',
          }}
          paddingX={{ base: '', sm: '10', lg: '0' }}
          paddingY={{
            base: '10',
            lg: scrollDirection === ScrollDirection.Down ? '10' : '3',
          }}
          height={{ base: '100vh', lg: 'auto' }}
          paddingRight="0"
          paddingBottom={isMobile ? 10 : '0'}
          onClick={() => isMobile && toggleOpen()}
        >
          {NAV_ITEMS.map((item) => (
            <Box
              key={item.href}
              width={{ base: '100%', lg: 'auto' }}
              textAlign={{ base: 'center', lg: 'left' }}
              marginY={{ base: 2, lg: 0 }}
            >
              <Link
                href={isMobile ? item.href : item.desktopHref ?? item.href}
                rel="noreferrer"
                onClick={onMenuItemClick}
                display="inline-block"
                textStyle="label"
                textDecoration="none"
                color="text.secondary"
                padding={2}
                marginX={2}
                className={styles.blogBtn}
                _focusVisible={{ boxShadow: 'none', color: 'accent.default' }}
              >
                {item.label}
              </Link>
            </Box>
          ))}
          {!isMobile && (
            <Box>
              <IconButton
                marginX={1}
                aria-label="Color Mode"
                variant="ghost"
                icon={<Icon />}
                boxShadow="none"
                onClick={toggleColorMode}
              />
            </Box>
          )}
        </Flex>
      </MotionContainer>
    </>
  )
}

export default memo(Navigation)
