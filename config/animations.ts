const DURATIONS = {
  VeryFast: 0.3,
  Fast: 0.6,
  Normal: 0.8,
  Slow: 1.2,
  VerySlow: 1.8,
}
const easing = [0.6, -0.05, 0.01, 0.99]

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATIONS.Fast,
      ease: easing,
    },
  },
}

const fadeInUpSlower = {
  initial: {
    y: 80,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATIONS.Normal,
      ease: easing,
    },
  },
}

const letterSpace = {
  initial: {
    opacity: 0,
  },
  animate: {
    letterSpacing: ['0px', '-10px', '0px'],
    opacity: 1,
    transition: {
      duration: DURATIONS.Slow,
      ease: easing,
    },
  },
}

const simpleOpacity = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: DURATIONS.Fast,
      ease: easing,
    },
  },
}

const scaleUp = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    opacity: [0, 1],
    scale: [1, 1.05, 1],
    transition: {
      duration: DURATIONS.VerySlow,
      ease: easing,
    },
  },
  lightMode: {
    opacity: [0, 1],
    scale: [0.99, 1.05, 1],
    transition: {
      duration: DURATIONS.VerySlow,
      ease: easing,
    },
  },
}

const menuAnim = {
  show: {
    y: 0,
    opacity: 1,
    transition: {
      ease: easing,
      duration: DURATIONS.VeryFast,
    },
  },
  hide: {
    opacity: 0,
    y: -100,
    transition: {
      ease: easing,
      duration: DURATIONS.VeryFast,
    },
  },
}

const avatarAnimation = {
  initial: {
    opacity: 0,
    y: 60,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATIONS.Fast,
      ease: easing,
    },
  },
  exit: {
    opacity: 0,
  },
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}
const galleryStagger = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

// ---------------------------------------------------------------------------
// Animations signature — direction "DEVELOPER.EXE" (US-002)
// 5 animations fortes maximum, documentées avec leur déclencheur et leur
// comportement sous prefers-reduced-motion. `useReducedMotion()` (Framer
// Motion) est un hook React : il ne peut pas être appelé depuis ce fichier de
// config. Chaque animation a donc une contrepartie "Reduced" à sélectionner
// au point d'usage, ex. :
//   const shouldReduceMotion = useReducedMotion()
//   <motion.div variants={shouldReduceMotion ? heroBootReduced : heroBoot} />
// Câblage réel dans les composants : US-003 et suivantes (hors scope ici).

// 1. heroBoot — entrée du Hero/Sidebar au chargement de la page.
//    Déclencheur : montage du composant (une fois).
//    Normal : fondu + légère montée (24px), enchaîné en cascade sur les
//    lignes de texte via `stagger`.
//    Reduced : fondu seul, sans décalage ni délai de cascade perceptible.
const heroBoot = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.Fast, ease: easing },
  },
}
const heroBootReduced = {
  initial: { opacity: 0, y: 0 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.01 } },
}

// 2. scrollReveal — apparition d'un bloc/section au scroll (whileInView).
//    Déclencheur : entrée dans le viewport, une seule fois.
//    Normal : fondu + montée de 32px.
//    Reduced : fondu seul, sans translation.
const scrollReveal = {
  initial: { opacity: 0, y: 32 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.Fast, ease: easing },
  },
}
const scrollRevealReduced = {
  initial: { opacity: 0, y: 0 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.01 } },
}

// 3. hoverLift — survol/focus d'une carte interactive (projet, expérience).
//    Déclencheur : hover ou focus clavier.
//    Normal : légère élévation (translateY -4px), 300ms.
//    Reduced : aucune translation ; le changement de couleur/bordure au focus
//    (non concerné par prefers-reduced-motion) reste le seul signal.
const hoverLift = {
  rest: { y: 0, transition: { duration: DURATIONS.VeryFast, ease: easing } },
  hover: {
    y: -4,
    transition: { duration: DURATIONS.VeryFast, ease: easing },
  },
}
const hoverLiftReduced = {
  rest: { y: 0 },
  hover: { y: 0 },
}

// 4. navIndicator — déplacement de l'indicateur de section active du menu.
//    Déclencheur : changement de section active (scroll-spy).
//    Normal : glissement animé (layoutId) vers l'item actif, 300ms.
//    Reduced : disparition/réapparition en fondu, sans glissement de position.
const navIndicatorTransition = { duration: DURATIONS.VeryFast, ease: easing }
const navIndicatorReducedTransition = { duration: 0.01 }

// 5. modalEnter — ouverture d'un overlay (ex. modal des compétences).
//    Déclencheur : ouverture/fermeture de l'overlay.
//    Normal : fondu + léger zoom (scale 0.96 → 1) qui confirme l'ouverture.
//    Reduced : fondu seul, sans changement d'échelle.
const modalEnter = {
  initial: { opacity: 0, scale: 0.96 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATIONS.VeryFast, ease: easing },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: DURATIONS.VeryFast },
  },
}
const modalEnterReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.01 } },
  exit: { opacity: 0, transition: { duration: 0.01 } },
}

export {
  DURATIONS,
  easing,
  fadeInUp,
  fadeInUpSlower,
  letterSpace,
  stagger,
  galleryStagger,
  simpleOpacity,
  menuAnim,
  scaleUp,
  avatarAnimation,
  heroBoot,
  heroBootReduced,
  scrollReveal,
  scrollRevealReduced,
  hoverLift,
  hoverLiftReduced,
  navIndicatorTransition,
  navIndicatorReducedTransition,
  modalEnter,
  modalEnterReduced,
}
