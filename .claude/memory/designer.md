# Mémoire — Designer

> Lu au début de chaque tâche de design, mis à jour à la fin. Concis : seulement ce qui reste utile pour les tâches futures.

## Direction artistique "DEVELOPER.EXE" (US-002, 2026-11-04)

Interfaces AAA/sci-fi minimalistes, élégantes, pro — pas cyberpunk caricatural, pas de pixels, pas de gradients/effets lumineux excessifs. Tous les tokens vivent dans `config/theme.ts` (source de vérité du design system) et `config/animations.ts`. Aucun composant de section (Hero/Sidebar, About, Experience, Projects, Contact) n'a été modifié — fondations uniquement, le câblage réel vient avec US-003 et suivantes.

### Palette (codes hex, contrastes calculés — pas estimés)
- `colors.night` (fond/surfaces sombres) : 900 `#0B0D12` (canvas, remplace `#121212` dans `styles.global` — différence de ~7 valeurs RGB, imperceptible, pas de régression avec `components/Menu` qui garde le jeton `black` `#121212` inchangé), 700 `#15181F` (surface/carte), 600 `#1C1F27` (bordure subtile, décorative — pas soumise au seuil 3:1 UI).
- `colors.accent` (bleu électrique, un seul accent dans tout le projet) : 400 `#4D9FFF` (dark mode) et 600 `#1456C9` (light mode).
- Contrastes vérifiés (ratio calculé via formule WCAG relative luminance) :
  - Texte principal dark `whiteAlpha.900` sur `night.900` : **17.36:1**.
  - Texte secondaire dark `gray.400` sur `night.900` : **8.62:1**.
  - Accent dark `#4D9FFF` sur `night.900` : **7.14:1** (texte et UI, largement > 4.5 et > 3).
  - Accent dark sur surface `night.700` : **6.53:1**.
  - Texte principal light `gray.800` sur `gray.100` : **10.64:1**.
  - Texte secondaire light `gray.700` sur `gray.100` : **6.68:1** (hiérarchie plus marquée qu'avant, qui réutilisait `gray.800` pour la description).
  - Accent light `#1456C9` sur `gray.100` : **5.82:1**.
  - `text.tertiary` (`#595959` light / `#A6A6A6` dark, inchangés) : 6.22:1 et 7.98:1.
- **Bug corrigé au passage** : `black.400` était référencé dans l'ancien `theme.ts` (variant `accent` des Text/Heading, bordure du Button `outline`) alors que `colors.black` est une chaîne plate `'#121212'`, pas une échelle — `black.400` ne résolvait à rien en light mode. Remplacé par le jeton sémantique `accent.default`, qui résout correctement dans les deux modes.
- Un seul accent dans toute l'app : les variants `emphasis` et `accent` (Text/Heading) pointent désormais tous les deux vers `accent.default` — plus de divergence teal/cyan vs accent cassé.
- Jetons sémantiques ajoutés (`semanticTokens.colors`) pour que les futurs composants arrêtent de refaire du `useColorModeValue` partout : `bg.canvas`, `bg.surface`, `border.subtle`, `text.primary`, `text.secondary`, `text.tertiary`, `accent.default`, `accent.subtle` (fond teinté accent à 8% d'opacité, remplace les rgba hardcodés de `Button.outlineAlternative`).
- Pas touché : `colors.black` (toujours consommé tel quel par `components/Menu/index.tsx`), variants `Icon.accent` et `Divider.solid` (gris neutres, sans rapport avec l'accent de marque malgré leur nom).
- `shadows.outline` (focus ring) **non modifié** : l'accent dark `#4D9FFF` ne passe qu'à 2.42:1 sur le fond light (`gray.100`) — sous le seuil 3:1 UI. Rendre le ring mode-aware est possible (semantic token `shadows.outline`) mais pas fait ici par prudence/scope — à reprendre avec vérification visuelle réelle (Playwright, tabulation clavier) plutôt qu'en pur calcul.

### Typographie
- Police de corps/titre : **Poppins** (déjà chargée via `pages/_document.tsx`, poids 100–600 non-italique/italique) — conservée, pas de nouvelle police pour le texte courant.
- Police additionnelle ajoutée : **JetBrains Mono** (poids 400/500/600, chargée dans la même requête Google Fonts que Poppins dans `_document.tsx`), réservée aux éléments "HUD" : labels/eyebrows de section, repères/index de nav, meta-infos — jamais pour du texte de lecture. Choix justifié par le concept ".EXE"/dev-tool, cohérent avec la règle "pas de 3e police" (ici 2 familles, rôles strictement séparés : `fonts.heading`/`fonts.body` = Poppins, `fonts.mono` = JetBrains Mono).
- `fontWeights.bold` remappé à `600` (au lieu de 700 par défaut) : Poppins n'est chargé qu'au poids 600 max, un `fontWeight="bold"` demandait un poids jamais téléchargé (faux-gras navigateur). `FeaturedCard.tsx` utilise déjà `fontWeight="bold"` — il rend maintenant le vrai 600 chargé.
- `theme.textStyles` (consommables via la prop `textStyle`, à utiliser dans les prochaines US) :
  - `hero` : Poppins semibold, `{ base: '4xl', md: '6xl', xl: '7xl' }`, `lineHeight: shorter` (1.25), `letterSpacing: tight`.
  - `title` (titre de section) : semibold, `{ base: '3xl', md: '4xl' }`, mêmes line-height/letter-spacing que hero.
  - `subtitle` : medium, `{ base: 'xl', md: '2xl' }`, `lineHeight: short` (1.375).
  - `body` : normal, `{ base: 'md', md: 'lg' }`, `lineHeight: tall` (1.625), `maxW: contentMax` (65ch — mesure de lecture).
  - `label` (HUD) : JetBrains Mono medium, `fontSize: xs`, `letterSpacing: widest`, `uppercase`.
  - Les tailles (`4xl`...`7xl`) et line-heights (`shorter`/`short`/`tall`) sont les tokens Chakra par défaut — aucune valeur arbitraire introduite.

### Grille d'espacement
- Pas de nouvelle échelle : on reste sur l'échelle Chakra existante (`space`, base 4px : `1`=4px, `2`=8px, `4`=16px, `8`=32px...). Aucune valeur hors échelle.
- Convention de rythme à appliquer lors de l'implémentation des sections (US-003+, pas encore câblée) :
  - Espacement vertical entre sections : `py={{ base: 12, md: 16, xl: 24 }}` (48/64/96px).
  - Padding interne minimum d'une carte/bloc : `p={6}` (24px).
  - Gaps de grille : `gap={4}` (serré), `gap={6}`/`gap={8}` (normal/large).
- Deux tokens de layout ajoutés dans `theme.sizes` : `contentMax` (`65ch`, mesure de lecture pour `textStyles.body`) et `sectionMaxW` (`1280px`, largeur max de contenu desktop = breakpoint `xl`).

### Animations (5 signatures max, dans `config/animations.ts`)
Tous les exports existants (`fadeInUp`, `fadeInUpSlower`, `letterSpace`, `stagger`, `galleryStagger`, `simpleOpacity`, `menuAnim`, `scaleUp`, `avatarAnimation`, `easing`, `DURATIONS`) sont **inchangés** — ils sont consommés par `Sidebar`, `FeaturedWorks`, `Navigation`, `Logo`, `Avatar`, `FadeWhenVisible`, hors scope de cette tâche. Les 5 animations signature sont des ajouts purs :

| Nom | Déclencheur | Comportement normal | Comportement `prefers-reduced-motion` |
|---|---|---|---|
| `heroBoot` / `heroBootReduced` | Montage du Hero (une fois) | Fondu + montée 24px, en cascade sur les lignes | Fondu seul, sans décalage ni cascade |
| `scrollReveal` / `scrollRevealReduced` | Entrée dans le viewport (scroll, une fois) | Fondu + montée 32px | Fondu seul |
| `hoverLift` / `hoverLiftReduced` | Hover/focus clavier sur une carte | Élévation -4px, 300ms | Pas de translation (le changement de couleur/bordure au focus reste, hors scope reduced-motion) |
| `navIndicatorTransition` / `navIndicatorReducedTransition` | Changement de section active (scroll-spy) | Glissement animé (penser `layoutId`), 300ms | Transition quasi instantanée (0.01s), pas de glissement perceptible |
| `modalEnter` / `modalEnterReduced` | Ouverture/fermeture d'un overlay (ex. modal compétences) | Fondu + scale 0.96→1 | Fondu seul, sans scale |

`useReducedMotion()` (Framer Motion) est un hook React : il ne peut pas vivre dans `config/animations.ts`. Le choix normal/reduced se fait au point d'usage dans le composant (à câbler en US-003+), ex. `variants={shouldReduceMotion ? heroBootReduced : heroBoot}`.

### Cohérence desktop/mobile (note de concept, pas d'implémentation)
- La palette et l'accent unique restent identiques à toutes les largeurs — pas de palette "mobile" séparée.
- `textStyles.hero`/`title` dégradent leur taille par breakpoint (`4xl`→`7xl`) plutôt que de garder une taille fixe compressée — cohérent avec le projet existant qui a déjà une logique mobile dédiée (`mobileBreakpointsMap` dans `theme.ts`, breakpoints `base`/`md`/`lg` = mobile, `xl` = desktop).
- Les éléments "HUD" (labels mono, repères de section) sont le genre de détail qui doit soit rester lisible, soit disparaître en premier sur mobile (jamais tasser un label HUD en dessous d'une taille lisible) — à trancher composant par composant en US-003+.
- `hoverLift` est un hover : sans effet sur tactile par nature (pas de `:hover` réel) — la carte doit donc rester identifiable comme interactive sans dépendre du survol (bordure/accent visible par défaut, pas seulement au hover) — point à vérifier visuellement quand les cartes Projects/Experience seront construites.
- Les animations d'entrée (`heroBoot`, `scrollReveal`) utilisent les mêmes durées à toutes les largeurs : pas de logique distincte mobile/desktop nécessaire, `prefers-reduced-motion` prime sur la largeur d'écran.

### Limite connue de cette tâche
Les outils `mcp__playwright__*` n'étaient **pas chargés** dans cette session (nécessite un redémarrage de Claude Code). Le changement de `styles.global` (fond/texte via jetons sémantiques, `night.900` au lieu de `#121212`) a été vérifié par build (`npm run build`) + lint (`npm run lint`), tous deux verts, mais **pas vérifié visuellement en navigateur réel**. À confirmer par un agent avec Playwright actif avant de considérer le rendu global validé (différence de teinte attendue très faible, risque jugé faible, mais pas observé).

## Patterns de layout validés
- (à compléter au fil des tâches — US-002 est fondations uniquement, pas de layout de section encore construit)

## Proposition V2 "Boot Sequence" (2026-11-05, DESIGN_PROPOSAL_V2.md — pas encore implémentée)

L'utilisateur a rejeté le résultat US-002→US-010 : "toujours un site classique avec des sections statiques", retour au restylage visuel sans vraie expérience interactive. Proposition écrite complète dans `DESIGN_PROPOSAL_V2.md` (racine du projet) — **aucun composant modifié**, uniquement un document de proposition. À lire en entier avant toute implémentation future ; résumé ci-dessous pour retrouver le contexte sans tout relire.

**Gardé** : palette `night`/`accent`, Poppins + JetBrains Mono, concept "DEVELOPER.EXE", les 4 ancres réelles + `components/Menu` existant (ne pas remplacer, déjà accessible/testé), toutes les vraies données sans invention, règle dure zéro métrique de compétence inventée, `prefers-reduced-motion` prioritaire, le `position: fixed` déjà existant de la Sidebar sur `xl`.

**Changé radicalement** :
- Scroll natif → scroll à inertie global via **Lenis** (nouvelle dépendance, fondation du reste).
- Chaque section a un mécanisme de scroll **distinct** (pas de `scrollReveal` générique répété 4 fois) : Hero = séquence de boot au chargement (scramble texte + grille parallaxe souris, ambiant en permanence car Sidebar fixe) ; About = balayage `clip-path` scrubbed avec `position: sticky` court (Framer Motion `useScroll`/`useTransform`, pas de GSAP) ; Experience = ligne de timeline qui se dessine proportionnellement au scroll (`pathLength`/`scaleY`, pas de pin) ; Skills = overlay plein écran "carte de relations" radiale (desktop) / accordéon (mobile), remplace la petite Modal Chakra, toujours binaire (aucun niveau/%) ; Projects = galerie horizontale en pin+scrub (**GSAP + ScrollTrigger**, seule section qui le justifie) avec morph `layoutId` carte→détail, fallback mobile en `scroll-snap` natif ; Contact = scène de clôture avec forme 3D filaire ambiante (**React Three Fiber + drei**, lazy/`ssr:false`, montée seulement au scroll jusqu'à la section — seul usage 3D du site, concentré).
- Fil conducteur global : cadre HUD + jauge de progression ("SCÈNE 02/05"), complément du Menu (pas un remplacement) — donne enfin un usage réel aux tokens `navIndicatorTransition`/`navIndicatorReducedTransition` posés en US-002 et jamais câblés (dette documentée en US-008).
- Curseur personnalisé desktop (`hover:hover and pointer:fine` uniquement) : anneau à ressort (Framer Motion `useSpring`), états contextuels (grossit + label "VOIR"/"+" selon la cible, jamais générique), effet magnétique limité à 3 familles de cibles (icônes sociales Hero, nœuds Skills, repères de la jauge) — pas généralisé à tout élément cliquable.

**Dépendances nouvelles proposées (3 seulement, chacune justifiée par un seul usage)** : Lenis (scroll global), GSAP+ScrollTrigger (Projects uniquement), React Three Fiber+drei (Contact uniquement, lazy). Tout le reste (Hero, About, Experience, Skills, HUD, curseur) reste Framer Motion pur, déjà installé. Décision d'installation réelle = au developer après vérification de faisabilité/perf, pas pré-tranchée ici.

**Équivalents mobile systématiquement pensés** (pas de simple "on désactivera") : pas de parallaxe souris (pas de pointeur) mais le reste de l'effet (scramble, balayage, ligne qui se dessine) survit souvent identique ; pin desktop → scroll-snap natif ou déclenchement simple au viewport ; curseur custom → badges d'affordance statiques toujours visibles (pas cachés derrière un survol qui n'existe pas) ; magnétisme → absent (pas de sens sur tap).

**`prefers-reduced-motion` pensé section par section** (pas un futur correctif) : Lenis désactivé (retour scroll natif) ; Hero sans scramble (fondu simple) ni parallaxe ; About sans scrub/clip-path directionnel (fondu seul, pas de sticky) ; Experience ligne déjà tracée au repos ; Skills sans pouls/spring (crossfade quasi instantané) ; Projects **fallback intégral** vers la grille statique 2×2 déjà existante (US-006), pas de pin du tout ; Contact canvas 3D **non monté** (pas juste figé) ; curseur personnalisé **entièrement désactivé**, retour curseur système.

**Risques déjà notés pour le developer** : perf/Core Web Vitals de GSAP/R3F (code-splitting strict, rien sur le chemin critique du Hero), scroll-jacking Projects à tester réellement (molette/trackpad/tactile, pas en lecture de code), `ScrollTrigger.matchMedia` à vérifier au resize réel, interaction Lenis + ancres du Menu (`lenis.scrollTo`) à vérifier explicitement, ne pas régresser le focus clavier visible en ajoutant le curseur custom, repartir des acquis a11y déjà validés (focus trap/Escape/aria) pour l'overlay Skills plutôt que les refaire.

## Choix de design et pourquoi
- Un seul accent "bleu électrique" dans toute l'app (`accent.default`), jamais une 2e couleur d'accent — cohérent avec la checklist `ui-ux-pro` ("pas plus de 3 couleurs d'accent") et avec l'esprit HUD minimaliste demandé.
- JetBrains Mono ajoutée uniquement pour les éléments HUD (jamais le texte courant) pour éviter de diluer l'identité typographique existante (Poppins) tout en servant le concept ".EXE".
- Jetons sémantiques (`semanticTokens`) introduits maintenant, avant toute migration de composant, pour que US-003+ n'ait plus besoin de réécrire du `useColorModeValue('teal.500', 'cyan.200')` partout — un seul endroit (`theme.ts`) pour changer l'accent à l'avenir.
