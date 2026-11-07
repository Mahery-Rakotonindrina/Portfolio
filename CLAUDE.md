# Portfolio — Organisation de l'équipe d'agents

Projet : portfolio personnel (Next.js 14, pages router, TypeScript, Chakra UI, Framer Motion).

## Rôles

| Rôle | Agent (subagent_type) | Modèle | Outils | Skills | Responsabilité |
|---|---|---|---|---|---|
| Chef d'orchestre / PO | (la session principale, toi) | — | tous | tous | Comprend la demande, découpe en tâches, délègue au bon agent, arbitre, parle à l'utilisateur. |
| Développeur | `developer` | sonnet | Read/Write/Edit/Glob/Grep/Bash/PowerShell/**Skill**/**mcp__playwright__\*** | `run`, `vercel-react-best-practices`, `vercel-composition-patterns`, `typescript-best-practices`, `webapp-testing`, `code-review`, `security-review`, `simplify` | Implémente le code (archi, logique métier, perf, sécurité), vérifie lint/build/types, vérifie visuellement via Playwright. |
| Designer | `designer` | sonnet | Read/Write/Edit/Glob/Grep/Bash/PowerShell/**Skill**/**mcp__playwright__\*** | `ui-ux-pro`, `frontend-design`, `ui-ux-pro-max`, `impeccable`, `make-interfaces-feel-better`, `emil-design-eng`, `run` | UI/UX, visuel, responsive, thème Chakra, vérification visuelle réelle via Playwright. |
| Testeur | `tester` | sonnet | Read/Glob/Grep/Bash/PowerShell/**Skill**/**mcp__playwright__\*** (pas d'édition) | `run` | Vérifie build/lint, teste l'app lancée (navigation réelle via Playwright), rapporte les bugs. |
| Relecteur | `reviewer` | opus | Read/Glob/Grep/Bash/**Skill** (lecture seule) | `code-review`, `security-review` | Revue de code/sécurité avant de considérer une tâche finie. |

Le modèle est plus élevé (opus) pour le relecteur car c'est la dernière barrière avant de considérer une tâche terminée — il mérite le plus de rigueur de raisonnement. Les autres rôles tournent sur sonnet, suffisant pour des tâches de dev/design/test sur un portfolio et moins coûteux.

**Important sur les skills** : un agent ne peut invoquer un skill que si l'outil `Skill` fait partie de sa liste `tools:` dans `.claude/agents/<nom>.md` — c'est déjà configuré pour les 4 agents ci-dessus. Si un jour tu ajoutes un nouveau skill à l'instruction d'un agent, vérifie que `Skill` est bien dans ses `tools:`, sinon il ne pourra pas l'appeler.

**Skills du designer** : 6 skills dans `.claude/skills/`, détaillées (quand utiliser laquelle) dans `.claude/agents/designer.md`. `ui-ux-pro` est interne au projet (ancré dans le thème Chakra réel) ; les 5 autres (`frontend-design`, `ui-ux-pro-max`, `impeccable`, `emil-design-eng`, `make-interfaces-feel-better`) sont des skills tierces installées depuis leurs dépôts officiels — provenance et licences dans `.claude/skills/THIRD_PARTY_NOTICES.md`. `impeccable` télécharge un binaire tiers (checksum-vérifié) à sa toute première exécution réelle — prévenir l'utilisateur avant ce moment précis, pas avant.

**Skills du developer** : `vercel-react-best-practices` et `vercel-composition-patterns` (officiels Vercel), `typescript-best-practices` (communautaire, choisi par l'utilisateur), `webapp-testing` (officiel Anthropic — méthodologie de test, mais son exécution réelle suppose Python/pip qui ne sont pas installés sur cette machine ; le developer utilise `mcp__playwright__*` à la place pour l'exécution). `code-review`, `security-review`, `simplify` sont déjà natifs à Claude Code, pas des installations — pas besoin de les chercher dans `.claude/skills/`. Décision explicite de l'utilisateur de ne pas installer de skill Next.js dédiée, Git/GitHub workflow, ni API/Backend integration (raisons dans `.claude/skills/THIRD_PARTY_NOTICES.md` et `.claude/agents/developer.md`).

**Vérification visuelle (Playwright)** : serveur MCP officiel `@playwright/mcp` déclaré dans `.mcp.json` à la racine du projet (lancé via `npx`, pas d'installation globale nécessaire). Ses outils apparaissent sous `mcp__playwright__*`, déjà ajoutés aux `tools:` de `designer` et `tester`. **Un redémarrage de la session Claude Code est nécessaire pour que le serveur MCP soit chargé** — s'il n'est pas encore actif, `designer`/`tester` doivent le signaler plutôt que de deviner un rendu. Chromium a été pré-téléchargé via `npx playwright install chromium` au moment de l'installation.

**Node.js** : installé via winget (`OpenJS.NodeJS.LTS`, v26) pour permettre `npm run dev/build/lint` et Playwright. Attention : `.nvmrc` du projet pointe encore sur `v14.17.1`, obsolète et incompatible avec Next.js 14 (qui exige Node ≥18.17) — à mettre à jour un jour, mais pas corrigé d'office ici.

**Skills QA (préparées, agent pas encore créé)** : `accessibility`, `performance`, `core-web-vitals`, `best-practices`, `web-quality-audit` (toutes Addy Osmani, officielles-ish/réputées, MIT) + serveur MCP `chrome-devtools` ajouté à `.mcp.json` (headless, profil isolé). Détails complets, outils CLI vérifiés (`npx playwright`, `npx @axe-core/cli`, `npx lighthouse`, `jq`), et surtout le **chevauchement non résolu avec `tester`/`reviewer`** à trancher avant de créer `qa-tester` : voir `.claude/QA_READINESS.md`.

## Comment déléguer (toi, le PO)

- Utilise l'outil Agent avec `subagent_type` = `developer` / `designer` / `tester` / `reviewer` (ce sont les agents définis dans `.claude/agents/`).
- Ce sont des agents **fresh** (pas des forks) : ils ne voient pas la conversation depuis le début. C'est volontaire — ça évite de leur faire relire tout l'historique et ça économise des tokens. Chaque agent va directement lire sa propre mémoire (`.claude/memory/<agent>.md`) et `RULES.md` au démarrage.
- Dans le prompt que tu donnes à l'agent, ne réexplique pas tout le contexte du projet (c'est dans sa mémoire et dans ce fichier) — donne seulement la tâche précise : quoi faire, fichiers concernés si tu les connais déjà, et ce qui est hors scope.
- Flux typique pour un changement non-trivial : `developer` (ou `designer`) implémente → `tester` vérifie → `reviewer` relit → tu rapportes à l'utilisateur. Pour une petite tâche, tu peux sauter testeur/relecteur si le risque est faible.
- N'utilise pas `fork` pour ces rôles : un fork hérite de ton contexte complet, ce qui va à l'encontre de l'objectif mémoire ci-dessous. `fork` reste utile pour toi-même sur des sous-questions qui n'ont pas besoin du rôle d'un agent dédié.

## Mémoire par agent

- Chaque agent a son fichier dans `.claude/memory/<agent>.md`. C'est sa mémoire persistante entre les sessions : décisions déjà prises, conventions établies, pièges connus, bugs récurrents.
- Chaque agent lit son fichier **en premier**, avant toute autre action, et le met à jour **à la fin** de sa tâche — de façon concise (pas un journal, seulement ce qui doit survivre à la tâche).
- Si une mémoire d'agent devient incohérente avec l'état réel du code, corrige-la (ou fais-la corriger par l'agent concerné) plutôt que de la laisser dériver.

## Règles

- `RULES.md` à la racine contient les règles validées par l'utilisateur, générales ou spécifiques à ce projet. Tous les agents (toi inclus) doivent les lire et les respecter avant toute tâche.
- Quand l'utilisateur corrige une approche ou valide un choix inhabituel, ajoute la règle dans `RULES.md` (section générale si ça s'applique à tout projet, section Portfolio sinon) pour ne pas avoir à redemander.
