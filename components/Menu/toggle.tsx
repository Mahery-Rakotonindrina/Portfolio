/* eslint-disable react/no-multi-comp */
import * as React from 'react'
import { motion, SVGMotionProps } from 'framer-motion'

// Ids partagés avec `Navigation.tsx` : `MOBILE_NAV_ID` pour `aria-controls`
// (pointe vers le conteneur de nav mobile) et `MOBILE_MENU_TOGGLE_ID` pour
// rendre le focus au bouton hamburger après une fermeture au clavier
// (Escape) — un seul point de vérité plutôt que deux chaînes dupliquées.
export const MOBILE_NAV_ID = 'mobileNav'
export const MOBILE_MENU_TOGGLE_ID = 'mobileMenuToggle'

type PathProps = SVGMotionProps<SVGPathElement> & { isDarkMode?: boolean }

// `isDarkMode` ne doit jamais atterrir sur l'élément DOM `motion.path` (React
// lève un warning "does not recognize the 'isDarkMode' prop" sinon) — on le
// consomme ici pour calculer `stroke`, puis on ne propage que le reste
// (`pathProps`), qui correspond bien à de vrais attributs SVG/motion.
const Path = ({ isDarkMode, ...pathProps }: PathProps) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke={isDarkMode ? 'hsl(240, 100%, 94%)' : 'hsl(0, 0%, 7%)'}
    strokeLinecap="round"
    {...pathProps}
  />
)

export const MenuToggle = ({
  toggle,
  isOpen,
  isDarkMode = false,
}: {
  toggle(): void
  isOpen: boolean
  isDarkMode?: boolean
}) => (
  <button
    id={MOBILE_MENU_TOGGLE_ID}
    type="button"
    aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
    aria-expanded={isOpen}
    aria-controls={MOBILE_NAV_ID}
    onClick={toggle}
    style={{
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg width="23" height="23" viewBox="0 0 23 18">
      <Path
        isDarkMode={isDarkMode}
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5' },
          open: { d: 'M 3 16.5 L 17 2.5' },
        }}
      />
      <Path
        isDarkMode={isDarkMode}
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        isDarkMode={isDarkMode}
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346' },
          open: { d: 'M 3 2.5 L 17 16.346' },
        }}
      />
    </svg>
  </button>
)

const MobileMenu = ({
  isOpen,
  toggle,
  isDarkMode = false,
}: {
  isOpen: boolean
  isDarkMode: boolean
  toggle(): void
}) => (
  <motion.nav
    initial={false}
    animate={isOpen ? 'open' : 'closed'}
    style={{
      display: 'flex',
      alignItems: 'center',
    }}
  >
    {/* <motion.div className="background" variants={sidebar} /> */}
    <MenuToggle
      toggle={() => toggle()}
      isOpen={isOpen}
      isDarkMode={isDarkMode}
    />
  </motion.nav>
)

export default MobileMenu
