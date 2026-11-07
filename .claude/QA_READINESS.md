# Préparation de l'agent QA (`qa-tester`) — pas encore créé

Ce fichier documente ce qui est prêt pour un futur agent `qa-tester`, sans le créer — conformément à la demande explicite de ne pas le créer sans confirmation.

## ⚠️ Chevauchement à trancher avant de créer l'agent

Deux agents existants couvrent déjà une partie du périmètre QA :
- **`tester`** (`.claude/agents/tester.md`) : build/lint, navigation réelle via Playwright, rapporte les bugs sans les corriger.
- **`reviewer`** (`.claude/agents/reviewer.md`) : code review + security review (lecture seule).

Si `qa-tester` est créé tel que décrit dans la mission (indépendant du developer, vérifie réellement, distingue bloquant/majeur/mineur/amélioration), il recouvre une bonne partie du rôle de `tester`, et une partie de `reviewer` côté sécurité. Avant de créer l'agent, il faudra décider :
1. `qa-tester` **remplace** `tester` (et récupère une partie des responsabilités sécurité de `reviewer`) ?
2. `qa-tester` **complète** `tester` (ex: `tester` = fumée/régression rapide, `qa-tester` = QA approfondie : a11y, perf, sécurité) ?
3. Les trois coexistent avec des périmètres redécoupés explicitement ?

Pas de recommandation imposée ici — à trancher avec toi au moment de la création.

## Skills disponibles pour `qa-tester`

| Skill | Couvre | Mécanisme |
|---|---|---|
| `webapp-testing` (Anthropic, déjà installée pour `developer`) | Web Testing (B) — fonctionnel, états de chargement/vides | Méthodologie + `mcp__playwright__*` (pas les scripts Python, Python absent de la machine) |
| `accessibility` (Addy Osmani) | Accessibility Testing (C) — WCAG 2.2, axe/Lighthouse | `chrome-devtools-mcp` (`lighthouse_audit`, `take_snapshot`) en priorité, repli `npx @axe-core/cli` / `npx lighthouse` |
| `performance` + `core-web-vitals` (Addy Osmani) | Performance Testing (F) — Core Web Vitals, budgets perf | `chrome-devtools-mcp` (`performance_start_trace`, `performance_analyze_insight`), repli `npx lighthouse` |
| `best-practices` (Addy Osmani) | Volet qualité/sécurité de Lighthouse (HTTPS, libs vulnérables, console errors) — complète `security-review` | `chrome-devtools-mcp` / `npx lighthouse` |
| `web-quality-audit` (Addy Osmani) | Audit global combinant perf/a11y/best-practices | Orchestration des skills ci-dessus + `scripts/analyze.sh` (statique, nécessite `jq`, déjà installé) |
| `code-review` (natif Claude Code) | Code Review (D) — bugs, duplication, maintenabilité | Déjà disponible, pas une installation |
| `security-review` (natif Claude Code) | Security Testing (E) — XSS, secrets, dépendances vulnérables | Déjà disponible, pas une installation |

Playwright (A) : couvert par le serveur MCP `playwright` déjà configuré (`.mcp.json`) + `npx playwright` en CLI pour des specs `.spec.ts` si des tests e2e écrits sont un jour ajoutés au projet.

## Outils vérifiés fonctionnels (usage à la demande, rien d'ajouté à `package.json`)

```
npx playwright --version        # 1.64.1
npx @axe-core/cli --version     # 4.14.0
npx lighthouse --version        # 13.6.0
jq --version                    # 1.8.2 (installé via winget)
```

Serveurs MCP (actifs après redémarrage de la session Claude Code) :
- `playwright` — navigation, captures d'écran, interactions
- `chrome-devtools` — audits Lighthouse live, traces de performance, snapshots d'accessibilité (headless, profil isolé)

ESLint et TypeScript sont déjà des devDependencies du projet (`eslint@7.32.0`, `typescript@5.8.3`) — aucune action nécessaire. **Vitest n'est pas installé** : le projet n'a aucun test actuellement ; décision à prendre séparément si on veut introduire des tests unitaires/intégration.

## Principes non négociables pour `qa-tester` (à inclure dans son fichier agent)

- Indépendant du developer : ne jamais accepter une affirmation ("ça marche") sans vérification réelle.
- Fournir des preuves quand possible (capture d'écran Playwright, sortie JSON de `npx lighthouse`/`npx @axe-core/cli`, trace de perf).
- Ne jamais prétendre qu'un test a réussi s'il n'a pas été exécuté — dire explicitement "non vérifié" plutôt que deviner.
- Classer chaque problème trouvé : **bloquant** / **majeur** / **mineur** / **amélioration facultative** — jamais un rapport plat sans priorisation.
- Lecture seule comme `reviewer` et `tester` actuels : rapporte au PO, ne corrige pas lui-même.

## Prochaine étape

Dès que tu veux créer l'agent, je peux générer `.claude/agents/qa-tester.md` (+ `.claude/memory/qa-tester.md`) sur la base de ce document, une fois le chevauchement avec `tester`/`reviewer` tranché.
