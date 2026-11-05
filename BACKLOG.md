# BACKLOG — Portfolio Redesign (DEVELOPER.EXE)

> Référence centrale de suivi. Mise à jour à chaque tâche terminée et vérifiée — jamais cochée sans vérification réelle.

## US-001 — Audit et préparation
**Priorité :** Haute
**Statut :** Terminé

Objectif : analyser le portfolio existant et préparer la refonte.

Critères d'acceptation :
- [x] Architecture existante analysée (Next.js 14 pages router, Chakra UI, Framer Motion).
- [x] Sources de données identifiées (`config/experience.tsx`, `config/skills.ts`, `config/sidebar.ts`).
- [x] Fonctionnalités existantes recensées.
- [x] Points faibles UI/UX et bugs identifiés.
- [x] Point de sauvegarde Git créé (`backup/pre-redesign-2026-11-04`).

Tâches :
- [x] Analyser la structure du projet et les composants.
- [x] Identifier les sources de données réelles (expériences, compétences, projets, contact).
- [x] Documenter les fonctionnalités existantes (thème clair/sombre, navigation scroll, modal compétences, tabs expériences).
- [x] Identifier les bugs/incohérences existants (voir section Audit ci-dessous).
- [x] Créer la branche de travail `feature/portfolio-redesign` depuis `develop`.

## US-002 — Direction artistique "DEVELOPER.EXE"
**Priorité :** Haute
**Statut :** Terminé

Objectif : définir une identité visuelle cohérente (palette, typographie, espacements, motion tokens) inspirée interfaces AAA/sci-fi, minimaliste et pro.

Critères d'acceptation :
- [x] Palette de couleurs définie (fond sombre, accent électrique) et vérifiée en contraste WCAG AA.
- [x] Échelle typographique définie.
- [x] Grille d'espacement définie.
- [x] Principes d'animation définis (5 animations fortes max, respect `prefers-reduced-motion`).
- [x] Cohérence desktop/mobile validée sur le concept.

Implémenté dans `config/theme.ts` (colors `night`/`accent`, `semanticTokens`, `fonts`/`fontWeights`/`textStyles`, `sizes`), `config/animations.ts` (5 animations signature + contreparties reduced-motion), `pages/_document.tsx` (ajout police JetBrains Mono). Détails et ratios de contraste dans `.claude/memory/designer.md`. Aucun composant de section modifié (Hero/About/Experience/Projects/Contact repoussés à US-003+).

**Vérifié visuellement a posteriori** par le PO via `mcp__chrome-devtools__*` (désormais disponible dans sa session) avant commit : fond/texte global correct en clair et sombre, desktop et mobile, aucune régression. Les outils `mcp__playwright__*` restaient non chargés côté agent `designer` au moment de la tâche (limite connue, nécessite redémarrage de Claude Code).

## US-003 — Refonte Hero / Sidebar
**Priorité :** Haute
**Statut :** Terminé

Objectif : transformer la Sidebar actuelle en une introduction cinématique forte, sans perdre les vraies données (nom, titre, bio, CTA contact, réseaux sociaux).

Critères d'acceptation :
- [x] Nom, titre "Développeur Frontend", bio réelle conservés. Vérifié par lecture du HTML généré côté serveur (`curl` sur `/`) : "Solofomahery D.", "RAKOTONINDRINA", "Développeur Frontend" et le texte de bio réel sont bien présents.
- [x] CTA contact et liens réseaux sociaux réels conservés et fonctionnels. Vérifié par `curl` sur le HTML généré : `href="mailto:maeryrakotonidrina17@gmail.com"` (coquille connue intacte, hors scope US-007) et les 4 hrefs réseaux sociaux (Instagram/LinkedIn/GitHub/Facebook) inchangés.
- [x] Animation d'entrée élégante, performante (`heroBoot` + cascade `staggerChildren`, contrepartie reduced-motion via `useReducedMotion()`). Vérifiée visuellement par le PO via `mcp__chrome-devtools__*` (disponible dans sa session) : rendu correct, pas de saccade.
- [x] Rendu desktop + mobile vérifié. Vérifié visuellement par le PO via `mcp__chrome-devtools__*` : desktop (1440px) et mobile (375px), modes clair et sombre, aucun débordement horizontal, pas d'erreur console. `mcp__playwright__*` restait non chargé côté agent `developer` (limite connue depuis US-002, serveur MCP pas encore actif après redémarrage) — contournée en vérifiant depuis la session PO.

