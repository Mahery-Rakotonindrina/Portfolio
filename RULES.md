# Règles

> Toutes les règles ici priment sur le jugement par défaut des agents (PO, developer, designer, tester, reviewer). Ajoute une règle dès que l'utilisateur en valide une — correction ou confirmation d'une approche. Chaque agent lit ce fichier au début de sa tâche.

## Règles générales (valables sur n'importe quel projet)
- Ne jamais committer sans demande explicite de l'utilisateur.
- Ne jamais ajouter de dépendance sans que ce soit nécessaire à la tâche demandée.
- Pas de sur-ingénierie : pas d'abstraction, de fallback, ou de config pour un cas qui n'a pas été demandé.
- Le relecteur (reviewer) est toujours en lecture seule — il rapporte, il ne corrige pas.
- Le testeur (tester) ne corrige pas les bugs qu'il trouve — il les rapporte au PO avec une reproduction précise.

## Règles spécifiques — Portfolio
- Stack : Next.js 14 (pages router), TypeScript, Chakra UI, Framer Motion.
- Respecter `.eslintrc` / `.prettierrc` existants — ne pas reformatter tout un fichier pour une petite modif.
- Version Node fixée par `.nvmrc` — vérifier avant d'ajouter une dépendance qui exigerait une version plus récente.
- Deux lockfiles présents (`package-lock.json` et `yarn.lock`) — clarifier avec l'utilisateur lequel est la source de vérité avant d'en régénérer un.
