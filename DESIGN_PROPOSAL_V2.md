# Proposition de refonte V2 — "DEVELOPER.EXE : Boot Sequence"

> Document de proposition uniquement. Aucun composant n'a été modifié. Objectif : répondre au retour explicite de l'utilisateur — la V1 (US-002 à US-010) a changé les couleurs/typos/détails visuels mais pas l'expérience : "toujours un site classique avec des sections statiques". Cette V2 change la mécanique de navigation et le comportement de chaque section, pas seulement leur habillage.

## 0. Ce qu'on garde, ce qu'on change radicalement

**On garde** (fondations déjà validées, ne pas tout recommencer) :
- Palette `night`/`accent` (bleu électrique unique), Poppins + JetBrains Mono, le concept "DEVELOPER.EXE".
- Les 4 ancres réelles (`#aboutMe`, `#jobs`, `#works`, `#contact`) et le composant `Menu` existant (accessible, testé — US-008/US-010) comme navigation principale.
- Toutes les vraies données (`config/experience.tsx`, `config/skills.ts`, `config/works.ts`, `config/sidebar.ts`) affichées intégralement, sans invention.
- La règle dure : aucune métrique de compétence inventée (pas de %, pas de niveau).
- `prefers-reduced-motion` comme priorité absolue sur toute nouvelle animation.
- Sur desktop (`xl`, 1280px+), la Sidebar reste en `position: fixed` (comportement déjà en place dans `components/Sidebar/index.tsx`) — le panneau "Hero" reste visible en permanence pendant que le contenu principal défile à côté. C'est une base idéale pour la suite : la séquence de boot du Hero ne se "perd" jamais au scroll sur vrai desktop.

**On change radicalement** :
- Le scroll natif du navigateur devient un scroll à inertie piloté (Lenis) — ça change la *sensation* physique de naviguer sur tout le site, pas juste visuellement.
- Chaque section cesse d'être un bloc statique qui "apparaît en fondu" (`scrollReveal` partout = exactement le symptôme dénoncé). Chaque section a désormais un **mécanisme de scroll distinct**, choisi pour son contenu réel, pas un pattern générique répété.
- Introduction d'un fil conducteur visuel unique et persistant : un cadre HUD + une jauge de progression ("SCÈNE 02/05") qui donne enfin un vrai rôle aux tokens `navIndicatorTransition`/`navIndicatorReducedTransition` posés en US-002 et jamais câblés (US-008 l'a documenté comme dette assumée).
- Un curseur personnalisé desktop avec de vraies micro-interactions contextuelles (pas un rond générique).
- Une scène de clôture (Contact) avec une pièce 3D (React Three Fiber), concentrée à un seul endroit du site.

---

## 1. Composition et mécanique de navigation

Le site reste **une seule page** (pas de multi-pages/transitions de route Next.js — il n'y a rien d'autre à faire transiter, et en inventer serait hors-sujet par rapport au contenu réel existant). Ce qui change, c'est la mécanique à l'intérieur de cette page unique.

