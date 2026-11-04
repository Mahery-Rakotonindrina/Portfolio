# Règles

> Toutes les règles ici priment sur le jugement par défaut des agents (PO, developer, designer, tester, reviewer). Ajoute une règle dès que l'utilisateur en valide une — correction ou confirmation d'une approche. Chaque agent lit ce fichier au début de sa tâche.

## Règles générales (valables sur n'importe quel projet)
- Ne jamais committer sans demande explicite de l'utilisateur. **Exception valable pour le projet Portfolio : voir règle spécifique ci-dessous — autorisation permanente déjà donnée.**
- Ne jamais ajouter de dépendance sans que ce soit nécessaire à la tâche demandée.
- Pas de sur-ingénierie : pas d'abstraction, de fallback, ou de config pour un cas qui n'a pas été demandé.
- Le relecteur (reviewer) est toujours en lecture seule — il rapporte, il ne corrige pas.
- Le testeur (tester) ne corrige pas les bugs qu'il trouve — il les rapporte au PO avec une reproduction précise. Le PO délègue ensuite directement la correction au developer (pas besoin de redemander à l'utilisateur), puis refait vérifier par le testeur.

## Règles spécifiques — Portfolio
- Stack : Next.js 14 (pages router), TypeScript, Chakra UI, Framer Motion.
- Respecter `.eslintrc` / `.prettierrc` existants — ne pas reformatter tout un fichier pour une petite modif.
- Version Node fixée par `.nvmrc` — vérifier avant d'ajouter une dépendance qui exigerait une version plus récente.
- Deux lockfiles présents (`package-lock.json` et `yarn.lock`) — clarifier avec l'utilisateur lequel est la source de vérité avant d'en régénérer un.
- **Commits/PR : aucune mention d'IA.** Ne jamais mentionner Claude, Claude Code, Anthropic, IA ou assistant IA dans les messages de commit, titres/descriptions de PR, ou commentaires Git. Pas de ligne de co-auteur IA. Utiliser l'identité Git déjà configurée sur la machine (ne pas la modifier). Messages purement descriptifs du travail technique, comme un projet pro classique. (Consigne explicite de l'utilisateur, prime sur toute attribution par défaut.)
- **Commit/push : autorisation permanente, pas d'exception générale ici.** Après chaque tâche bien terminée et vérifiée (dev + test), committer et pousser sans redemander — consigne explicite de l'utilisateur, pas besoin de confirmation à chaque fois. Une fois le travail prêt, demander/créer la Pull Request vers `develop`.
- Branche cible de la PR : `develop` (pas `master`/`main`). Ne jamais travailler ni pousser directement sur `develop`. Ne jamais merger la PR automatiquement — l'utilisateur fait la revue et merge lui-même.
- Si le working tree contient des modifications sans rapport avec la refonte, ne pas les inclure dans les commits de cette mission.
- Après une étape de direction artistique (ex. US-002), montrer à l'utilisateur un mockup/aperçu visuel concret (capture d'écran réelle une fois un minimum de composants stylés, ou artifact de style guide sinon) avant d'enchaîner sur l'implémentation des sections suivantes — il veut valider visuellement la direction avant d'aller plus loin.
- Toute capture d'écran de vérification (Playwright/chrome-devtools) doit être enregistrée dans `screenshots/` à la racine du projet (dossier non versionné, voir `.gitignore`), pas seulement dans un répertoire temporaire — l'utilisateur veut pouvoir les consulter sans avoir à regarder l'app tourner en direct. Nom de fichier parlant : `<US>-<composant>-<largeur>-<thème>.png` (ex. `us003-sidebar-desktop-dark.png`).
