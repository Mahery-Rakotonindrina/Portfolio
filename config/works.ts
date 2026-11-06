export type Work = {
  title: string
  description: string
  src: string
  // Lien externe réel vers le projet ("voir le projet"). Peut être absent ou
  // invalide (ex. chemin local, URL pointant vers l'image elle-même) — la
  // validité réelle est vérifiée au rendu (FeaturedCard.tsx), pas ici : on
  // conserve la donnée brute telle qu'elle existe, sans l'inventer ni la
  // corriger artificiellement.
  ctaUrl?: string
  objectPosition?: string
}

// Textes et URLs copiés tels quels depuis l'ancien composant (aucune
// invention) ; seule la mise en forme interne (retours à la ligne/
// indentation à l'intérieur des descriptions) a été normalisée en un seul
// espace — sans effet visuel, le navigateur collapse déjà ces espaces/retours
// à la ligne par défaut (white-space: normal).
export const WorksList: Work[] = [
  {
    title: 'Becquet!',
    description:
      'Becquet est un site e-commerce développé avec Next.js pour le frontend et C# .NET côté backend. C’est l’un des projets les plus ambitieux sur lesquels j’ai travaillé : il a mobilisé un large éventail de compétences techniques, allant de Next.js, WCF, GraphQL, .NET, jusqu’à l’utilisation avancée de procédures stockées.',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDISAczkXoOFk4kQLgIKPB9pz4VeeWGUZaLQ&s',
    // Pointe vers l'image elle-même, pas un vrai site : aucun lien "voir le
    // projet" ne doit s'afficher pour cette entrée (bug identifié US-001).
    ctaUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDISAczkXoOFk4kQLgIKPB9pz4VeeWGUZaLQ&s',
    objectPosition: 'right 20%',
  },
  {
    title: 'GIPROD Androy',
    description:
      "En mission freelance chez Diapen'tech, j’ai développé une application de gestion des ressources, territoires, projets et membres, avec intégration de cartes interactives via ArcGIS. Les technos utilisées : Laravel 9 & Vue.js.",
    src: '/giprod.jpg',
    // Chemin local mal orthographié (pas une URL externe) : aucun lien à
    // afficher.
    ctaUrl: '/giprod.jp',
  },
  {
    title: 'E-Kaly',
    description:
      "Un de mes projets personnels en cours, lancé avec Symfony 5 en backend et Next.js en frontend. Initialement dédié à la gestion des commandes en restauration, il a évolué pour inclure la gestion des livreurs (disponibilité, affectation) et un système de contact direct entre restaurants et livreurs via le web. Je prévois également de développer une application mobile pour ce projet à l'avenir.",
    src: '/works/agora.webp',
    ctaUrl: 'https://dev.agora-school.com',
    objectPosition: 'right 20%',
  },
  {
    title: 'GESCOM',
    description:
      "Mon tout premier projet d’envergure, réalisé dans le cadre de mon stage de fin d'études chez SIDINA (Groupe MANAO), pour l’obtention de mon Master 2. On a conçu et développé l'application de A à Z avec CodeIgniter 4 et jQuery pour les animations et interactions JavaScript.",
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4QmHWzGjMU4y_gXyntQfWQQD93cQPklwA1w&s',
    // Même cas que Becquet! : ctaUrl identique à l'image de couverture.
    ctaUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4QmHWzGjMU4y_gXyntQfWQQD93cQPklwA1w&s',
  },
]
