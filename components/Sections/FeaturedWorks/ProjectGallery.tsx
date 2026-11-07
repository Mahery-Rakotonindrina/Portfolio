import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FeaturedCard, { isExternalProjectLink } from './FeaturedCard'
import ProjectDetailModal from './ProjectDetailModal'
import styles from './styles.module.css'
import { Work } from 'config/works'

export type ProjectGalleryProps = {
  works: Work[]
  // Conteneur englobant titre + description + galerie (FeaturedWorks/
  // index.tsx) — c'est LUI qui est pinné en entier par l'effet ci-dessous
  // (bugfix titre/texte qui défilaient hors écran pendant le scrub), pas
  // seulement `wrapper`. `wrapper`/`track` restent la seule source des
  // mesures de distance de scrub (getScrollDistance), inchangé.
  pinContainerRef: RefObject<HTMLDivElement>
}

type Selection = { work: Work; imageLayoutId: string }

// Seuil "desktop" du pin+scrub GSAP — aligné sur le breakpoint `xl` de
// Chakra (80em = 1280px), déjà la convention "desktop" du reste du site
// (`mobileBreakpointsMap` dans config/theme.ts, Detail.tsx/US-015,
// SkillsRelationMap/US-016). En dessous : swipe horizontal natif
// (scroll-snap CSS, voir styles.module.css), aucun scroll-jacking.
const DESKTOP_QUERY = '(min-width: 80em)'

