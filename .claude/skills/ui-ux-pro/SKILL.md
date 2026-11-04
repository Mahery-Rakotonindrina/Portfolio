---
name: ui-ux-pro
description: Transforme n'importe quelle tâche de design du portfolio (Next.js 14, Chakra UI, Framer Motion) en un résultat de niveau pro plutôt qu'amateur. Utilise ce skill SYSTÉMATIQUEMENT avant toute tâche touchant au visuel — nouvelle section, refonte d'un composant, choix de couleur/typo, layout responsive, animation, ou revue d'un rendu existant — même si la demande ne mentionne pas explicitement "UI/UX" ou "design". Contient des règles chiffrées (contraste, grille, breakpoints), une checklist de self-review, et la liste des erreurs qui trahissent un design amateur.
---

# Designer pro — Portfolio (Next.js / Chakra UI / Framer Motion)

Objectif : produire un design qui a l'air pensé par un designer senior, pas assemblé composant par composant. La différence entre "pro" et "amateur" tient rarement à une fonctionnalité en plus — elle tient à la cohérence, à l'espace blanc, et au soin des détails.

## 0. Avant de dessiner quoi que ce soit

Lis `config/theme.ts` (thème Chakra existant) et `config/animations.ts` avant de proposer quoi que ce soit de nouveau. Ce projet a déjà une identité :
- Mode sombre par défaut, fond `#121212` en dark / `gray.100` en light.
- Police unique : `Poppins`.
- Couleur d'accent : `teal.500` (light) / `cyan.200` (dark) — utilisée pour liens, emphasis, bordures actives.
- Esthétique sobre : bordures nettes (`borderRadius: 0` sur le variant `outlineAlternative`), pas d'ombres lourdes ni de dégradés criards.

**Règle** : une tâche de design doit renforcer cette identité, pas la diluer. N'introduis une nouvelle couleur, police, ou pattern visuel que si la tâche le demande explicitement. Ajouter une troisième couleur d'accent ou une deuxième police est la manière la plus rapide de faire passer un portfolio de "pro" à "bricolé".

## 1. Hiérarchie visuelle & typographie

- Une page sans hiérarchie claire se lit comme un mur de texte. Chaque section doit avoir **un** point d'entrée visuel évident (un titre, une image, ou un chiffre clé) — pas trois éléments qui se battent pour l'attention.
- Échelle typographique : utilise les tailles Chakra (`sm`, `md`, `lg`, `xl`, `2xl`, `3xl`...) en respectant un ratio cohérent plutôt que des valeurs arbitraires (ex: `14px`). Une échelle qui marche bien : chaque niveau ≈ ×1.25 à ×1.5 du précédent.
- `line-height` : 1.1–1.25 pour les titres (serrés, impactants), 1.5–1.7 pour le texte courant (lisible). Un titre avec un line-height de 1.6 paraît mou ; un paragraphe avec un line-height de 1.1 est fatigant à lire.
- Largeur de ligne pour le texte courant : vise 50–75 caractères par ligne (`max-w` ou `maxWidth` Chakra en `ch` ou en `rem`). Un paragraphe qui traverse tout l'écran sur desktop est une erreur classique.
- Un seul poids de police "lourd" par section (bold ou semibold pour les titres) — ne pas alterner bold/italic/underline sur le même bloc.

## 2. Grille & espacement

- Système d'espacement par multiples de 4 (Chakra : l'échelle `space` est déjà en base 4 — `1`=4px, `2`=8px, `4`=16px, `8`=32px...). N'invente pas de valeurs hors échelle (`13px`, `22px`) : reste sur les tokens Chakra (`p={4}`, `gap={6}`, etc.).
- Espacement vertical entre sections de page : généralement `16`–`24` (64–96px) desktop, réduit à `8`–`12` (32–48px) mobile. Des sections collées les unes aux autres sans respiration sont le signe #1 d'un design amateur.
- Marges internes (padding) d'une carte/bloc : jamais inférieures à `4` (16px) — un contenu qui touche les bords d'un conteneur a l'air cassé.
- Alignement : tout élément d'une même rangée (icônes, cartes, boutons) doit partager un axe d'alignement (haut, centre, ou baseline) — vérifie visuellement, pas seulement dans le JSX.

## 3. Couleur & contraste (non négociable)

Respecte WCAG AA au minimum :
- Texte normal (< 18px ou < 14px bold) : ratio de contraste **≥ 4.5:1** avec le fond.
- Texte large (≥ 18px, ou ≥ 14px bold) : ratio **≥ 3:1**.
- Éléments d'interface non textuels (bordures de focus, icônes informatives, contours de boutons) : ratio **≥ 3:1** avec le fond adjacent.
- Vérifie le contraste dans **les deux modes** (clair et sombre) — une couleur qui passe en dark peut échouer en light, et inversement. `gray.400` sur fond `gray.100` est un piège fréquent (contraste souvent < 3:1).
- N'utilise jamais la couleur comme seul vecteur d'information (ex: un lien visible uniquement par sa couleur sans soulignement ni changement de poids au survol/focus).

## 4. Layout responsive (mobile-first)

Breakpoints Chakra UI par défaut : `base` (0px), `sm` (480px), `md` (768px), `lg` (992px), `xl` (1280px), `2xl` (1536px).

