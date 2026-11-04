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
**Statut :** À faire

Objectif : moderniser `GetInTouch`, garder l'accroche originale et les vrais moyens de contact.

Critères d'acceptation :
- [ ] Email réel et lien GitHub conservés et fonctionnels.
- [ ] **Bugfix** : corriger la coquille dans l'email `mailto` de la Sidebar (`maeryrakotonidrina17@...` → `maeryrakotonindrina17@...`, incohérent avec le reste du site).

## US-008 — Navigation / Menu
**Priorité :** Moyenne
**Statut :** À faire

Objectif : adapter le menu à la nouvelle identité visuelle sans casser la navigation par ancre existante (`#aboutMe`, `#jobs`, `#works`, `#contact`).

Critères d'acceptation :
- [ ] Les 4 ancres existantes continuent de fonctionner.
- [ ] Toggle dark/light mode conservé.
- [ ] Menu mobile conservé fonctionnellement.

## US-009 — Responsive complet
**Priorité :** Haute
**Statut :** À faire

Objectif : vérifier et adapter chaque section à mobile (~375px), tablette (~768px) et desktop (~1280px+).

Critères d'acceptation :
- [ ] Aucun débordement horizontal.
- [ ] Textes lisibles sur mobile.
- [ ] Interactions tactiles correctes.

## US-010 — QA et optimisation
**Priorité :** Haute
**Statut :** À faire

Objectif : vérification QA indépendante avant finalisation.

Critères d'acceptation :
- [ ] Build et lint passent.
- [ ] Navigation/liens/ancres vérifiés réellement (Playwright).
- [ ] Accessibilité vérifiée (contrastes, clavier, alt text).
- [ ] Pas d'erreur console.
- [ ] Responsive vérifié aux 3 largeurs.
- [ ] Aucune régression sur les fonctionnalités existantes (modal compétences, tabs expériences, dark/light mode).

## US-011 — Finalisation Git / Pull Request
**Priorité :** Haute
**Statut :** À faire

Objectif : committer, pousser la branche, ouvrir la PR vers `develop`.

Critères d'acceptation :
- [ ] Commits réguliers, messages clairs, aucune mention d'IA.
- [ ] Branche poussée sur origin.
- [ ] Pull Request créée vers `develop` (ou instructions manuelles si `gh` indisponible/non authentifié).

---

## Audit — points faibles et bugs identifiés (US-001)

- **CV téléchargeable : fonctionnalité inexistante.** Le seul PDF dans `public/` (`LawingcoMarcJhon2021v2.pdf`) n'est référencé nulle part dans le code et porte un nom qui ne correspond pas à l'utilisateur — ce n'est manifestement pas le vrai CV. Aucun bouton de téléchargement de CV n'existe actuellement. **Décision : ne pas fabriquer de faux CV/lien** ; le Hero sera conçu sans CTA de téléchargement CV fonctionnel, à ajouter plus tard si un vrai fichier est fourni.
- **Bug contact** : coquille dans l'email `mailto` de la Sidebar (voir US-007).
- **Bug projets** : `ctaUrl` cassé/trompeur sur 2 des 4 projets (voir US-006).
- **Typo mineure non touchée** : "Igénieur" dans `config/experience.tsx` (texte personnel de l'utilisateur, laissé tel quel — pas une donnée technique, pas de notre ressort de le corriger sans demande explicite).
- **Composant mort** : `components/Sections/DevToArticles` n'est importé nulle part — laissé en l'état (hors scope de cette refonte visuelle, pas supprimé sans demande).
- **Stack** : Next.js 14.2 (pages router), Chakra UI 2.x, Framer Motion 11, TypeScript strict. `.nvmrc` obsolète (v14.17.1) déjà signalé précédemment, sans impact sur cette mission.
