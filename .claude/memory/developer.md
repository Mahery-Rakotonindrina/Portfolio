# Mémoire — Developer

> Lu au début de chaque tâche de dev, mis à jour à la fin. Concis : seulement ce qui reste utile pour les tâches futures, pas un journal chronologique.

## Conventions du projet
- Stack : Next.js 14 (pages router), TypeScript, Chakra UI, Framer Motion, react-icons.
- Package manager : les deux lockfiles (`package-lock.json` et `yarn.lock`) sont présents — demander au PO lequel est la source de vérité avant d'en régénérer un.

## Décisions techniques
- **US-003 (Hero/Sidebar)** : composant réel = `components/Sidebar/index.tsx` (pas de dossier "Hero" séparé). Migré des animations legacy (`fadeInUp`, `letterSpace`, `simpleOpacity`) vers les tokens signature US-002 : `heroBoot`/`heroBootReduced` sur chaque ligne (entrée), parent `MotionStack` avec `staggerChildren` conditionnel (0.1s normal, 0 si `prefers-reduced-motion` via `useReducedMotion()`), `hoverLift`/`hoverLiftReduced` sur le CTA et chaque icône sociale (`whileHover`, valeur passée directement en objet plutôt que par nom de variant — un composant motion ne peut pas combiner un `variants` d'entrée (`initial`/`animate`) et un `whileHover` par nom tirés du même objet si les clés ne correspondent pas : `whileHover={hoverLift.hover}` en objet direct évite le piège).
- Typo scale : remplacé les tailles non-tokenisées (`fontSize="smaller"`, `fontSize="small"`) par les `textStyles` du theme (`hero`, `title`, `label`, `body`) — `textStyle="hero"` appliqué au nom de famille (point focal visuel), `textStyle="label"` (mono, uppercase) au rôle "Développeur Frontend" en gardant le tag `as="h3"` (pas de régression sémantique, juste un style visuel différent).
- Cercle décoratif (`#sidebarCircle`, `components/Sidebar/styles.module.css`) : couleur hardcodée `#97DFFC` remplacée par les tokens du design system via variables CSS Chakra (`var(--chakra-colors-accent-400)` en dark, `var(--chakra-colors-border-subtle)` en light — convention confirmée : un semantic token `border.subtle` génère bien la variable `--chakra-colors-border-subtle`, point remplacé par tiret). Comportement scaleUp (légacy, hors des 5 signatures) conservé tel quel, juste la couleur alignée.
- Sécurité anti-débordement : `overflowWrap="anywhere"` ajouté sur le heading du nom de famille (`textStyle="hero"` monte jusqu'à `7xl`/72px sur un mot sans espace de 14 caractères — risque réel de dépassement horizontal dans la colonne Sidebar à 34% de largeur sur desktop xl). À vérifier visuellement dès que Playwright est disponible.

## Pièges connus
- `mcp__playwright__*` non chargé dans certaines sessions même si déclaré dans `.mcp.json` et dans les `tools:` de l'agent — nécessite un redémarrage de Claude Code. Si absent, le signaler explicitement plutôt que de deviner un rendu (vérifié ici via `curl` sur le HTML SSR pour confirmer la présence des vraies données, mais ça ne remplace pas une vérification visuelle réelle).
- Pour vérifier la convention de nommage des variables CSS générées par les semantic tokens Chakra sans navigateur : `toCSSVar()` de `@chakra-ui/styled-system` sur un thème minimal reproduisant les tokens concernés (testé en Node direct, rapide et fiable).
- `Stack w="100"` dans `Sidebar` (pré-existant, pas touché) : `"100"` n'est pas une clé valide de l'échelle `sizes` Chakra → valeur CSS littérale invalide, ignorée par le navigateur. Bug pré-existant hors scope US-003, à corriger si une tâche future touche ce `Stack`.
