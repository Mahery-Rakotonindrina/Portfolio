import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, useAnimation } from 'framer-motion'
import { fadeInUpSlower } from 'config/animations'

type FadeInWhenVisibleProps = {
  children: React.ReactNode
  // Bugfix (remonté par le PO, section Projects entièrement vide à
  // certaines tailles de fenêtre) : `threshold` est une fraction de la
  // SURFACE de l'élément observé qui doit être visible simultanément pour
  // déclencher l'animation (`react-intersection-observer` compare
  // explicitement `intersectionRatio >= threshold`, contrairement à
  // `isIntersecting` seul — voir commentaire dans sa propre source,
  // "browsers can't agree on how to use it"). Pour un enfant de hauteur
  // normale, 30 % reste toujours atteignable. Mais `<Box id="works">`
  // (pages/index.tsx) contient le pin-spacer GSAP de ProjectGallery
  // (US-018), haut de plusieurs milliers de pixels à certaines largeurs —
  // la fraction maximale visible simultanément y est plafonnée à
  // `hauteur_viewport / hauteur_élément`, parfois mathématiquement sous la
  // barre des 30 % (confirmé : 1080/3698 ≈ 29 % à 1920×1080), rendant le
  // seuil historique inatteignable et l'élément bloqué à `opacity: 0` pour
  // toujours (`once` implicite ici : rien ne réinitialise `controls` une
  // fois lancé). D'où ce prop optionnel, par défaut inchangé (0.3) pour ne
  // pas affecter les 3 autres sections (`aboutMe`/`jobs`/`contact`, hauteur
  // normale, jamais concernées) — seul l'appel pour `#works` le réduit à 0.
  threshold?: number
}

const FadeInWhenVisible = ({
  children,
  threshold = 0.3,
}: FadeInWhenVisibleProps) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold,
  })

  useEffect(() => {
    if (inView) {
      controls.start('animate')
    }
  }, [controls, inView])

  return (
    <motion.div
      style={{ margin: 0 }}
      ref={ref}
      animate={controls}
      initial="initial"
      variants={fadeInUpSlower}
    >
      {children}
    </motion.div>
  )
}

export default FadeInWhenVisible