### 1.1 Scroll à inertie global (Lenis)
Le scroll natif est remplacé par un scroll lissé/amorti (Lenis) sur l'ensemble du site. C'est la fondation de tout le reste : sans lui, les scènes scrubbed (voir Experience/About/Projects ci-dessous) ont un rendu saccadé parce que l'évènement `scroll` natif arrive par paquets irréguliers. Lenis émet une position de scroll continue à chaque frame, ce qui rend les animations liées au scroll fluides.
- **Desktop** : actif pleinement, synchronisé avec le ticker GSAP (nécessaire pour la section Projects, voir 4.5).
- **Mobile/tactile** : Lenis reste actif mais avec un amortissement réduit (lerp plus proche de 1, donc plus proche du scroll natif) — le scroll tactile natif (momentum iOS/Android) est déjà bon, on ne veut pas le combattre ni désynchroniser le geste de swipe du rendu (risque de "lag" perçu si l'amorti est trop fort sur tactile).
- **`prefers-reduced-motion`** : Lenis désactivé, retour au scroll natif du navigateur pur et simple. Un défilement "amorti" est lui-même une forme de mouvement non désiré pour une partie des utilisateurs sensibles — pas de compromis ici, coupure nette.

### 1.2 Scènes à mécanique propre, pas de pin partout
Chaque section garde son `id` d'ancre actuel et son ordre. Mais au lieu d'un seul motif ("fade + translateY au whileInView") répété 4 fois, chaque scène a sa propre mécanique :

| Scène | Mécanique de scroll | Pin (verrouillage du scroll) ? |
|---|---|---|
| Hero/Sidebar | Séquence de boot au chargement (une fois), ambiante en permanence sur desktop (sidebar fixe) | Non — pas de pin, juste une scène toujours visible |
| About | Scroll scrubbed court (texte qui se révèle par bandes au fil du scroll) | Oui, bref (desktop uniquement) |
| Experience | Ligne de timeline qui se dessine proportionnellement au scroll | Non — pas de pin, juste un tracé lié au scroll |
| Skills (modal/overlay) | Pas de scroll — interaction de clic/tap sur une carte de relations | N/A (overlay plein écran, pas une scène de scroll) |
| Projects | Scroll vertical converti en défilement horizontal pendant la traversée de la galerie | Oui (desktop uniquement — voir 4.5) |
| Contact | Scène de clôture, pas de pin, élément 3D ambiant | Non |

Utiliser le pin sur **seulement 1 des 5 scènes réelles de scroll** (Projects, le cas qui le justifie le mieux — galerie immersive à grandes images) et un pin court sur About (texte éditorial) évite l'écueil inverse : un site où *tout* est scroll-jacké devient fatigant et désorientant (et relève du même reproche "effet générique" que des fades répétés). La variété de mécanique *par section* est le vrai changement demandé, pas la présence de pin partout.

### 1.3 Le fil conducteur : cadre HUD + jauge de progression
Un cadre fin (1px, `border.subtle`) à 16px des bords de l'écran avec 4 petits coins en `accent.default` à opacité réduite (style "viseur"/HUD de jeu), **desktop uniquement** (sur mobile l'espace est trop précieux — remplacé par une simple barre fine en haut de l'écran).
- Une jauge de progression le long du bord droit (desktop) ou en haut (mobile) : un trait de 2px qui se remplit au fur et à mesure du scroll à travers les 5 scènes.
- 5 repères (ticks) le long de la jauge, un par scène, numérotés `01`–`05` en JetBrains Mono, le repère de la scène active allumé en `accent.default`. Chaque repère est cliquable et atteignable au clavier (scroll vers l'ancre correspondante) — un **complément** à la nav existante (`components/Menu`), pas un remplacement : le Menu reste la navigation accessible de référence, déjà testée et validée (US-008/US-010), on ne prend aucun risque de régression dessus.
- C'est enfin l'usage réel des tokens `navIndicatorTransition`/`navIndicatorReducedTransition` (US-002, jamais câblés — dette documentée dans `BACKLOG.md` US-008).
- **Mobile** : barre fine en haut (pas de cadre ni de coins — trop dense sur un petit écran), même logique de remplissage, pas de ticks cliquables individuels (zone tactile trop petite à 5 reprises sur une barre de quelques px de haut) — la navigation par ancre reste uniquement via le Menu hamburger sur mobile.
- **`prefers-reduced-motion`** : le remplissage de la jauge n'est plus une transition animée mais un saut instantané à la valeur courante ; les repères changent de couleur sans effet de pulsation/lueur.

**Technique** : Framer Motion (déjà en place) pour la jauge et les repères — aucune nouvelle dépendance pour cet élément. La valeur de progression globale vient de Lenis (`onScroll`) ou, en fallback, de `useScroll()` de Framer Motion sur un conteneur englobant toute la page.

---

## 2. Hero / Sidebar — séquence de boot

### Concept
Le chargement de la page est mis en scène comme le **démarrage réel du programme "DEVELOPER.EXE"** : un journal de boot qui affiche de vraies métadonnées (pas du texte décoratif inventé), puis le nom qui se "décode" lettre par lettre, sur un fond en profondeur qui réagit à la souris.

### Comportement précis — desktop
1. **Journal de boot (0–1.2s, une seule fois au montage)** : 2-3 lignes en JetBrains Mono apparaissent en cascade (typewriter, ~25ms/caractère), construites à partir des vraies données déjà affichées ailleurs sur la page (pas de texte inventé) : `> INITIALISATION DEVELOPER.EXE`, `> PROFIL: Solofomahery D. RAKOTONINDRINA`, `> RÔLE: Développeur Frontend`. Ce ne sont pas de nouvelles données — c'est la mise en scène du nom/titre déjà réels.
2. **Décodage du nom (titre principal)** : chaque lettre du nom cycle rapidement (3-4 glyphes aléatoires, ~40ms de cadence) avant de se figer sur la bonne lettre, de gauche à droite (stagger ~40ms entre lettres). Effet "scramble/decrypt" classique d'interface AAA/hacker, cohérent avec le concept ".EXE" déjà posé.
3. **Fond en profondeur** : une grille en perspective (CSS, lignes `border.subtle`, `transform: rotateX() translateZ()`) occupe l'arrière-plan du panneau Sidebar. Elle drift très légèrement en fonction de la position de la souris sur toute la fenêtre (amplitude max ~12-15px), avec un lissage par ressort (`useSpring`/`useTransform` de Framer Motion) — pas un mapping 1:1 brut (qui paraît artificiel), un mouvement qui a de l'inertie.
4. **Avatar/photo** : parallaxe à une vitesse différente de la grille (profondeur à 2 couches), plus un très léger flottement idle (translateY ±4px, boucle de 4s, quasi imperceptible — juste assez pour que le panneau semble "vivant" en permanence puisqu'il reste fixe à l'écran sur desktop).
5. **CTA contact + icônes réseaux sociaux réels** : apparaissent en dernier dans la cascade. Chaque icône a un effet magnétique au survol (voir section Curseur, 5).

Le panneau entier étant `position: fixed` sur desktop (déjà le cas), la grille parallaxe reste active et réactive à la souris **en permanence**, pas seulement pendant le chargement — c'est l'élément ambiant qui fait que le Hero ne redevient jamais un bloc figé une fois la séquence de boot terminée.

### Comportement précis — mobile/tablette
- Pas de parallaxe souris (pas de pointeur) : la grille reste visible mais statique (texture de fond fixe).
- Flottement idle de l'avatar supprimé (ou réduit à une amplitude négligeable) — priorité à la stabilité visuelle sur petit écran.
- Le journal de boot + le décodage du nom sont **conservés intégralement** : ce sont des animations déclenchées au chargement, pas au pointeur — elles fonctionnent identiquement sur tactile et sont la partie la plus "signature" de cette scène.
- Icônes sociales : pas d'effet magnétique (pas de sens sans survol), juste le retour tactile standard (changement d'opacité/couleur au `:active`).

### `prefers-reduced-motion`
- Le décodage lettre par lettre est **supprimé entièrement** (un cyclage rapide de glyphes est le genre de scintillement à éviter) : le nom apparaît directement en fondu simple, opacité seule, cohérent avec `heroBootReduced` déjà défini.
- Le journal de boot s'affiche d'un bloc (pas de typewriter caractère par caractère), fondu seul.
- La grille de fond reste visible mais totalement statique, aucune réaction à la souris.
- Avatar : aucun flottement idle, aucune parallaxe.

### Technique
Aucune nouvelle dépendance. Framer Motion (déjà en place) pour tout le mouvement (`useSpring`, `useTransform`, `AnimatePresence`), plus un petit hook custom pour l'effet de "scramble" du texte (une simple boucle `setInterval`/`requestAnimationFrame` qui remplace progressivement les caractères — aucune librairie n'est nécessaire pour ça).

