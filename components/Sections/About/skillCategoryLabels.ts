import { SkillCategory, Skills } from 'config/skills'

// US-016 — remplace la petite Modal Chakra (US-004) par une carte de
// relations. Itère systématiquement sur Object.keys(Skills) (même garde-fou
// que l'ancien SkillSetModal, cf. .claude/memory/developer.md US-004) :
// toute catégorie ajoutée à config/skills.ts apparaît automatiquement ici,
// aucune liste recopiée à la main.
export const CATEGORIES = Object.keys(Skills) as SkillCategory[]

// Intitulé affiché pour chaque catégorie — Record<SkillCategory, string>
// force une erreur de compilation si une catégorie est ajoutée sans intitulé
// (même garde-fou que l'ancien SkillSetModal.tsx). Fichier séparé (pas dans
// SkillsRelationMap.tsx) pour éviter un import circulaire avec
// RelationDiagram.tsx/CategoryAccordion.tsx, qui en ont besoin aussi.
export const categoryLabels: Record<SkillCategory, string> = {
  backend: 'Backend',
  frontend: 'Frontend',
  cicd: 'CI/CD & Cloud',
  database: 'Base de donnée',
  'ui frameworks': 'Ui Frameworks',
  'productivity boost': 'Productivity boosts',
  mobile: 'Mobile Development',
  games: 'Game Dev',
  desktop: 'Desktop App',
}