// US-018 — galerie horizontale pilotée par le scroll (DESIGN_PROPOSAL_V2 §6).
// Le markup (titres/descriptions réels des 4 projets, via FeaturedCard) est
// identique quel que soit le mode — seule la mise en page (CSS) et le pin+
// scrub (GSAP, client-only, posé ici en useEffect) diffèrent. Jamais de
// `next/dynamic(ssr:false)` sur ce composant : le texte réel reste présent
// dans le HTML généré côté serveur, seule la mécanique de scroll est une
// amélioration progressive ajoutée après hydratation.
const ProjectGallery = ({ works, pinContainerRef }: ProjectGalleryProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selection, setSelection] = useState<Selection | null>(null)

  const handleOpenDetail = useCallback(
    (work: Work, imageLayoutId: string) => {
      setSelection({ work, imageLayoutId })
      onOpen()
    },
    [onOpen]
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }
    // Pin + scroll-jacking entièrement désactivés sous prefers-reduced-motion
    // (critère d'acceptation) : aucune instance ScrollTrigger n'est même
    // créée. Le filet de sécurité visuel (grille statique 2x2) est géré en
    // CSS pur (styles.module.css, `@media (prefers-reduced-motion: reduce)`)
    // donc sans dépendre du moindre état React/hydratation — vérifié même
    // avant que cet effet ne tourne.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const wrapper = wrapperRef.current
    const track = trackRef.current
    const pinContainer = pinContainerRef.current
    if (!wrapper || !track || !pinContainer) {
      return undefined
    }

    // Idempotent (GSAP ignore un second enregistrement) — ne dépend pas de
    // l'ordre de montage par rapport à SmoothScrollProvider (les effets des
    // descendants s'exécutent avant ceux des ancêtres), donc pas de
    // supposition implicite sur ce composant distant.
    gsap.registerPlugin(ScrollTrigger, Draggable)

    // Bugfix (remonté par le PO, "parfois ça ne s'affiche pas") — 2e passe.
    // `ScrollTrigger` ne se réévalue nativement que sur
    // visibilitychange/DOMContentLoaded/load/resize (gsap/ScrollTrigger.js,
    // `_autoRefresh`) + un unique refresh différé d'une frame après la
    // création d'un trigger pinné (`_queueRefreshAll`, commentaire du code
    // source GSAP lui-même : "some frameworks dynamically load content and
    // we can't rely on window's load/DOMContentLoaded events"). Un premier
    // correctif (retiré ici) ne surveillait que le chargement des 4 images de
    // cette galerie pour déclencher un refresh supplémentaire — confirmé
    // insuffisant : toutes ces réévaluations (natives ou ciblées sur les
    // images) restent des évènements PONCTUELS, qui ne se reproduisent
    // jamais. Mesuré par instrumentation directe (`onRefresh` temporaire) :
    // `wrapper.clientWidth`/`track.scrollWidth` peuvent encore changer une
    // fois toutes ces occasions déjà consommées (ex. un léger réajustement
    // de layout peu après le montage, ou tout autre élément de la page qui
    // continue d'affecter le rendu après coup) — si ça arrive après la
    // DERNIÈRE réévaluation ponctuelle disponible, rien ne corrige plus jamais
    // la distance de scrub pour le reste de la session.
    //
    // Solution générale : un `ResizeObserver` sur `wrapper` ET `track` (les
    // deux éléments dont les dimensions pilotent directement `getScrollDistance()`
    // ci-dessous) pendant toute la durée de vie du composant, pas une
    // vérification ponctuelle — contrairement à tout ce qui précède, il ne
    // s'épuise jamais après un premier déclenchement, donc couvre n'importe
    // quelle cause (y compris une cause encore inconnue aujourd'hui), sans
    // avoir à lister chaque déclencheur possible. Débounce léger (120ms) pour
    // éviter une tempête de refresh pendant un resize fluide. Pas de risque de
    // boucle : `ScrollTrigger.refresh()` relit les dimensions existantes, il
    // ne modifie pas lui-même la taille de `wrapper`/`track` (le pin ne fait
    // que figer leur position, pas leur largeur), donc aucun déclenchement en
    // cascade de l'observer par son propre refresh.
    let refreshTimeoutId: number | undefined
    const scheduleRefresh = () => {
      if (refreshTimeoutId !== undefined) {
        window.clearTimeout(refreshTimeoutId)
      }
      refreshTimeoutId = window.setTimeout(() => {
        ScrollTrigger.refresh()
      }, 120)
    }
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(scheduleRefresh)
        : null
    resizeObserver?.observe(wrapper)
    resizeObserver?.observe(track)

    const mm = gsap.matchMedia()
    mm.add(DESKTOP_QUERY, () => {
      const getScrollDistance = () =>
        Math.max(track.scrollWidth - wrapper.clientWidth, 0)

      // Sur mobile/tablette (hors de cette media query), le CSS de base
      // (styles.module.css) gère déjà le swipe natif scroll-snap — ces
      // overrides ne s'appliquent qu'au breakpoint desktop, et sont
      // automatiquement annulés par `mm.revert()`/le contexte GSAP si la
      // fenêtre redescend sous ce seuil (testé réellement au resize).
      gsap.set(wrapper, { overflow: 'hidden' })
      gsap.set(track, { overflowX: 'visible' })

      const tween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          // Bugfix (titre + description qui défilaient hors écran avant la
          // fin du scrub) : le pin cible désormais `pinContainer` (titre +
          // description + `wrapper`, voir FeaturedWorks/index.tsx) et non
          // plus seulement `wrapper` — tout le bloc reste fixe à l'écran
          // pendant tout le défilement horizontal, pas seulement la galerie.
          // `start`/`end`/`getScrollDistance()` restent basés sur les
          // largeurs de `track`/`wrapper` (inchangé) : seul l'élément pinné
          // change, pas la distance de scrub elle-même.
          trigger: pinContainer,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          scrub: true,
          pin: true,
          // Piège trouvé en vérification (US-018) : GSAP désactive
          // silencieusement `pinSpacing` par défaut dès que le PARENT de
          // l'élément pinné est `display: flex` (ScrollTrigger.js,
          // commentaire explicite "if the parent is display: flex, don't
          // apply pinSpacing by default") — toujours notre cas ici, le
          // parent de `pinContainer` reste un `Stack` Chakra (flex) de
          // FeaturedWorksSection. `'padding'` = la valeur par défaut réelle
          // de GSAP hors contexte flex (même ScrollTrigger.js, branche
          // ternaire par défaut) — on la force explicitement ici.
          pinSpacing: 'padding',
          invalidateOnRefresh: true,
        },
      })

      // Drag souris horizontal (desktop) : la souris ne doit JAMAIS piloter
      // `track.x` directement en parallèle du tween ci-dessus — les deux se
      // disputeraient la position et désynchroniseraient dès le prochain
      // scroll. Technique retenue (pattern GSAP documenté pour rendre une
      // section pin+scrub draggable) : un `Draggable` est posé sur un proxy
      // DOM détaché (jamais inséré dans la page, jamais rendu) plutôt que sur
      // `track` lui-même — seul son delta de déplacement (`this.x`) est lu,
      // pour piloter la position de scroll de la PAGE via
      // `scrollTrigger.scroll(valeurEnPx)`. Le tween existant se charge alors
      // de retraduire ce scroll en `x` sur `track`, exactement comme il le
      // fait déjà pour un scroll/wheel normal — aucune désynchronisation
      // possible avec un scroll qui suit.
      const scrollTriggerInstance = tween.scrollTrigger
      const dragProxy = document.createElement('div')
      let dragStartScroll = 0
      let dragStartX = 0

      const draggables = Draggable.create(dragProxy, {
        type: 'x',
        trigger: wrapper,
        // Un clic sur un élément naturellement cliquable (le bouton
        // transparent "Voir le détail" de FeaturedCard, ou le lien "Voir le
        // projet") doit continuer à ouvrir la modale normalement — pas être
        // intercepté comme un petit drag. `dragClickables: false` fait
        // explicitement sauter toute logique de drag quand la pression
        // démarre sur un <button>/<a> (Draggable.js, test `isClickable`),
        // laissant le clic natif se produire.
        dragClickables: false,
        // Affordance visuelle : curseur grab au repos, grabbing pendant le
        // drag (ce sont déjà les valeurs par défaut de Draggable, explicites
        // ici pour documenter l'intention).
        cursor: 'grab',
        activeCursor: 'grabbing',
        onPress(this: Draggable) {
          dragStartScroll = scrollTriggerInstance?.scroll() ?? 0
          dragStartX = this.x
        },
        onDrag(this: Draggable) {
          scrollTriggerInstance?.scroll(dragStartScroll - (this.x - dragStartX))
        },
      })

      return () => {
        draggables.forEach((instance) => instance.kill())
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    return () => {
      mm.revert()
      resizeObserver?.disconnect()
      if (refreshTimeoutId !== undefined) {
        window.clearTimeout(refreshTimeoutId)
      }
    }
  }, [pinContainerRef])

  const showProjectLink = selection
    ? isExternalProjectLink(selection.work.ctaUrl, selection.work.src)
    : false

  return (
    <>
      <Box
        ref={wrapperRef}
        className={styles.wrapper}
        // Posé en permanence (pas seulement en mode swipe mobile) : au repos
        // (desktop avant montage JS, ou si l'effet ci-dessus ne s'exécute
        // jamais) ce conteneur se comporte comme une zone de scroll natif
        // classique — Lenis ne doit pas intercepter les événements wheel/
        // touch qui lui sont destinés. Une fois le pin desktop actif,
        // `overflow: hidden` (posé ci-dessus) ne laisse plus rien à faire
        // défiler nativement à l'intérieur, donc cet attribut devient un
        // no-op pour ce mode — sans risque de bloquer le scroll vertical de
        // la page (qui reste piloté par Lenis au niveau window, pas ici).
        data-lenis-prevent
      >
        <Box ref={trackRef} className={styles.track}>
          {works.map((work, idx) => (
            <FeaturedCard
              key={work.title}
              work={work}
              idx={idx + 1}
              onOpenDetail={handleOpenDetail}
            />
          ))}
        </Box>
      </Box>

      <ProjectDetailModal
        work={selection?.work ?? null}
        imageLayoutId={selection?.imageLayoutId ?? null}
        isOpen={isOpen}
        onClose={onClose}
        showProjectLink={showProjectLink}
        shouldReduceMotion={prefersReducedMotion}
      />
    </>
  )
}

export default ProjectGallery
