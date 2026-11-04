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

**Non vérifié visuellement** : les outils `mcp__playwright__*` n'étaient pas chargés dans cette session (redémarrage nécessaire). Le changement de fond/texte global (`styles.global`) affecte déjà le rendu réel de l'app — recommandé qu'un agent avec Playwright actif (tester ou designer en session fraîche) confirme le rendu avant de considérer la fondation visuellement validée.

## US-003 — Refonte Hero / Sidebar
**Priorité :** Haute
**Statut :** À faire

Objectif : transformer la Sidebar actuelle en une introduction cinématique forte, sans perdre les vraies données (nom, titre, bio, CTA contact, réseaux sociaux).

Critères d'acceptation :
- [ ] Nom, titre "Développeur Frontend", bio réelle conservés.
- [ ] CTA contact et liens réseaux sociaux réels conservés et fonctionnels.
- [ ] Animation d'entrée élégante, performante.
- [ ] Rendu desktop + mobile vérifié.

## US-004 — Refonte About (Detail + SkillSetModal)
**Priorité :** Moyenne
**Statut :** À faire

Objectif : moderniser la présentation du profil et des compétences réelles (`config/skills.ts`), sans pourcentages ni jauges inventées.

Critères d'acceptation :
- [ ] Texte de présentation réel conservé.
- [ ] Toutes les compétences de `config/skills.ts` restent accessibles (modal ou nouvelle présentation).
- [ ] Pas de métrique de compétence inventée.

## US-005 — Refonte Experience (timeline)
**Priorité :** Moyenne
**Statut :** À faire

Objectif : présenter les 3 expériences réelles (Domoti, Vivetic, Pushtech) sous une composition visuelle plus immersive qu'un simple Tabs.

Critères d'acceptation :
- [ ] Les 3 entreprises, durées et descriptions réelles conservées intégralement.
- [ ] Logos existants conservés.
- [ ] Lisible sur mobile sans scroll horizontal cassé.

## US-006 — Refonte Projects (galerie)
**Priorité :** Haute
**Statut :** À faire

Objectif : transformer `FeaturedWorks`/`FeaturedCard` en galerie immersive, avec les 4 projets réels (Becquet!, GIPROD Androy, E-Kaly, GESCOM).

Critères d'acceptation :
- [ ] Les 4 projets et leurs vraies descriptions/images conservés.
- [ ] **Bugfix** : `ctaUrl` n'affiche un lien "voir le projet" que lorsqu'il s'agit d'une vraie URL externe valide (actuellement 2 projets ont un `ctaUrl` pointant vers une image, pas un lien) — pas de lien cassé ni inventé.
- [ ] Effet de profondeur au survol.
- [ ] Pas de capture d'écran inventée pour un projet qui n'en a pas.

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