---

## 3. About — composition éditoriale interactive

### Concept
Le texte de présentation réel est découpé en 2-3 blocs sémantiques (probablement déjà les paragraphes existants dans `Detail.tsx`) qui se **révèlent par bandes** au fil du scroll, pas en un seul fondu global. La révélation est littéralement pilotée par la position de scroll (scrubbed), pas déclenchée une fois pour toutes en entrant dans le viewport — c'est la différence concrète avec le `scrollReveal` actuel.

### Comportement précis — desktop
- La scène About se verrouille brièvement (`position: sticky`, pas besoin de GSAP ici) pendant une distance de scroll courte (environ 1.5× la hauteur du viewport).
- Pendant ce verrouillage, chaque bloc de texte se révèle par un effet de "balayage" (`clip-path: inset()` qui s'ouvre de gauche à droite), chaque bloc se déclenchant à un seuil de progression différent dans la plage verrouillée — le scroll de l'utilisateur "peint" littéralement le texte.
- Le CTA "Mon attirail de développeur" (qui ouvre l'overlay Skills, voir section 4) a un survol où de petits tags mono (les noms des 9 catégories réelles de `config/skills.ts` — `backend`, `frontend`, `cicd`, etc., juste les libellés, aucune métrique) orbitent légèrement autour du curseur à proximité du bouton — un teaser de ce que contient l'overlay avant de l'ouvrir.

### Comportement précis — mobile/tablette
- Pas de verrouillage de scroll (le `position: sticky` + scrub est un confort desktop, pas nécessaire ni souhaitable sur mobile où il mangerait une portion de l'écran déjà réduite).
- Chaque bloc garde le même **effet visuel** (balayage `clip-path`) mais déclenché simplement quand il entre dans le viewport (comme l'actuel `scrollReveal`, mais avec un balayage directionnel au lieu d'un fondu + translation) — cohérence visuelle avec desktop sans la mécanique de pin.
- Le teaser orbital au survol du CTA est remplacé par rien de spécial (pas de survol sur tactile) — le bouton garde son état visuel normal, pas besoin d'équivalent : ce n'était qu'un bonus desktop, pas une information supplémentaire.

### `prefers-reduced-motion`
- Les balayages `clip-path` directionnels sont remplacés par un simple fondu d'opacité (pas de direction, pas de mouvement).
- Pas de verrouillage de scroll du tout (même sur desktop) — les blocs apparaissent chacun une fois en vue, point.
- Le teaser orbital du CTA est supprimé, remplacé par le changement de couleur/bordure au survol déjà prévu par les tokens existants.

### Technique
Framer Motion uniquement : `useScroll({ target, offset })` + `useTransform` pour piloter le `clip-path` en fonction de la progression de scroll, combiné à `position: sticky` en CSS pour le verrouillage visuel (pas besoin de GSAP ScrollTrigger pour ce cas — Framer Motion gère déjà les valeurs liées au scroll nativement, et c'est une dépendance déjà installée).

---

## 4. Skills — carte de relations interactive (dans l'overlay ouvert depuis About)

### Contrainte dure rappelée
Aucun niveau, aucun pourcentage, aucune jauge de maîtrise inventée. Les 9 catégories réelles et les compétences réelles de `config/skills.ts` restent la seule donnée affichée, strictement.

### Concept
Remplacer la petite `Modal` Chakra actuelle (US-004) par un **overlay plein écran** ("écran d'inventaire/diagnostic", dans l'esprit jeu vidéo mais sans aller vers le cyberpunk caricatural) qui présente les 9 catégories comme des **nœuds reliés entre eux** plutôt qu'une liste de listes. C'est un changement de présentation, pas d'information : toujours binaire (une techno est listée ou ne l'est pas), jamais quantifié.

### Comportement précis — desktop
- Ouverture : toujours déclenchée par le CTA "Mon attirail de développeur" (inchangé). L'overlay prend tout l'écran (fond flouté/obscurci derrière), piège le focus et se ferme à `Escape` — on **conserve** tous les acquis d'accessibilité déjà validés en US-010 (focus trap, `aria-*`, fermeture clavier).
- Les 9 catégories sont disposées en cercle/radial autour d'un point central, reliées par de fins traits `accent.default` à faible opacité (métaphore circuit/dépendances, cohérente avec l'identité ".EXE").
- Survol d'une catégorie : un pouls lumineux parcourt le trait qui relie le centre à ce nœud (animation de trait SVG `stroke-dashoffset`, peu coûteuse), puis les compétences réelles de cette catégorie apparaissent en chips avec un micro-stagger (~30-40ms entre chips, réutilisant le token `modalEnter` déjà défini : scale 0.96→1 + fondu).
- Clic : épingle la catégorie ouverte (reste dépliée sans maintenir le survol), pour permettre de lire tranquillement.

### Comportement précis — mobile/tablette
- La disposition radiale n'est pas lisible/tactile sur petit écran : remplacée par un **accordéon vertical** des 9 catégories, pleine largeur, dans le même ordre. Le trait de connexion devient un simple rail vertical fin (écho visuel délibéré avec la timeline d'Experience, section 5 — cohérence inter-sections).
- Tap sur une catégorie : déplie ses compétences réelles avec le même micro-stagger de chips qu'en desktop (cette partie ne dépend pas du pointeur, elle est conservée identique).

### `prefers-reduced-motion`
- Pas de pouls lumineux voyageant le long des traits.
- Dépliage/repliement sans animation de ressort — un échange quasi instantané (≤0.05s) d'opacité/échelle sur un bloc déjà dimensionné (pas d'animation de hauteur, cohérent avec la règle "n'animer que transform/opacity").
- Les chips apparaissent directement à leur état final, sans stagger perceptible (délai ramené à 0, même logique que les tokens `*Reduced` déjà en place).

### Technique
Aucune nouvelle dépendance. Framer Motion (`AnimatePresence`, animations `layout`, springs) pour tout le dépliage/repliement. Le pouls le long du trait : soit un simple `stroke-dashoffset` animé en CSS, soit `useTransform` de Framer Motion sur un `pathLength` — pas besoin de GSAP pour un seul trait.

---

## 5. Experience — timeline qui se construit avec le scroll

### Concept
Garder la timeline verticale (US-005, déjà une bonne base) mais rendre le **tracé de la ligne lui-même proportionnel à la progression du scroll** dans la section, au lieu que chaque carte se révèle indépendamment. La ligne "se dessine" pendant que l'utilisateur descend, et chaque point (DOMOTI, VIVETIC, PUSHTECH, dans l'ordre réel existant) "s'allume" en `accent.default` exactement quand le tracé l'atteint — métaphore d'un diagnostic/checklist qui se complète, cohérente avec le vocabulaire HUD du reste du site.

### Comportement précis — desktop et mobile (mécanisme identique)
C'est une des rares scènes où le même mécanisme fonctionne nativement aux deux largeurs, sans fallback distinct :
- La ligne de la timeline est un tracé SVG (ou un `div` à `scaleY` piloté), dont la progression (`pathLength` ou `scaleY`) est directement liée à la position de scroll à travers la section (`useScroll({ target: timelineRef })` + `useTransform`).
- Chaque point s'allume (changement de couleur/intensité uniquement, pas de changement de forme) à l'instant précis où le tracé le dépasse.
- La carte de l'expérience correspondante (nom réel, durée réelle, rôles réels de `config/experience.tsx`) se révèle (fondu + translation légère, réutilise `scrollReveal` existant) au même instant que son point s'allume — synchronisation explicite entre le tracé et le contenu, pas deux animations indépendantes qui se déclenchent par coïncidence.
- Pas de verrouillage de scroll nécessaire ici : le tracé progresse en continu avec le scroll naturel, aucune conversion de direction ni de pin.

### `prefers-reduced-motion`
- La ligne apparaît entièrement tracée dès l'entrée de la section dans le viewport (pas de progression liée au scroll).
- Tous les points sont déjà allumés au repos.
- Les cartes apparaissent en fondu seul (pas de translation), comme le reste du site sous ce mode.

### Technique
Framer Motion uniquement (`useScroll` + `useTransform` sur `pathLength`/`scaleY`) — aucune nouvelle dépendance, aucun GSAP nécessaire pour ce cas (pas de pin, juste une valeur dérivée du scroll).

---

## 6. Projects — galerie immersive à défilement horizontal

### Concept
La grille statique 2×2 actuelle (US-006) devient une **galerie en défilement horizontal piloté par le scroll vertical** : en descendant dans la section, les 4 vraies cartes projet (Becquet!, GIPROD Androy, E-Kaly, GESCOM) glissent horizontalement, chacune occupant la majorité de la largeur de l'écran à son tour (grandes images, comme demandé) — le cas d'usage le plus classique et le mieux maîtrisé de GSAP ScrollTrigger (pin + scrub + conversion verticale→horizontale), c'est la section où cette dépendance se justifie le mieux.

### Comportement précis — desktop
- La section se verrouille (pin) pendant que la rangée de cartes translate horizontalement, proportionnellement au scroll vertical restant dans la plage verrouillée.
- Carte active (celle qui occupe le centre de l'écran) : son image a une parallaxe interne légère (l'image bouge un peu plus lentement que le cadre qui la masque, via `overflow: hidden` + translation liée au scroll) — sensation de profondeur, pas de 3D réelle.
- **Survol** d'une carte : l'image monte légèrement en échelle (1 → 1.04, transform uniquement), un dégradé/overlay teinté accent remonte depuis le bas révélant l'index réel (`#01`...`#04`), le titre, et — **seulement si `ctaUrl` est un vrai lien externe valide** (logique `isExternalProjectLink` déjà implémentée en US-006, à conserver identique) — le lien "voir le projet". Aucune carte ne doit afficher un lien qu'elle n'a pas réellement (Becquet!/GIPROD/GESCOM restent sans lien, E-Kaly seule l'affiche).
- **Clic** sur une carte (n'importe laquelle, avec ou sans lien externe) : la carte s'agrandit en place via une transition d'élément partagé (Framer Motion `layoutId`) vers une vue de détail qui affiche le texte de description réel **en entier** (dans le format compact "grande image", une partie du texte sera visuellement tronquée — le clic redonne accès au texte complet déjà existant, sans qu'aucun mot ne soit inventé). Fermeture par clic extérieur/Escape/bouton, retour à la galerie via le même morph.
- En fin de galerie, le scroll se "relâche" et redevient vertical normal vers Contact.

### Comportement précis — mobile/tactile
- **Pas de scroll-jacking sur tactile** (le détournement vertical→horizontal via JS entre en conflit avec le scroll/la barre d'adresse natifs d'iOS/Android et donne une sensation brouillonne) : remplacé par un **swipe horizontal natif** (`scroll-snap-type: x mandatory`, une carte par "page", `scroll-snap-align: center`) — le momentum tactile natif du système fait tout le travail, sans JS de détournement.
- Le tap pour ouvrir le détail complet fonctionne identiquement (indépendant du mode de défilement).
- Même logique stricte pour le lien "voir le projet" (seule E-Kaly l'affiche).

### `prefers-reduced-motion`
- Le pin + scroll-jacking horizontal est **désactivé entièrement** : la section retombe sur la grille statique 2×2 actuelle (US-006, déjà validée, déjà accessible) — c'est un vrai filet de sécurité, pas une version dégradée inventée : le contenu reste identique, seule la mécanique de scroll change.
- Parallaxe d'image et scale au survol supprimés (le survol garde seulement bordure/ombre, comme `hoverLift` le prévoit déjà en mode réduit).
- Le morph `layoutId` vers le détail reste (ce n'est pas un défilement, le risque vestibulaire est bien plus faible), mais sa durée est raccourcie et peut être pilotée par `MotionConfig reducedMotion="user"` au niveau racine de l'app (fonctionnalité native de Framer Motion qui désactive automatiquement les animations basées sur le transform dès que `prefers-reduced-motion` est actif, en filet de sécurité global sous les tokens `*Reduced` déjà spécifiques à chaque composant).

### Technique
**GSAP + plugin ScrollTrigger** — c'est la section qui justifie réellement cette dépendance (pin horizontal + scrub, avec `ScrollTrigger.matchMedia` pour activer/désactiver proprement le pin selon la largeur/le type de pointeur, et une gestion de resize robuste déjà éprouvée dans l'écosystème GSAP). Framer Motion `layoutId` (déjà en place) pour le morph de détail. CSS `scroll-snap` natif pour le mobile (aucune dépendance).

---

## 7. Contact — scène de clôture

### Concept
Une scène volontairement différente de ton : le fil conducteur HUD affiche "SCÈNE 05/05", et une seule pièce ambitieuse est concentrée ici (pas éparpillée sur tout le site) — une forme filaire abstraite en 3D (sphère ou nœud géométrique simple, résolument minimaliste et sobre, pas de néon ni de particules tape-à-l'œil) en arrière-plan, qui tourne lentement sur elle-même et réagit légèrement à la position de la souris. C'est le seul endroit du site qui utilise la 3D — un choix délibéré de concentration plutôt que de dilution.

### Comportement précis — desktop
- La forme 3D tourne en continu, lentement, de façon autonome.
- Quand la souris se déplace sur la scène, elle "pousse" légèrement la rotation dans la direction du mouvement (offset additif, pas un contrôle direct) — relâche vers la rotation idle quand la souris quitte la zone.
- L'email réel et le lien GitHub réel (inchangés) sont présentés en typographie mono large, dominante de la scène. Le nom de l'email se "décode" une seconde fois avec le même effet de scramble que le Hero (section 2) — un rappel délibéré en fin de parcours (bouclage "boot" → "shutdown"), pas une troisième utilisation générique de l'effet ailleurs sur le site.
- Clic sur l'email : copie dans le presse-papiers (en plus du `mailto:` existant, qui reste fonctionnel), confirmation "Copié" + micro-retour de pression (`scale(0.97)`).

### Comportement précis — mobile/tactile
- La forme 3D reste rendue (un seul objet filaire low-poly, raisonnable même sur mobile) mais perd l'interaction souris (pas de pointeur) — rotation autonome uniquement, aucune demande de permission capteur (gyroscope) pour un gain visuel trop faible par rapport au coût d'UX (popup de permission).
- Le clic-pour-copier fonctionne identiquement au tap.

### `prefers-reduced-motion`
- Le canvas 3D n'est **pas monté du tout** (ni chargé, ni rendu statique) — remplacé par un fond décoratif plat (couleur/forme géométrique simple, sans mouvement). Pas seulement "désactivé" : carrément absent, pour ne payer ni le coût GPU ni le risque vestibulaire d'un rendu WebGL, même immobile.
- L'effet de scramble sur l'email devient un fondu simple (comme au Hero).
- Le retour "Copié" + `scale(0.97)` au clic reste (c'est un retour d'état statique, pas un mouvement, autorisé sous ce mode).

### Technique
**React Three Fiber + @react-three/drei** — chargés en `next/dynamic(..., { ssr: false })` et montés seulement quand la section Contact entre réellement dans le viewport (réutilise le pattern `useInView` déjà présent dans `GetInTouch` pour l'animation de l'émoji) : aucun coût sur le chargement initial de la page, le Hero et le reste du site au-dessus de la ligne de flottaison ne paient rien pour cette scène. Framer Motion pour le rappel du scramble et le retour de clic-copie.

---

## 8. Curseur personnalisé et micro-interactions desktop

### Concept
Un curseur personnalisé actif uniquement en `@media (hover: hover) and (pointer: fine)` (donc jamais sur tactile, même un tactile avec souris Bluetooth connectée serait couvert par ce test — pas de fausse détection "desktop = large écran"). Pas un simple rond générique : un anneau fin (24px, `accent.default`, pas rempli) qui a des **états contextuels concrets** selon ce qu'il survole.

### États précis
- **Repos** : anneau 24px, suit le pointeur avec un léger retard à ressort (`useSpring`, ~150-200ms d'amortissement) — a de l'inertie, ne colle pas 1:1 au pixel.
- **Survol d'un lien/bouton générique** (nav, CTA) : l'anneau grossit à ~40px, sans label.
- **Survol d'une carte Projects** : l'anneau grossit et affiche un petit label mono *"VOIR"* **seulement si** la carte a un `ctaUrl` externe valide (même logique stricte que partout ailleurs sur Projects — pas d'affordance inventée sur les 3 cartes sans lien réel).
- **Survol d'un nœud Skills** : l'anneau affiche un petit `+` pour signaler qu'il se déplie.
- **Survol de la grille parallaxe du Hero (zone non interactive)** : l'anneau reste en état repos — la grille réagit déjà elle-même au mouvement de souris (section 2), inutile de superposer une deuxième réaction au même geste au même endroit.
- **Pression/clic** : l'anneau se contracte brièvement à ~0.9 (retour tactile sur le curseur lui-même, plutôt que de faire aussi bouger l'élément cliqué — évite de cumuler deux mouvements pour un seul clic).

### Effet magnétique (ciblé, pas généralisé)
Sur un nombre restreint et délibéré de cibles (les icônes réseaux sociaux du Hero, les nœuds de catégorie Skills, les repères de la jauge de progression — 3 familles d'éléments, pas "tout ce qui est cliquable") : à l'approche du curseur (~24px du bord de la cible), l'élément lui-même se déplace légèrement (jusqu'à 6-8px) vers le pointeur, et revient avec un ressort au départ de la souris. Limité à ces familles précises pour éviter l'effet "tout vibre" qui serait lui-même un symptôme générique/AI slop.

### Équivalent mobile/tactile
- **Le curseur personnalisé disparaît entièrement** (pas de pointeur, aucun sens à le simuler).
- Les affordances qu'il portait (labels "VOIR", "+") deviennent des **badges statiques toujours visibles** directement dans l'UI tactile (ex. un petit badge mono *"VOIR →"* visible en permanence en bas d'une carte Projects qui a un vrai lien, au lieu d'apparaître seulement au survol) — traduction honnête : sur desktop l'affordance se révèle à la proximité (survol), sur tactile il n'existe pas de signal de proximité équivalent, donc elle doit être permanente plutôt que cachée.
- **L'effet magnétique n'a pas d'équivalent** : pas de sens à le simuler sur un tap, qui est déjà l'interaction directe que l'effet magnétique cherche à approcher sur desktop. Purement et simplement absent sur tactile.

### `prefers-reduced-motion` (desktop, pointeur fin, mais mouvement réduit)
Le suivi du curseur avec retard à ressort est lui-même une forme de mouvement constant, potentiellement fatigante même sans parallaxe. Décision tranchée plutôt qu'une version "allégée" : **le curseur personnalisé est entièrement désactivé**, retour au curseur système natif. Les affordances qu'il portait tombent sur la même solution que le mobile (badges statiques toujours visibles) — réutilisation d'une solution déjà définie plutôt qu'une troisième variante inventée.

### Technique
Aucune nouvelle dépendance. Framer Motion (`useSpring`, `useTransform`, déjà en place) suffit pour le suivi à ressort, le changement d'état (taille/label) et l'effet magnétique sur les cibles ciblées.

---

## 9. Récapitulatif des techniques par effet

| Section / effet | Technique | Nouvelle dépendance ? | Pourquoi |
|---|---|---|---|
| Scroll global à inertie | Lenis | **Oui** | Fondation nécessaire pour que les effets liés au scroll (Experience, About, Projects) soient fluides ; combat le "paquet" irrégulier de l'évènement scroll natif. |
| Jauge/cadre HUD de progression | Framer Motion | Non (déjà installé) | Simple valeur dérivée du scroll, pas besoin d'un outil dédié. |
| Hero — scramble texte + parallaxe souris | Framer Motion (`useSpring`/`useTransform`) + hook custom maison | Non | Effet de "scramble" = boucle JS simple, aucune librairie dédiée nécessaire. |
| About — balayage `clip-path` scrubbed | Framer Motion (`useScroll`/`useTransform`) + CSS `position: sticky` | Non | Framer Motion gère déjà les valeurs liées au scroll ; pas besoin du pin robuste de GSAP pour une seule section courte. |
| Skills — carte de relations, dépliage | Framer Motion (`AnimatePresence`, `layout`, springs) | Non | Dépliage/repliement et stagger de chips sont le cœur de compétence de Framer Motion. |
| Experience — ligne qui se dessine au scroll | Framer Motion (`useScroll`/`useTransform` sur `pathLength`/`scaleY`) | Non | Pas de pin, juste une valeur dérivée du scroll — identique au mécanisme d'About, sans GSAP. |
| Projects — galerie horizontale pin+scrub | **GSAP + ScrollTrigger** | **Oui** | Seul cas qui justifie vraiment GSAP : pin + conversion vertical→horizontal + gestion de resize robuste, le cas d'usage le plus éprouvé de ScrollTrigger. |
| Projects — morph carte → détail | Framer Motion (`layoutId`) | Non | Déjà installé, fait exactement ce qu'il faut pour une transition d'élément partagé. |
| Projects — swipe mobile | CSS `scroll-snap` natif | Non | Le momentum tactile du système fait tout le travail, aucun JS de détournement nécessaire sur tactile. |
| Contact — forme 3D ambiante | **React Three Fiber + @react-three/drei** | **Oui** | Seule section 3D du site, volontairement concentrée ; chargée en lazy/`ssr:false`, montée seulement quand la section est visible — coût nul ailleurs sur le site. |
| Contact — rappel scramble + copier | Framer Motion + hook custom (même que Hero) | Non | Réutilisation du même hook que le Hero, pas un nouvel effet. |
| Curseur personnalisé + magnétisme | Framer Motion (`useSpring`) | Non | Déjà le bon outil pour un suivi à ressort et des transitions d'état de petite taille. |

**Trois nouvelles dépendances au total, chacune justifiée par un seul usage concret** : Lenis (fondation globale du scroll), GSAP+ScrollTrigger (uniquement Projects), React Three Fiber+drei (uniquement Contact, lazy-loadé). Tout le reste (Hero, About, Experience, Skills, cadre HUD, curseur) repose sur Framer Motion, déjà installé — aucune dépendance ajoutée pour ces sections. La décision finale d'installation revient au developer après vérification de faisabilité (taille de bundle réelle, compatibilité avec Next.js 14 pages router, performance mesurée), conformément à la consigne de ne rien installer par défaut.

---

## 10. Risques et points d'attention pour le developer (si cette proposition est validée)

- **Perf/Core Web Vitals** : GSAP et R3F doivent être chargés en code-splitting (`next/dynamic`, `ssr: false` pour R3F) et jamais sur le chemin critique du premier rendu (Hero doit rester rapide et ne dépend d'aucune des deux). À mesurer réellement (Lighthouse/`core-web-vitals` skill QA) avant de considérer l'implémentation terminée.
- **Scroll-jacking (Projects)** : risque UX connu de désorientation — mitigé par la jauge de progression toujours visible (section 1.3) et par le fallback intégral vers la grille statique sous `prefers-reduced-motion`. À tester réellement au trackpad/molette/tactile, pas seulement en lecture de code.
- **`ScrollTrigger.matchMedia`** : le passage desktop ↔ mobile doit être testé au resize de fenêtre en conditions réelles (pas seulement au chargement à une largeur fixe), un piège classique de ce pattern.
- **Interaction Lenis + ancres existantes** : le clic sur un lien du `Menu` (`#aboutMe`, `#jobs`, etc.) doit continuer à amener à la bonne section avec Lenis actif (`lenis.scrollTo(target)`) — à vérifier explicitement, c'est un point de régression facile à manquer.
- **Accessibilité du curseur personnalisé** : masquer le curseur système ne doit jamais retirer le focus visible au clavier (le curseur personnalisé est un effet souris, pas un remplacement de l'indicateur de focus clavier déjà en place) — rappel explicite pour ne pas régresser les acquis d'accessibilité d'US-010.
- **Overlay Skills plein écran** : doit repartir des acquis d'accessibilité déjà validés (focus trap, `Escape`, `aria-*`) plutôt que les refaire de zéro — c'est une évolution visuelle de l'overlay existant, pas une reconstruction.

---

## 11. Ce que cette proposition ne couvre pas (hors scope, décision assumée)

- Pas de refonte du contenu/texte (bio, descriptions de projets, rôles d'expérience) — strictement la mise en scène de ce qui existe déjà.
- Pas de page de détail dédiée par projet (route Next.js séparée) — le morph `layoutId` vers une vue de détail reste dans la même page ; une vraie page de case-study par projet serait une itération future possible, pas incluse ici pour rester concret et borné au contenu réel actuel.
- Pas de changement de palette/typographie — la direction "DEVELOPER.EXE" (US-002) reste la base chromatique/typographique intacte.