- Conçois `base` d'abord, puis élargis — pas l'inverse. Un design qui "marche" en desktop et qu'on compresse ensuite pour mobile donne presque toujours du texte tassé ou des éléments qui se chevauchent.
- Le projet a déjà une carte de breakpoints mobiles dans `config/sidebar.ts`/`mobileBreakpointsMap` (`base`/`md`/`lg` = mobile, `xl` = desktop) — reste cohérent avec cette logique plutôt que d'introduire ta propre notion de "mobile".
- Cibles tactiles (boutons, liens, icônes cliquables) : minimum **44×44px** de zone cliquable réelle, même si l'icône visuelle est plus petite — utilise le padding pour agrandir la zone, pas l'icône elle-même.
- Teste mentalement (ou via le skill `run`) au moins 3 largeurs : mobile étroit (~375px), tablette (~768px), desktop (~1280px+). Un design qui n'a été pensé qu'à une seule largeur se voit immédiatement.

## 5. Les sections d'un portfolio dev — densité et attentes

| Section | Ce qui fait "pro" | Ce qui fait "amateur" |
|---|---|---|
| Hero | Une accroche courte et spécifique (rôle + spécialité + ce qui te différencie), CTA clair (contact/CV/projets) | Texte générique ("Bonjour, je suis développeur"), photo stock, pas de CTA |
| À propos | 2-3 phrases ciblées, ton humain | Mur de texte façon CV |
| Expériences | Scannable : rôle, entreprise, dates, 1-2 résultats concrets | Liste de tâches génériques sans résultat |
| Compétences | Groupées par catégorie, pas une soupe de 40 logos de même taille | Mur de badges sans hiérarchie, tout au même niveau d'importance |
| Projets | 3-6 projets avec un visuel + le "pourquoi" (problème résolu), pas juste un lien GitHub | Liste de liens sans contexte ni visuel |
| Contact | Un seul CTA évident (email, formulaire, ou lien direct) | Trois moyens de contact concurrents sans hiérarchie |

Règle générale : moins de sections mais soignées > beaucoup de sections remplies à moitié.

## 6. Micro-interactions avec Framer Motion

- Une animation doit **confirmer** une action ou **guider** l'attention — jamais décorer pour décorer. Si tu ne peux pas expliquer en une phrase ce que l'animation apporte à la compréhension, enlève-la.
- Durées : 150–300ms pour les transitions d'état (hover, apparition au scroll) ; au-delà de 400ms, l'interface paraît lente, pas élégante.
- Easing : préfère `easeOut` pour les entrées (rapide puis ralentit — naturel), `easeInOut` pour les transitions entre deux états stables.
- Respecte `prefers-reduced-motion` : toute animation non essentielle doit pouvoir être désactivée (Framer Motion expose `useReducedMotion()`). Ignorer ça n'est pas un détail — c'est une régression d'accessibilité.
- N'anime jamais plus de 1-2 propriétés à la fois sur un même élément (ex: opacity + translateY), jamais la couleur de fond d'une grande zone (clignote, fatigue visuelle).

## 7. Accessibilité concrète (à vérifier, pas à supposer)

- Focus visible : chaque élément interactif doit avoir un contour de focus visible au clavier (Tab) — ne jamais faire `outline: none` sans fournir un remplacement tout aussi visible.
- Alt text : toute image porteuse de sens a un `alt` descriptif ; une image purement décorative a `alt=""`.
- Navigation clavier : vérifie que l'ordre de tabulation suit l'ordre visuel logique, et qu'aucun piège clavier n'existe (élément qu'on ne peut plus quitter au Tab).
- Hiérarchie de titres HTML (`h1`→`h2`→`h3`) cohérente avec la hiérarchie visuelle — ne choisis pas un niveau de titre pour sa taille de police plutôt que pour sa place dans la structure.

## 8. Checklist de self-review (à exécuter avant de dire "terminé")

Ne rapporte jamais une tâche de design comme terminée sans avoir vérifié chaque point :

- [ ] Contraste texte/fond vérifié en **light et dark mode** (≥ 4.5:1 texte normal, ≥ 3:1 texte large/UI).
- [ ] Testé/visualisé à 3 largeurs au moins (mobile ~375px, tablette ~768px, desktop ~1280px) via le skill `run` si disponible.
- [ ] Cohérent avec le thème existant (`config/theme.ts`) : pas de nouvelle couleur/police ajoutée sans raison explicite dans la tâche.
- [ ] Espacement sur l'échelle Chakra (multiples de 4), pas de valeur arbitraire.
- [ ] Tous les éléments interactifs ont un focus visible et une zone cliquable ≥ 44×44px.
- [ ] Toute animation ajoutée respecte `prefers-reduced-motion` et dure < 400ms.
- [ ] Une seule idée forte par section — pas de concurrence visuelle entre plusieurs éléments.
- [ ] Relu la table de la section 5 : la section livrée correspond à la colonne "pro", pas "amateur".

Si un point échoue, corrige avant de rapporter au PO — ou signale explicitement le compromis fait et pourquoi (ex: contrainte de contenu existant).

## 9. Signal d'alerte — reconnaître un résultat amateur avant de le livrer

Si l'un de ces symptômes apparaît dans ton propre travail, reprends avant de livrer :
- Plus de 2 polices ou plus de 3 couleurs d'accent sur une même page.
- Un hero qui pourrait être celui de n'importe quel développeur (aucune spécificité).
- Des blocs de contenu qui touchent les bords de leur conteneur ou qui sont collés entre eux sans respiration.
- Une animation sur à peu près tout (hover, scroll, apparition) sans qu'aucune ne serve un but précis.
- Un bouton ou lien dont on ne sait pas, au premier coup d'œil, qu'il est cliquable.