**Bug post-validation corrigé** : la vérification initiale était purement visuelle et n'avait pas détecté que la prop `textStyle` ne s'appliquait pas réellement sur les `Heading` Chakra (mécanisme de "remplissage de trous" de Chakra — une propriété déjà définie par le `baseStyle`/`size` par défaut du composant n'est jamais écrasée par `textStyle`). Le hero rendait donc à 36px au lieu de 72px, le label en Poppins au lieu du mono HUD prévu. Trouvé par le PO via `getComputedStyle`, corrigé par le developer : `Heading` → `Text as={tag}` partout où `textStyle` doit piloter la typo (`components/Sidebar/index.tsx`, `components/Sections/About/Detail.tsx`, `components/Sections/About/SkillSetModal.tsx`). Révélait un second problème une fois le hero vraiment à 72px : "RAKOTONINDRINA" débordait/se cassait au milieu d'un mot dans la colonne étroite de la Sidebar en desktop — corrigé avec une vraie césure typographique (`hyphens: auto` + `lang="fr"`). Les deux corrections re-vérifiées par le PO via `mcp__chrome-devtools__*` (styles calculés + captures `screenshots/us003-sidebar-*-final.png`) : hero 72px, label en JetBrains Mono 12px, césure propre ("RAKOTONIN-" / "DRINA"), aucune régression desktop/tablette/mobile. Signature `fontVariantCaps: small-caps` (présente sur tous les titres de section du site) ajoutée aux tokens `title`/`subtitle` de `config/theme.ts` pour survivre aux futures migrations (US-005+).

## US-004 — Refonte About (Detail + SkillSetModal)
**Priorité :** Moyenne
**Statut :** Terminé

Objectif : moderniser la présentation du profil et des compétences réelles (`config/skills.ts`), sans pourcentages ni jauges inventées.

Critères d'acceptation :
- [x] Texte de présentation réel conservé. Vérifié par lecture du code (bio, tooltip thé/café, CTA "Mon attirail de développeur" inchangés caractère pour caractère) et par `curl` sur le HTML SSR généré (`/`) : la bio réelle ("gestion de logiques métier...") et le CTA sont bien présents.
- [x] Toutes les compétences de `config/skills.ts` restent accessibles (modal ou nouvelle présentation). **Bug pré-existant corrigé au passage** : le modal ne rendait que 7 des 9 catégories (`cicd` et `games` étaient absents) — remplacé par une itération sur `Object.keys(Skills)` typée `Record<SkillCategory, string>`, qui force une erreur de compilation si une future catégorie n'a pas d'intitulé. Vérifié par lecture du code et `npm run build` (compile sans erreur de type).
- [x] Pas de métrique de compétence inventée. Vérifié par lecture du code : aucune barre de progression/pourcentage, seulement des listes d'icônes + libellés réels.
- [x] Tokens US-002 utilisés : `textStyle` (`title`/`body`/`label`), `color="accent.default"` (remplace les `useColorModeValue('teal.500','cyan.200')` legacy), animations signature `scrollReveal`/`scrollRevealReduced` (cascade d'entrée sur `Detail`), `hoverLift`/`hoverLiftReduced` (CTA), `modalEnter`/`modalEnterReduced` (ouverture du `SkillSetModal`, câblé via la prop `motionProps` de `ModalContent`).
- [x] `prefers-reduced-motion` respecté : `useReducedMotion()` sélectionne les contreparties `*Reduced` de chaque animation, même pattern que Sidebar (US-003).
- [x] `npm run lint` et `npm run build` passent (vérifiés par le developer).
- [x] Rendu visuel (desktop + mobile, clair/sombre, ouverture réelle du modal) vérifié par le PO via `mcp__chrome-devtools__*` : les 9 catégories de compétences s'affichent dans le modal (y compris CI/CD & Cloud et Game Dev, auparavant invisibles), labels de catégorie bien en mono/majuscules/gris, titre du modal en `subtitle`, mobile (375px) sans débordement, aucune erreur console. Captures : `screenshots/us004-skillmodal-desktop-dark-final.png`, `screenshots/us004-about-mobile-dark-final.png`.

## US-005 — Refonte Experience (timeline)
**Priorité :** Moyenne
**Statut :** Terminé

Objectif : présenter les 3 expériences réelles (Domoti, Vivetic, Pushtech) sous une composition visuelle plus immersive qu'un simple Tabs.

Critères d'acceptation :
- [x] Les 3 entreprises, durées et descriptions réelles conservées intégralement. Vérifié par lecture du code (`config/experience.tsx` non modifié) et par `curl` sur le HTML SSR (`/`) : "Groupe DOMOTI", "VIVETIC GROUP", "PUSHTECH CONSULTING", les 3 durées réelles et les paragraphes de description complets (y compris le texte "GED (Gestion Électronique des Documents)") sont bien présents mot pour mot.
- [x] Logos existants conservés. Vérifié par lecture du code (mêmes URLs `company.logo.light`/`company.logo.dark` de `config/experience.tsx`, même logique `colorMode`-aware qu'avant) et visuellement sur les 4 captures (desktop/mobile × clair/sombre) : les 3 logos (Domoti, Vivetic, Pushtech) s'affichent correctement.
- [x] Lisible sur mobile sans scroll horizontal cassé. L'ancien système de `Tabs` (orientation horizontale forcée en dessous de `md`, `overflowX: scroll` sur la liste d'onglets) est remplacé par une timeline verticale unique (pas de changement d'orientation par breakpoint). Vérifié par `getComputedStyle`/`document.documentElement` via script Playwright (`scrollWidth === clientWidth` à 375px, dark et light) et visuellement (`screenshots/us005-experience-mobile-dark.png`, `screenshots/us005-experience-mobile-light.png`).

Implémenté dans `components/Sections/Experience/index.tsx` (heading + description, migrés) et `components/Sections/Experience/Timeline.tsx` (nouveau, remplace `ExperienceTab.tsx` + `styles.module.css` supprimés — plus de `Tabs`/`TabList`/scrollbar custom). Timeline verticale : ligne + point accent par entrée, carte `bg.surface`/`border.subtle` par expérience (logo, nom, durée, liste de rôles avec icône flèche). Heading "Parcours professionnel." migré vers `Text as="h2" textStyle="title"` (retrait du `style={{ fontVariantCaps: 'small-caps' }}` inline et du `size="2xl"` legacy — le token `title` les porte nativement, cf. bugfix post-US-004). Nom d'entreprise en `Text as="h3" textStyle="subtitle"`, durée en `Text as="span" textStyle="label"` (`text.tertiary`), description de rôle en `variant="description"` (`text.secondary`), `fontSize="smaller"` legacy remplacé par `fontSize="sm"`. Chaque carte a son propre déclencheur `whileInView` (`scrollReveal`/`scrollRevealReduced` indépendant par entrée, pas de cascade groupée avec le titre) — choix délibéré pour une timeline qui s'étend sur toute la hauteur de la page : chaque expérience se révèle à son propre passage dans le viewport plutôt que toutes en même temps à l'arrivée du titre. `hoverLift`/`hoverLiftReduced` sur chaque carte (élévation légère au survol). `npm run lint` et `npx tsc --noEmit` passent. Vérification `getComputedStyle` : heading (`h2`) 36px/600/Poppins/small-caps à 1440px, 30px à 375px ; nom d'entreprise (`h3`) 24px/500/Poppins/small-caps à 1440px, 20px à 375px — confirme que `textStyle` s'applique bien via `Text as={tag}` (pas de régression du bug Heading/textStyle identifié post-US-004). Aucune erreur console imputable à Experience/Timeline (les seuls warnings React relevés viennent de Menu/Avatar/FadeWhenVisible, pré-existants, hors scope). Captures : `screenshots/us005-experience-desktop-dark.png`, `-desktop-light.png`, `-mobile-dark.png`, `-mobile-light.png` (vérifiées par le developer via un script Playwright local, `mcp__playwright__*` non chargé dans cette session — voir mémoire developer pour la méthode de contournement).

## US-006 — Refonte Projects (galerie)
**Priorité :** Haute
**Statut :** Terminé

Objectif : transformer `FeaturedWorks`/`FeaturedCard` en galerie immersive, avec les 4 projets réels (Becquet!, GIPROD Androy, E-Kaly, GESCOM).

Critères d'acceptation :
- [x] Les 4 projets et leurs vraies descriptions/images conservés. Données extraites programmatiquement (script Node, pas de retype manuel) depuis l'ancien `index.tsx` vers `config/works.ts`, pour garantir une copie fidèle caractère pour caractère (y compris les apostrophes mixtes `'`/`’` et l'espace manquant "MANAO),pour" déjà présents dans le texte original) — seule la mise en forme interne (retours à la ligne/indentation à l'intérieur des strings JS) a été normalisée en un seul espace, sans effet visuel (le navigateur collapse déjà ces espaces par défaut). Vérifié par script Playwright : les 4 titres/descriptions réels s'affichent (`screenshots/us006-works-desktop-dark-full.png`).
- [x] **Bugfix** `ctaUrl` : nouvelle fonction `isExternalProjectLink` (`FeaturedCard.tsx`) — un lien "voir le projet" ne s'affiche que si `ctaUrl` est une URL absolue http/https, différente de l'image de couverture (`src`) et ne pointant pas elle-même vers un fichier image. Vérifié par script Playwright (lecture DOM réelle, pas juste une relecture du code) : seul **E-Kaly** (`ctaUrl="https://dev.agora-school.com"`) affiche le lien ; Becquet! et GESCOM (dont `ctaUrl` pointait vers leur propre image, bug audit US-001) et GIPROD Androy (`ctaUrl="/giprod.jp"`, chemin local mal orthographié) n'affichent aucun lien, aucune invention.
- [x] Effet de profondeur au survol : `hoverLift` (translateY -4px, signature US-002, déjà jugée pertinente telle quelle) combiné à une ombre (`boxShadow: 'lg'`) et une bordure qui passe de `border.subtle` à `accent.default` au survol — choix délibéré de ne pas ajouter de nouveau token d'animation (zoom/parallaxe) pour rester sobre. Vérifié par `getComputedStyle` avant/après survol réel (souris déplacée sur la carte via Playwright) : `boxShadow: none → 0 10px 15px...`, `borderColor: rgb(28,31,39) → rgb(77,159,255)`, `transform: none → translateY(-4px)`. Sous `prefers-reduced-motion: reduce` (émulé), le `transform` reste `none` (pas de translation) tandis que l'ombre/bordure restent le seul signal — conforme à la description déjà documentée de `hoverLift` dans `config/animations.ts`.
- [x] Pas de capture d'écran inventée : aucune nouvelle image ajoutée, les 4 `src` réels (`giprod.jpg`, `agora.webp`, 2 URLs gstatic) sont inchangés dans `config/works.ts`.

Implémenté dans `config/works.ts` (nouveau — type `Work` + `WorksList`, même pattern que `config/experience.tsx`), `components/Sections/FeaturedWorks/index.tsx` (heading migré vers `Text as="h2" textStyle="title"`, retrait du `size="2xl"` + `style={{ fontVariantCaps: 'small-caps' }}` inline legacy ; description en `variant="description" textStyle="body"` ; grille `SimpleGrid columns={{ base: 1, md: 2 }}`, remplace l'ancienne `Grid` 6 colonnes/1 par ligne) et `components/Sections/FeaturedWorks/FeaturedCard.tsx` (réécrit — carte `article` avec image en haut (`AspectRatio` 16:10, remplace les hauteurs pixel ad hoc dont une valeur `'10px'` manifestement erronée sur GESCOM) et contenu en dessous (`#0{idx}` en `textStyle="label"`, titre en `Text as="h3" textStyle="subtitle"`, description `variant="description"`), suppression de la logique `isLeftImage`/alternance gauche-droite et du `styles.module.css` devenu orphelin (supprimé). `npm run lint` et `npx tsc --noEmit` passent. Vérification visuelle et comportementale réelle via script Playwright local (`mcp__playwright__*` non chargé dans cette session développeur — même contournement qu'US-005, cf. mémoire developer) : pas de débordement horizontal (375px/1440px), aucune erreur console imputable à FeaturedWorks/FeaturedCard (seuls les warnings pré-existants Menu/Avatar/FadeWhenVisible, déjà notés hors scope en US-005), `textStyle="title"`/`"subtitle"`/`"label"` confirmés appliqués via `getComputedStyle`. Captures : `screenshots/us006-works-desktop-dark.png`, `-desktop-light.png`, `-mobile-dark.png`, `-mobile-light.png`, `-desktop-dark-full.png` (grille 2×2 complète), `-ekaly-hover.png` (état survol avec lien visible).

## US-007 — Refonte Contact
**Priorité :** Moyenne
**Statut :** Terminé

Objectif : moderniser `GetInTouch`, garder l'accroche originale et les vrais moyens de contact.

Critères d'acceptation :
- [x] Email réel et lien GitHub conservés et fonctionnels. Vérifié par `curl` sur le HTML SSR (`/`) : 2 occurrences de `mailto:maeryrakotonindrina17@gmail.com` (Sidebar + GetInTouch), 0 occurrence de la coquille, et `href="https://github.com/Mahery-Rakotonindrina"` présent. Revérifié par script Playwright (lecture DOM réelle + clic/hover simulé) : les deux `mailto` et le lien GitHub résolvent vers les bonnes URLs, le lien GitHub réagit bien au survol (`hoverLift`).
- [x] **Bugfix** : coquille corrigée dans l'email `mailto` de la Sidebar (`components/Sidebar/index.tsx`) : `maeryrakotonidrina17@...` → `maeryrakotonindrina17@...`. Vérifié par `curl`/grep sur le HTML SSR : 0 occurrence de l'ancienne adresse, 2 occurrences (Sidebar + GetInTouch) de l'adresse corrigée, identiques.

Implémenté dans `components/Sections/GetInTouch/index.tsx` : accroche "On discute ?" et texte de présentation conservés caractère pour caractère (y compris l'animation décorative de l'émoji `(⁀ᗢ⁀)`), heading migré vers `Text as="h2" textStyle="title"` (retrait de l'ancien `Heading size="2xl"` + `style={{ fontVariantCaps: 'small-caps' }}` inline — le token `title` les porte nativement). Paragraphe en `variant="description" textStyle="body"`. Bloc crédits GitHub repensé avec séparateur `border.subtle`, texte en `textStyle="label"` (mono/majuscules), `hoverLift`/`hoverLiftReduced` sur le lien GitHub. Animation d'entrée `scrollReveal`/`scrollRevealReduced` en cascade (même pattern que Detail.tsx/Experience/FeaturedWorks).

**Bug introduit puis corrigé pendant cette US** : définir `motion(Stack)`/`motion(Text)`/`motion(Box)`/`motion(Link)` à l'intérieur du corps du composant (pattern utilisé tel quel dans Sidebar/Detail/Experience/FeaturedWorks) provoque ici une **boucle de remount infinie** spécifique à `GetInTouch`, car ce composant a son propre `useInView()` local (déclencheur de l'animation de l'émoji) : chaque bascule de `inView` re-render le composant, recréant de nouvelles identités de composants motion, forçant React à démonter/remonter tout l'arbre, ce qui recrée l'observer d'intersection, qui re-déclenche `inView`, etc. Détecté via `MutationObserver` sur `#contact` (~180 mutations/s avant correctif, empêchant même un hover fiable en test automatisé) — corrigé en hissant les 4 composants motion au niveau module (hors du corps de fonction), ramenant les mutations à 0/s, identique aux autres sections. Les autres sections n'ont pas ce problème car elles n'ont pas de hook local déclenchant un re-render en boucle, mais le pattern "motion() recréé à chaque render" reste un risque latent à surveiller si un futur hook d'état y est ajouté.

`npm run lint` et `npx tsc --noEmit` passent. Vérifié par script Playwright local (`mcp__playwright__*` non chargé dans cette session développeur — même contournement qu'US-005/006) : pas de débordement horizontal (375px/1440px, clair/sombre), `textStyle="title"`/`"label"` confirmés via `getComputedStyle` (36px/600 à 1440px, 30px à 375px, cohérent avec Experience/FeaturedWorks), hover GitHub confirmé (`transform: translateY(-4px)` après survol réel), `prefers-reduced-motion` respecté (`matchMedia` confirmé `true`, variante `scrollRevealReduced` sélectionnée — `transition` 0.01s au lieu de 0.6s). Aucune erreur console imputable à GetInTouch (seuls les warnings pré-existants `isDarkMode`/`boxSize`/`marginBottom` de Menu/Avatar, déjà notés hors scope en US-005/006). Captures : `screenshots/us007-contact-desktop-dark.png`, `-desktop-light.png`, `-mobile-dark.png`, `-mobile-light.png`, `-github-hover.png`, `-desktop-dark-reduced-motion.png`.

**Point non bloquant découvert et non corrigé (hors scope US-007, pré-existant à US-002)** : sous `prefers-reduced-motion`, les éléments animés par `whileInView` (pas `animate` au mount) au sein d'un groupe `staggerChildren` restent figés avec un résidu `translateY(32px)`/`translateY(24px)` selon le token, au lieu de `transform: none`. Cause : `useReducedMotion()` ne résout `true` qu'après un effet post-hydratation, donc la prop `initial` (appliquée une seule fois, de façon synchrone, au tout premier rendu) capture encore la variante normale (avec `y`) avant que la variante `*Reduced` (qui omet `y` au lieu de le fixer explicitement à `0`) ne prenne le relais — `animate`/`whileInView` n'ayant jamais pour cible explicite `y: 0` dans la variante réduite, la valeur reste bloquée à son offset initial. Reproduit à l'identique sur `Experience/index.tsx` (`h2` "Parcours professionnel.", déjà "Terminé" en US-005) avec la même méthode — confirme que ce n'est pas spécifique à GetInTouch mais un défaut de conception des tokens `heroBootReduced`/`scrollRevealReduced` dans `config/animations.ts` (US-002). Visuellement quasi imperceptible (décalage de 24-32px sur un élément déjà correctement opaque, pas de "mouvement" perçu, juste une position figée légèrement différente) et non lié aux 2 critères d'acceptation listés pour cette US. Non corrigé ici : `config/animations.ts` est un fichier partagé par toutes les sections déjà validées (US-003 à US-006) — un correctif (ajouter explicitement `y: 0`/valeur neutre dans chaque variante `*Reduced`) est a priori trivial mais mérite une décision du PO avant de toucher un fichier partagé hors du périmètre strict de cette US.

## US-008 — Navigation / Menu
**Priorité :** Moyenne
**Statut :** Terminé

Objectif : adapter le menu à la nouvelle identité visuelle sans casser la navigation par ancre existante (`#aboutMe`, `#jobs`, `#works`, `#contact`).

Critères d'acceptation :
- [x] Les 4 ancres existantes continuent de fonctionner. Vérifié par `curl` sur le HTML SSR (`href="#aboutMe"`/`#jobs`/`#works`/`#contact"`, un seul de chaque) et par script Playwright (clic réel sur chaque lien, section correspondante confirmée dans le viewport après clic). Cas particulier préexistant conservé à l'identique : sur desktop, "A propos" pointe vers `#` (retour en haut de page, où Sidebar + About sont déjà côte à côte) plutôt que `#aboutMe` — vérifié par clic réel (`scrollY` repasse de 2000 à 0).
- [x] Toggle dark/light mode conservé. Vérifié par script Playwright : clic sur le bouton (desktop, dans la nav ; mobile, barre du haut), `background-color` du `body` bascule vers `rgb(237, 242, 247)` (`bg.canvas` clair), captures `screenshots/us008-menu-desktop-light.png` / `-mobile-light.png`.
- [x] Menu mobile conservé fonctionnellement. Vérifié par script Playwright (375px) : ouverture du hamburger (icône 3 lignes → X), les 4 liens cliquables et lisibles, clic sur un lien referme le menu (icône repasse à 3 lignes, conteneur repoussé hors écran via `top: -100vh`) et fait défiler vers la bonne section, aucun débordement horizontal (`scrollWidth - clientWidth === 0`). Captures `screenshots/us008-menu-mobile-dark-closed.png`, `-open.png`, `-afterclick.png`.

Implémenté dans `components/Menu/Navigation.tsx`, `components/Menu/index.tsx`, `components/Menu/styles.module.css`, `components/Menu/toggle.tsx`. Les 4 liens (`Button variant="ghost"` legacy) remplacés par un `Link` Chakra + `textStyle="label"` (mono JetBrains Mono, majuscules, `letterSpacing: widest` — cohérent avec la direction "DEVELOPER.EXE"/HUD, `Link` n'a pas de `baseStyle` de taille de police qui bloquerait `textStyle`, contrairement à `Button`/`Heading`, cf. piège documenté post-US-004) ; les 4 items factorisés dans un tableau `NAV_ITEMS` (label/href/`desktopHref` optionnel pour le cas particulier "A propos") plutôt que 4 blocs JSX dupliqués. Couleurs recâblées sur les jetons sémantiques US-002 : bordure d'ouverture mobile `teal.500`/`cyan.200` (legacy, cassé en light — cf. bug `black.400` déjà documenté par le designer) → `accent.default` ; soulignement/couleur au survol (`styles.module.css`, `.blogBtn`) `#97DFFC`/`#121212` codés en dur → `var(--chakra-colors-accent-default)` (même convention de nommage que `#sidebarCircle`, US-003) ; fond translucide de la nav (`rgba(...)`) aligné sur les nouvelles valeurs `night.900 rgb(11,13,18)` (dark) — `gray.100 rgb(237,242,247)` (light) inchangé car déjà identique. `color.black`/`Menu/index.tsx` (jeton historique documenté par le designer comme "non touché") migré vers le jeton sémantique `bg.canvas` (US-008 est la première tâche à toucher réellement ce composant, migration cohérente avec le reste du design system). Bug latent corrigé au passage (letterSpacing={2} sur l'ancien `Button` : valeur numérique sans unité, hors échelle `letterSpacings` du thème, silencieusement invalide — remplacée par le token `widest` via `textStyle="label"`, même catégorie de bug que `fontSize="smaller"` déjà corrigé en US-003/004/005).

**Bonus traité** : warning console `isDarkMode` sur l'élément DOM `motion.path` (`components/Menu/toggle.tsx`) corrigé — `isDarkMode` déstructuré hors des props transmises au DOM (`{isDarkMode, ...pathProps}`), typé via `SVGMotionProps<SVGPathElement> & { isDarkMode?: boolean }` (pas de `any`).

**Piège découvert et corrigé pendant cette US — résidu de transform sous `prefers-reduced-motion` (variante plus grave que le point déjà documenté en US-007)** : `MotionContainer = motion(Container)` était défini dans le corps de `Navigation` (comme Sidebar/Detail/Experience/FeaturedWorks) alors que `Navigation` a son propre état local (`useCycle` pour le menu mobile) — hissé au niveau module pour éviter un remount à chaque ouverture/fermeture (même piège que GetInTouch, US-007). Plus significatif : les contreparties `*Reduced` ajoutées ici (`mobileMenuVariantsReduced` dans `index.tsx`, `menuAnimReduced` dans `Navigation.tsx`) omettaient initialement `y` (suivant la convention des tokens partagés `heroBootReduced`/`scrollRevealReduced`, cf. bug non bloquant documenté en US-007). Vérifié par script Playwright (`reducedMotion: 'reduce'` émulé) : la barre de menu mobile restait **hors-écran en permanence** (`translateY(-80px)` résiduel, bouton hamburger inatteignable) — contrairement au résidu de 24-32px quasi imperceptible documenté en US-007, ici le menu mobile devenait totalement inutilisable sous `prefers-reduced-motion`. Cause : `useReducedMotion()` ne s'étant pas encore résolu à `true` au moment du tout premier rendu, `initial="hidden"` capture la variante normale (`y: -80`) ; la variante réduite qui prend ensuite le relais n'ayant jamais `y` comme cible explicite, Framer Motion laisse la valeur courante inchangée au lieu de la réinitialiser. **Corrigé** en ajoutant `y: 0` explicite dans les deux états des deux nouvelles variantes réduites (contrairement aux tokens partagés `config/animations.ts`, ce sont des objets locaux à `components/Menu/`, donc pas besoin d'aval du PO pour les corriger — `config/animations.ts` lui-même n'a pas été touché). Reproduit avant/après correctif via `boundingBox()` du bouton hamburger (`y: -64` → `y: 16`, capture `screenshots/us008-menu-mobile-dark-reduced-motion-open.png`).

Vérifié par script Playwright local (`mcp__playwright__*` non chargé dans cette session développeur — même contournement qu'US-005/006/007). `npm run lint` et `npx tsc --noEmit` passent. Aucune erreur console imputable à Menu/Navigation/toggle (warning `isDarkMode` éliminé ; les erreurs `boxSize`/`marginBottom` restantes viennent d'`Avatar`, hors scope, déjà notées en US-005/006/007). Captures : `screenshots/us008-menu-desktop-dark.png`, `-desktop-light.png`, `-desktop-dark-scrolled.png` (nav collapsée en pastille au scroll, comportement préexistant conservé), `-mobile-dark-closed.png`, `-mobile-dark-open.png`, `-mobile-dark-afterclick.png`, `-mobile-light.png`, `-mobile-dark-reduced-motion-open.png`.

**Bug post-validation corrigé par le PO — mismatch d'hydratation React sous `prefers-reduced-motion`** : la vérification ci-dessus n'avait testé l'émulation `reduced-motion` qu'*après* le chargement de la page, pas dès le premier rendu. En émulant la préférence *avant* un chargement frais, la console affichait un vrai warning React (`Prop style did not match`) sur `Navigation.tsx` puis, une fois celui-ci corrigé, un second identique sur `Menu/index.tsx` (même pattern `useReducedMotion()` + `initial`). Cause racine : `useReducedMotion()` (Framer Motion) résout `window.matchMedia` de façon synchrone dès le tout premier rendu client, alors que le SSR (pas de `window`) calcule toujours la variante normale — avec `y: 0` explicite dans les variantes `*Reduced` (nécessaire pour le bug ci-dessus), ce décalage produit un `transform` différent entre serveur et client. **Corrigé** dans les deux fichiers : `shouldReduceMotion` n'est plus lu directement depuis `useReducedMotion()` pour piloter `variants`/`initial`, mais mis en cache dans un `useState(false)` synchronisé après montage via `useEffect` — le tout premier rendu client reste donc identique au SSR. Re-vérifié par le PO via `mcp__chrome-devtools__*` (émulation avant chargement) : plus aucun warning sur Navigation/Menu ; seul un warning préexistant et déjà documenté (Sidebar, tokens partagés `config/animations.ts`, hors scope) subsiste. Menu mobile toujours accessible sous `prefers-reduced-motion` (pas de régression).

**Non traité, hors des 3 critères d'acceptation formels (décision assumée, pas un oubli)** : les tokens `navIndicatorTransition`/`navIndicatorReducedTransition` (`config/animations.ts`, 4ᵉ animation signature US-002, prévue pour "le déplacement de l'indicateur de section active du menu") restent inutilisés — aucune logique de scroll-spy (détection de la section actuellement visible) n'a été ajoutée. Un simple soulignement au survol/focus (couleur `accent.default`, token-driven) a été préféré, cohérent avec un des deux choix proposés par la tâche ("hoverLift ou un style de soulignement/indicateur actif") et avec la règle anti-sur-ingénierie (pas de nouvelle fonctionnalité de tracking de scroll non demandée explicitement dans les critères d'acceptation). À arbitrer avec le PO si un vrai indicateur de section active est souhaité — l'implémentation câblerait alors ces deux tokens déjà prêts.

## US-009 — Responsive complet
**Priorité :** Haute
**Statut :** Terminé

Objectif : vérifier et adapter chaque section à mobile (~375px), tablette (~768px) et desktop (~1280px+).

Critères d'acceptation :
- [x] Aucun débordement horizontal. Vérifié par le testeur (`scrollWidth === clientWidth`) sur les 3 largeurs × 2 thèmes, pour toutes les sections, y compris menu mobile ouvert et modal de compétences ouvert.
- [x] Textes lisibles sur mobile. Vérifié à 375px et 768px pour toutes les sections (la tablette, non détaillée avant cette US sauf pour la Sidebar, a été vérifiée section par section). **Bug trouvé et corrigé** : le fond du menu mobile/tablette ouvert (`rgba(...)` translucide posé en US-008) laissait transparaître le texte de la Sidebar en arrière-plan, superposé aux liens de nav — remplacé par le jeton opaque `bg.canvas` dans `components/Menu/Navigation.tsx`. Re-vérifié par le PO : plus de chevauchement, aucune régression du fix d'hydratation `prefers-reduced-motion` ni du rendu desktop (pill de nav au scroll).
- [x] Interactions tactiles correctes. Vérifié par le testeur : menu mobile (ouverture/fermeture/clic sur lien) fonctionnel à 375px et 768px, modal de compétences accessible et sans débordement aux deux largeurs.

Recoupement QA (US-010) effectué dans la même passe : lint/typecheck, ancres, toggle dark/light, modal (9 catégories), lien "Voir le projet" (E-Kaly uniquement), pas de nouvelle erreur console. Tentative de reproduction du bug non-reproductible noté en US-006 (`FeaturedCard`, resize rapide) — toujours non reproduit. Détails dans `.claude/memory/tester.md` et `.claude/memory/developer.md`. Captures `screenshots/us009-*.png`.

## US-010 — QA et optimisation
**Priorité :** Haute
**Statut :** Terminé

Objectif : vérification QA indépendante avant finalisation.

Critères d'acceptation :
- [x] Build et lint passent. `npm run build` (production, pas juste dev) vérifié propre par le PO après arrêt du serveur dev, aucune erreur. `npm run lint` vert à chaque étape.
- [x] Navigation/liens/ancres vérifiés réellement (Playwright/contournement équivalent). Voir US-009 — les 4 ancres cliquées réellement, `scrollY` confirmé.
- [x] Accessibilité vérifiée (contrastes, clavier, alt text). Audit complet par le testeur (axe-core + vérifications manuelles) : contrastes OK partout (clair/sombre), alt text présent et pertinent sur les 8 images du site. 5 findings clavier trouvés et traités : **corrigés** — bouton hamburger sans nom accessible (`aria-label`/`aria-expanded`/`aria-controls` ajoutés), absence de piège de focus dans le menu mobile ouvert (`inert` posé sur le contenu principal pendant l'ouverture), `Escape` ne fermait pas le menu (ajouté, rend le focus au bouton). Lien "mail" (GetInTouch) pas assez distinguable sans la couleur — soulignement ajouté. Un 5e point (soulignement de focus apparemment neutralisé sur la nav) a été **investigué et laissé tel quel** : vérifié par mesure réelle (`getComputedStyle` avant/après hover/focus) que ce n'était pas un bug — le lien change bien visuellement au survol/focus, le finding initial était basé sur une lecture du CSS sans mesure. Tout re-vérifié par le PO via `mcp__chrome-devtools__*` : hamburger nommé, focus piégé (`inert` confirmé), `Escape` ferme et rend le focus, lien mail souligné.
- [x] Pas d'erreur console. Aucune erreur imputable au code applicatif sur l'ensemble du site, 3 largeurs × 2 thèmes. Seul résidu documenté et accepté comme hors scope : un warning `transform` sous `prefers-reduced-motion` sur `Sidebar` (tokens partagés `heroBoot`/`scrollReveal` de `config/animations.ts`, cosmétique — quelques pixels de décalage, pas de dysfonctionnement), à corriger seulement si le PO arbitre un jour de toucher ces tokens partagés par toutes les sections déjà "Terminé".
- [x] Responsive vérifié aux 3 largeurs. Voir US-009 (passe complète 375/768/1280px × clair/sombre, toutes sections).
- [x] Aucune régression sur les fonctionnalités existantes. Modal de compétences (9 catégories, ouverture clavier/souris, `Escape` ferme et rend le focus), dark/light mode (toggle desktop et mobile), navigation par ancre, galerie Projects (lien conditionnel), timeline Experience (remplace les anciens tabs — comportement équivalent, lecture sans clic requis). Rien cassé par les correctifs d'accessibilité (cycle ouverture/fermeture du menu re-testé après coup, y compris sous `prefers-reduced-motion`).

## US-011 — Finalisation Git / Pull Request
**Priorité :** Haute
**Statut :** À faire

Objectif : committer, pousser la branche, ouvrir la PR vers `develop`.

Critères d'acceptation :
- [x] Commits réguliers, messages clairs, aucune mention d'IA. 11 commits sur `feature/portfolio-redesign`, un par US (+ un correctif), aucune ligne de co-auteur/mention Claude/IA, conformément à `RULES.md`.
- [x] Branche poussée sur origin. `git status -sb` confirme `feature/portfolio-redesign` à jour avec `origin/feature/portfolio-redesign`, 10 commits d'avance sur `origin/develop`.
- [ ] Pull Request créée vers `develop`. `gh` CLI non installé sur cette machine (ni Bash ni PowerShell) — conformément à la consigne, pas d'installation d'outil supplémentaire pour ça : lien de création manuelle fourni à l'utilisateur à la place.

---

# Phase 2 — "Boot Sequence" : expérience immersive

> Déclenchée par le retour explicite de l'utilisateur après la Phase 1 (US-001 à US-011) : "Le portfolio ressemble toujours à un site classique avec des sections statiques [...] Ce n'est absolument pas le résultat que je recherche." La Phase 1 reste acquise (données, accessibilité, palette/typo, responsive) — cette phase change la mécanique de navigation et le comportement de chaque section, pas leur habillage. Proposition complète : `DESIGN_PROPOSAL_V2.md`. Évaluation de faisabilité technique : `.claude/memory/developer.md`. Utilisateur absent pour la journée — arbitrage proposition/faisabilité fait par le PO en autonomie (feu vert designer + feu vert technique developer, aucun point bloquant remonté), à faire valider par l'utilisateur ce soir à son retour.

## US-012 — Fondation : scroll à inertie (Lenis) + intégration GSAP/Framer Motion
**Priorité :** Haute (bloquant pour toutes les US suivantes de cette phase)
**Statut :** À faire

Objectif : poser le scroll à inertie global (Lenis) qui sert de fondation à toutes les scènes scrubbed des US suivantes, sans rien casser de l'existant.

Critères d'acceptation :
- [x] `lenis` installé (`^1.3.27`), scroll à inertie actif globalement sur desktop, amorti réduit sur tactile (proche du scroll natif), désactivé (retour au scroll natif pur) sous `prefers-reduced-motion` (`respectReducedMotion: true` natif de Lenis).
- [x] Les 4 ancres du `Menu` (`#aboutMe`, `#jobs`, `#works`, `#contact`) continuent de fonctionner via l'option native `anchors: true` de Lenis — aucune régression sur US-008/US-010 (focus clavier, accessibilité du menu).
- [x] GSAP installé (`^3.15.1`, ScrollTrigger inclus dans le même package) et synchronisé avec Lenis via le snippet officiel (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add` + `lagSmoothing(0)`) — pas encore utilisé par une vraie scène (ça viendra avec US-018 Projects), juste la fondation posée et vérifiée fonctionnelle.
- [ ] `position: fixed` de la Sidebar (US-003) testé explicitement avec Lenis actif, y compris sur Safari (limitation connue documentée par Lenis sur macOS pre-M1). **Partiellement vérifié** : confirmé fonctionnel sur Chromium (position inchangée après scroll profond, voir `screenshots/us012-desktop-sidebar-fixed-scrolled.png`). Safari/macOS non testable depuis cette machine Windows — reste à vérifier par l'utilisateur.
- [x] Aucune régression sur le reste du site (toutes les US de la Phase 1 revérifiées rapidement après cette fondation).

## US-013 — Hero/Sidebar : séquence de boot
**Priorité :** Haute
**Statut :** Développement terminé, reste build complet + revue PO/testeur

Objectif : transformer le chargement en mise en scène du démarrage de "DEVELOPER.EXE" (journal de boot avec les vraies données, décodage du nom par scramble, grille en profondeur réactive à la souris).

Critères d'acceptation :
- [x] Journal de boot (vraies données déjà affichées ailleurs, aucun texte inventé) en cascade typewriter au montage, une seule fois.
- [x] Décodage du nom par effet scramble (hook custom maison, aucune dépendance), stagger lettre par lettre.
- [x] Grille en perspective CSS en arrière-plan, parallaxe douce à la souris (desktop uniquement, `useSpring`), active en permanence (pas seulement au chargement) puisque la Sidebar reste fixe sur desktop.
- [x] Mobile/tablette : boot log + scramble conservés à l'identique (pas de dépendance au pointeur), grille statique (pas de parallaxe), pas de flottement idle de l'avatar.
- [x] `prefers-reduced-motion` : scramble supprimé (fondu simple), boot log affiché d'un bloc, grille statique sans réaction souris, aucun flottement.
- [x] Aucune régression sur les vraies données (nom, titre, bio, CTA contact, réseaux sociaux — toujours affichés et fonctionnels).

Détails dans `.claude/memory/developer.md`. `npm run build` non exécuté (serveur dev déjà actif sur le port 3000) — lint/typecheck passent, reste à faire par le PO avant validation finale.

## US-014 — Fil conducteur : cadre HUD + jauge de progression
**Priorité :** Moyenne
**Statut :** Terminé

Objectif : câbler enfin les tokens `navIndicatorTransition`/`navIndicatorReducedTransition` (posés en US-002, jamais utilisés, dette documentée en US-008) en une jauge de progression à travers les 5 scènes, complémentaire au `Menu` existant (pas un remplacement).

Critères d'acceptation :
- [x] Desktop : cadre HUD fin aux bords de l'écran + jauge latérale avec 5 repères numérotés, repère actif en `accent.default`, chaque repère cliquable et atteignable au clavier (scrolle vers l'ancre correspondante).
- [x] Mobile : barre fine en haut, pas de repères cliquables individuels (la navigation par ancre reste via le Menu hamburger).
- [x] `prefers-reduced-motion` : remplissage de la jauge en saut instantané (pas de transition animée), changement de couleur des repères sans pulsation.
- [x] Le `Menu` existant (US-008/US-010) reste la navigation accessible de référence, intact — aucune régression dessus.

Détails dans `.claude/memory/developer.md`. `npm run build` non exécuté (serveur dev déjà actif sur le port 3000) — lint/typecheck passent, reste à faire par le PO avant validation finale.

## US-015 — About : révélation scrubbed par balayage
**Priorité :** Moyenne
**Statut :** Terminé

Objectif : remplacer le `scrollReveal` générique du texte de présentation par une révélation pilotée par la position de scroll (`clip-path`), avec un teaser orbital sur le CTA compétences.

Critères d'acceptation :
- [x] Desktop : verrouillage bref (`position: sticky`, pas de GSAP nécessaire) pendant lequel chaque bloc de texte réel se révèle par balayage `clip-path` à un seuil de progression distinct.
- [x] Teaser au survol du CTA "Mon attirail de développeur" : libellés des 9 catégories réelles de `config/skills.ts` qui orbitent légèrement près du curseur (aucune métrique, juste les noms).
- [x] Mobile/tablette : même effet visuel de balayage mais déclenché à l'entrée dans le viewport (pas de verrouillage de scroll), pas de teaser orbital (pas de survol tactile).
- [x] `prefers-reduced-motion` : fondu d'opacité simple, pas de verrouillage de scroll, pas de teaser orbital.
- [x] Texte de présentation réel conservé intégralement (aucune réécriture de contenu).

Détails, pièges (3 bugs trouvés et corrigés en vérification) et point de layout à faire valider par le designer/PO dans `.claude/memory/developer.md`. `npm run build` non exécuté (serveur dev déjà actif sur le port 3000) — lint/typecheck passent, reste à faire par le PO avant validation finale.

## US-016 — Skills : overlay plein écran en carte de relations
**Priorité :** Moyenne
**Statut :** Terminé (lint/tsc OK, `npm run build` non exécuté — serveur dev déjà actif sur le port 3000, à faire par le PO)

Objectif : remplacer la `Modal` Chakra actuelle (US-004) par un overlay plein écran présentant les 9 catégories réelles comme des nœuds reliés, en conservant tous les acquis d'accessibilité (focus trap, `Escape`, `aria-*` — US-004/US-010).

Critères d'acceptation :
- [x] Desktop : disposition radiale des 9 catégories autour d'un centre, traits de connexion animés au survol (`stroke-dashoffset`), compétences réelles en chips au survol/clic (épinglage au clic).
- [x] Mobile/tablette : accordéon vertical des 9 catégories (disposition radiale non tactile), même comportement de dépliement des compétences réelles.
- [x] `prefers-reduced-motion` : pas de pouls lumineux animé, dépliage quasi instantané, chips directement à l'état final.
- [x] Toutes les compétences réelles de `config/skills.ts` restent accessibles, aucune métrique/niveau/pourcentage inventé (contrainte dure héritée d'US-004).
- [x] Accessibilité : focus trap, fermeture `Escape`, navigation clavier — repart des acquis US-004/US-010, aucune régression.

Détails, pièges (quirk flexbox imbriqué pour le centrage vertical, piège de test `.click()` JS vs focus réel pour vérifier le retour de focus) dans `.claude/memory/developer.md`.

## US-017 — Experience : timeline qui se dessine au scroll
**Priorité :** Moyenne
**Statut :** Terminé (lint/tsc OK, `npm run build` non exécuté — serveur dev déjà actif sur le port 3000, à faire par le PO)

Objectif : rendre le tracé de la timeline (US-005) proportionnel à la progression du scroll, chaque point s'allumant quand le tracé l'atteint, synchronisé avec la révélation de la carte correspondante.

Critères d'acceptation :
- [x] Tracé SVG (ou `scaleY`) piloté par `useScroll`/`useTransform` (Framer Motion, pas de GSAP nécessaire), mécanisme identique desktop/mobile.
- [x] Chaque point (Domoti, Vivetic, Pushtech, données réelles de `config/experience.tsx`) s'allume en `accent.default` exactement quand le tracé l'atteint, carte correspondante révélée au même instant.
- [x] `prefers-reduced-motion` : ligne entièrement tracée dès l'entrée dans le viewport, tous les points déjà allumés, cartes en fondu simple.
- [x] Les 3 entreprises, durées et descriptions réelles conservées intégralement (acquis US-005).

Détail du mécanisme, piège d'indentation ESLint rencontré, et méthode de vérification dans `.claude/memory/developer.md`.

## US-018 — Projects : galerie horizontale pilotée par le scroll (GSAP)
**Priorité :** Haute
**Statut :** Développement terminé, reste build complet + revue PO/testeur

Objectif : remplacer la grille statique 2×2 (US-006) par une galerie en défilement horizontal piloté par le scroll vertical (pin + scrub GSAP ScrollTrigger), avec vue de détail en morph et fallback statique en `prefers-reduced-motion`.

Critères d'acceptation :
- [x] GSAP (déjà installé depuis US-012, `^3.15.1`, ScrollTrigger inclus) utilisé pour le pin GSAP ScrollTrigger desktop ; `gsap.matchMedia()`/`ScrollTrigger.matchMedia` (même API, utilisée ici via `gsap.matchMedia()` pour un typage TS propre — détail dans `.claude/memory/developer.md`) pour le switch desktop/mobile, testé réellement au resize réel de fenêtre dans les deux sens (pas seulement au chargement initial). Aucune nouvelle dépendance ajoutée (pas de `@react-three/fiber` ici, hors scope de cette US — réservé à US-019).
- [x] Les 4 projets réels (Becquet!, GIPROD Androy, E-Kaly, GESCOM) et leurs vraies données (`config/works.ts`, non modifié) conservés intégralement ; le lien "voir le projet" ne s'affiche que pour une vraie URL externe valide (fonction `isExternalProjectLink` d'US-006 réutilisée à l'identique, désormais exportée — vérifié dans 3 contextes : carte galerie, grille reduced-motion, vue de détail — seule E-Kaly l'affiche dans les trois).
- [x] Survol (desktop) : scale de l'image (`_groupHover`, confirmé `scale(1.06)` via `getComputedStyle` réel) + overlay révélant index/titre (décoratifs) et lien conditionnel (réel). Clic : morph via `layoutId` (Framer Motion) vers une vue de détail (`ProjectDetailModal`) avec le texte complet réel (identique à `config/works.ts`, aucun mot inventé) — vérifié par lecture du DOM de la modal après clic réel.
- [x] Mobile/tactile : pas de scroll-jacking — swipe horizontal natif (`scroll-snap` CSS, actif par défaut sans JS), `data-lenis-prevent` posé sur le conteneur. Vérifié : `scrollLeft` du conteneur avance bien au swipe (0→340), et le scroll vertical de la page n'est pas bloqué juste après (testé en partant d'une position avec de la marge de scroll restante, pas juste en bas de page).
- [x] `prefers-reduced-motion` : pin + scroll-jacking entièrement désactivés (aucune instance ScrollTrigger créée), retour à la grille statique 2×2 existante (US-006) via CSS pur (`@media (prefers-reduced-motion: reduce)`, aucune dépendance React/hydratation) — même contenu, mécanique différente. Vérifié : scroll vertical normal confirmé non bloqué (`scrollY` avance proportionnellement au wheel), aucun pin.
- [x] Le composant Projects (markup/texte réel) n'est jamais rendu `ssr:false` dans son ensemble — seule la logique GSAP est client-only (`useEffect`). Vérifié par `curl` sur le HTML SSR : les 4 titres réels présents dans le HTML généré côté serveur.

**Bug GSAP trouvé et corrigé en vérification (pas un simple détail cosmétique)** : `pinSpacing` est silencieusement désactivé par défaut par GSAP quand le parent direct de l'élément pinné est `display: flex` (notre cas — `Stack` Chakra) ; sans le forcer explicitement (`pinSpacing: 'padding'`), le pin s'engageait visuellement (`position: fixed` confirmé) mais sans jamais réserver l'espace de scroll nécessaire, donc la section Contact remontait et chevauchait la galerie avant la fin du défilement horizontal prévu. Détail complet, cause racine (trouvée en lisant le code source GSAP) et méthode de vérification avant/après dans `.claude/memory/developer.md`.

`npm run lint` et `npx tsc --noEmit` passent. `npm run build` non exécuté (serveur dev déjà actif sur le port 3000, convention établie depuis US-013) — à faire par le PO avant validation finale. Captures : `screenshots/us018-gallery-desktop-dark-pinned-mid.png`, `-gallery-card-hover.png`, `-detail-morph-desktop-dark.png`, `-gallery-mobile-dark-swipe.png`, `-gallery-resized-to-mobile.png`, `-gallery-desktop-dark-reduced-motion-grid.png`.

## US-019 — Contact : scène de clôture avec forme 3D ambiante
**Priorité :** Moyenne
**Statut :** À faire

Objectif : scène finale avec une forme filaire 3D minimaliste (React Three Fiber), rappel de l'effet scramble du Hero sur l'email, copie en un clic.

Critères d'acceptation :
- [ ] `@react-three/fiber@^8.18.0` + `@react-three/drei@^9.122.0` + `three@^0.187.0` (versions exactes validées par le developer — jamais un install nu qui résoudrait sur une version React 19-only incompatible).
- [ ] Chargement `next/dynamic(ssr:false)`, montage uniquement quand Contact entre dans le viewport (réutilise le pattern `useInView` déjà présent dans `GetInTouch`) — zéro coût sur le chargement initial du site.
- [ ] Forme 3D : rotation autonome lente, réagit légèrement à la souris en offset additif (desktop), rotation autonome seule sur mobile (pas de demande de permission gyroscope).
- [ ] Email réel et lien GitHub réel conservés et fonctionnels (`mailto:` existant intact) ; clic sur l'email copie dans le presse-papiers en plus, avec confirmation visuelle.
- [ ] `prefers-reduced-motion` : le canvas 3D n'est **pas monté du tout** (ni chargé ni rendu statique), remplacé par un fond décoratif plat ; scramble de l'email devient un fondu simple.

## US-020 — Curseur personnalisé et micro-interactions desktop
**Priorité :** Basse
**Statut :** À faire

Objectif : curseur personnalisé contextuel (desktop uniquement, `@media (hover: hover) and (pointer: fine)`) avec effet magnétique ciblé sur 3 familles d'éléments précises.

Critères d'acceptation :
- [ ] Anneau qui suit le pointeur avec ressort (`useSpring`), états contextuels précis (grossit sur lien/bouton générique, label "VOIR" sur une carte Projects avec vrai lien uniquement, "+" sur un nœud Skills).
- [ ] Effet magnétique limité à 3 familles de cibles (icônes sociales Hero, nœuds Skills, repères de la jauge HUD) — pas généralisé à tout élément cliquable.
- [ ] Mobile/tactile : curseur personnalisé entièrement absent ; les affordances qu'il portait ("VOIR", "+") deviennent des badges statiques toujours visibles.
- [ ] `prefers-reduced-motion` : curseur personnalisé entièrement désactivé (retour au curseur système), affordances en badges statiques (même traitement que mobile).
- [ ] Ne masque jamais l'indicateur de focus clavier natif (acquis d'accessibilité US-010 préservé).

## US-021 — QA et accessibilité Phase 2
**Priorité :** Haute
**Statut :** À faire

Objectif : vérification QA indépendante de toute la Phase 2 avant mise à jour finale de la PR, équivalent d'US-010 pour les nouveaux éléments.

Critères d'acceptation :
- [ ] Build et lint passent avec les 3 nouvelles dépendances installées.
- [ ] Perf/Core Web Vitals mesurés réellement (Lighthouse ou équivalent) — pas juste l'estimation de faisabilité, une mesure après implémentation complète.
- [ ] `prefers-reduced-motion` vérifié scène par scène (pas qu'une vérification globale) : chaque fallback décrit dans `DESIGN_PROPOSAL_V2.md` fonctionne réellement.
- [ ] Accessibilité clavier revérifiée sur les nouveaux éléments (jauge HUD, overlay Skills radial, morph détail Projects, curseur) — aucune régression sur les acquis US-010.
- [ ] Responsive vérifié aux 3 largeurs sur toutes les nouvelles scènes.
- [ ] `ScrollTrigger.matchMedia` testé au resize réel (pas qu'au chargement à largeur fixe) — piège explicitement remonté par le developer en faisabilité.
- [ ] Safari testé explicitement (limitation connue Lenis + `position: fixed` sur macOS pre-M1).
- [ ] Aucune régression sur la Phase 1 (US-001 à US-011) dans son ensemble.

## US-022 — Mise à jour de la Pull Request existante
**Priorité :** Haute
**Statut :** À faire

Objectif : pousser tous les commits de la Phase 2 sur la branche `feature/portfolio-redesign` existante (la PR déjà ouverte par l'utilisateur vers `develop` se met à jour automatiquement — pas de nouvelle PR à créer) et fournir un résumé final en français des changements de cette phase.

Critères d'acceptation :
- [ ] Tous les commits de la Phase 2 poussés sur `feature/portfolio-redesign`, messages clairs, aucune mention d'IA.
- [ ] Résumé final en français fourni à l'utilisateur : ce qui a changé par rapport à la Phase 1, les nouvelles dépendances ajoutées et pourquoi, les points de vigilance restants.

---

## Audit — points faibles et bugs identifiés (US-001)

- **CV téléchargeable : fonctionnalité inexistante.** Le seul PDF dans `public/` (`LawingcoMarcJhon2021v2.pdf`) n'est référencé nulle part dans le code et porte un nom qui ne correspond pas à l'utilisateur — ce n'est manifestement pas le vrai CV. Aucun bouton de téléchargement de CV n'existe actuellement. **Décision : ne pas fabriquer de faux CV/lien** ; le Hero sera conçu sans CTA de téléchargement CV fonctionnel, à ajouter plus tard si un vrai fichier est fourni.
- **Bug contact** : coquille dans l'email `mailto` de la Sidebar (voir US-007).
- **Bug projets** : `ctaUrl` cassé/trompeur sur 2 des 4 projets (voir US-006).
- **Typo mineure non touchée** : "Igénieur" dans `config/experience.tsx` (texte personnel de l'utilisateur, laissé tel quel — pas une donnée technique, pas de notre ressort de le corriger sans demande explicite).
- **Composant mort** : `components/Sections/DevToArticles` n'est importé nulle part — laissé en l'état (hors scope de cette refonte visuelle, pas supprimé sans demande).
- **Stack** : Next.js 14.2 (pages router), Chakra UI 2.x, Framer Motion 11, TypeScript strict. `.nvmrc` obsolète (v14.17.1) déjà signalé précédemment, sans impact sur cette mission.
