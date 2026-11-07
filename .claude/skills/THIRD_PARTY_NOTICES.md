# Attribution — skills tiers installés dans ce projet

Ces skills sont redistribuées dans `.claude/skills/`, pour les agents `designer` et `developer`. Toutes sous licence permissive, usage et redistribution autorisés.

## Designer

| Skill | Auteur / source | Licence | Dépôt |
|---|---|---|---|
| `frontend-design` | Anthropic (officiel) | Apache 2.0 | https://github.com/anthropics/skills (sous-dossier `skills/frontend-design`) |
| `ui-ux-pro-max` | NextLevelBuilder | MIT | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| `impeccable` | Paul Bakaus (pbakaus) | Apache 2.0 | https://github.com/pbakaus/impeccable |
| `emil-design-eng` | Emil Kowalski | MIT | https://github.com/emilkowalski/skill |
| `make-interfaces-feel-better` | Jakub Krehel | MIT | https://github.com/jakubkrehel/make-interfaces-feel-better |
| `ui-ux-pro` | Interne à ce projet | — | Écrit pour ce projet, voir `.claude/skills/ui-ux-pro/SKILL.md` |

## Developer

| Skill | Auteur / source | Licence | Dépôt |
|---|---|---|---|
| `vercel-react-best-practices` | Vercel (officiel) | MIT | https://github.com/vercel-labs/agent-skills (sous-dossier `skills/react-best-practices`) |
| `vercel-composition-patterns` | Vercel (officiel) | MIT | https://github.com/vercel-labs/agent-skills (sous-dossier `skills/composition-patterns`) |
| `webapp-testing` | Anthropic (officiel) | Apache 2.0 | https://github.com/anthropics/skills (sous-dossier `skills/webapp-testing`) |
| `typescript-best-practices` | ofershap | MIT | https://github.com/ofershap/typescript-best-practices |

**Non installés, décision explicite de l'utilisateur** : skill Next.js dédiée (celle de Vercel a été retirée — remplacée par la génération auto de `next dev` sur Next.js ≥16.3, non applicable à ce projet en v14 pages router), skill Git/GitHub workflow (redondant avec les règles git déjà en place), skill API/Backend integration (le projet n'a aucune route API actuellement — à revisiter si ça change).

## QA (préparé pour un futur agent `qa-tester`, pas encore créé)

| Skill | Auteur / source | Licence | Dépôt |
|---|---|---|---|
| `accessibility` | Addy Osmani | MIT | https://github.com/addyosmani/web-quality-skills (sous-dossier `skills/accessibility`) |
| `performance` | Addy Osmani | MIT | https://github.com/addyosmani/web-quality-skills (sous-dossier `skills/performance`) |
| `core-web-vitals` | Addy Osmani | MIT | https://github.com/addyosmani/web-quality-skills (sous-dossier `skills/core-web-vitals`) |
| `best-practices` | Addy Osmani | MIT | https://github.com/addyosmani/web-quality-skills (sous-dossier `skills/best-practices`) |
| `web-quality-audit` | Addy Osmani | MIT | https://github.com/addyosmani/web-quality-skills (sous-dossier `skills/web-quality-audit`) |

**Non installés, décision explicite de l'utilisateur ou choix justifié** :
- Skill `code-review` tierce : **volontairement évitée** — une skill projet nommée `code-review` écraserait la skill `/code-review` native de Claude Code dont dépend déjà l'agent `reviewer`. Le besoin « Code Review » de la mission QA est couvert par la skill native `code-review` + `security-review` + la nouvelle `best-practices` (volet sécurité/qualité de code de Lighthouse).
- Skill Accessibility/Security « basée sur axe-core » dédiée : aucune option officielle (Deque/axe-core) n'existe ; `accessibility` (Addy Osmani) couvre le besoin et documente le repli CLI (`npx @axe-core/cli`, `npx lighthouse`) quand les outils live ne sont pas disponibles.
- Skill Git/GitHub workflow, API/Backend integration, skill Next.js dédiée : cf. section Developer ci-dessus, mêmes raisons.
- Vitest : le projet n'a actuellement aucun test et aucun script `test` dans `package.json` — introduire un test runner est une décision de scope, pas une simple installation d'outil. Laissé à une décision explicite future plutôt qu'installé par défaut.

**Outils CLI vérifiés fonctionnels (usage à la demande via `npx`, pas ajoutés à `package.json`)** :
- `npx playwright --version` → 1.64.1 ✅
- `npx @axe-core/cli --version` → 4.14.0 ✅
- `npx lighthouse --version` → 13.6.0 ✅
- `jq` installé via winget (requis par `web-quality-audit/scripts/analyze.sh`) → 1.8.2 ✅

**Serveur MCP officiel ajouté** : `chrome-devtools-mcp` (org GitHub `ChromeDevTools`, Google) dans `.mcp.json`, en plus de `playwright` — configuré en `--headless=true --isolated=true` pour ne pas ouvrir de fenêtre visible ni toucher le profil Chrome réel de l'utilisateur. Vérifié fonctionnel (`npx chrome-devtools-mcp@latest --help` répond correctement). Nécessite un redémarrage de la session Claude Code pour être chargé, comme `playwright`.

**Notes d'installation** :
- `frontend-design` et `emil-design-eng` / `make-interfaces-feel-better` sont copiés tels quels depuis leur dépôt (contenu statique en markdown).
- `ui-ux-pro-max` a été généré en reproduisant localement la logique de `uipro init --ai claude` (assemblage des templates `base/skill-content.md` + `base/quick-reference.md` + config `platforms/claude.json`) plutôt que d'exécuter leur CLI — même résultat, sans dépendance supplémentaire. Les sous-skills que leur paquet npm bundle en plus (banner-design, brand, etc.) ne sont pas dans le dépôt source et n'ont donc pas été installés.
- `impeccable` a été généré depuis `skill/SKILL.src.md` en résolvant les placeholders `{{scripts_path}}` / `{{command_hint}}` comme le fait leur script de build officiel (`scripts/build.js`), pour la cible Claude Code (`.claude/skills/impeccable/scripts`).

**Point d'attention** : `impeccable` embarque un lanceur (`scripts/impeccable`, `scripts/impeccable.cmd`) qui, à sa première exécution réelle, télécharge et exécute un binaire moteur compilé (vérifié par checksum dans `scripts/engine-checksums.txt`) depuis l'infrastructure de l'auteur. Rien n'a été téléchargé/exécuté lors de l'installation — seulement au premier usage réel de la commande `/impeccable`. Les 4 autres skills sont du contenu markdown pur (+ data CSV/JSON pour `ui-ux-pro-max`), sans exécution de binaire.
