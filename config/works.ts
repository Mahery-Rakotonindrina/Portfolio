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
    // Image corrigée (PO) : l'ancienne était une miniature Google basse
    // résolution de ce qui n'était même pas un vrai logo officiel. Remplacée
    // par une vraie capture du site en ligne (becquet.fr, catégorie "Linge de
    // lit", hors bandeau promo saisonnier) — exactement 1600x1000, donc pas
    // besoin d'`objectPosition` pour recadrer. `ctaUrl` pointe maintenant
    // vers le vrai site (becquet.fr), plus vers l'image elle-même.
    //
    // Description réécrite (PO) : Becquet n'est pas un site isolé mais l'une
    // des enseignes d'un socle multi-marques chez Domoti ("CoreWeb") —
    // confirmé par le PO : TempsL, Idées Homme, Chien Chat et Compagnie,
    // Confort et Vie, Marianne Mélodie et L'Atelier de Lucie tournent sur la
    // même base de code et la même stack. Domaines vérifiés réellement en
    // ligne un par un avant d'écrire cette description (pas de nom pris sur
    // la seule parole du PO sans le confirmer).
    description:
      'Becquet n’est qu’une des enseignes d’un chantier bien plus large chez Domoti : CoreWeb, une base de code unique qui fait tourner plusieurs sites e-commerce bien distincts — TempsL, Idées Homme, Chien Chat et Compagnie, Confort et Vie, Marianne Mélodie, L’Atelier de Lucie, et Becquet lui-même. Même stack partout : Next.js en façade, .NET/C# en coulisses, WCF, GraphQL, et des procédures stockées à apprivoiser.',
    src: '/works/becquet.webp',
    ctaUrl: 'https://www.becquet.fr',
  },
  {
    title: 'GIPROD Androy',
    // Corrigé pour coller au CV (source de vérité) : front-end React.js — pas
    // Vue.js — et une application de recensement des habitants d'Androy, pas
    // de gestion de ressources/territoires/membres. Le CV ne nomme aucun
    // client ("Freelance" seul) : "Diapen'tech" retiré, invérifiable.
    description:
      'Recenser toute une région, ça ne s’improvise pas. GIPROD Androy est l’application que j’ai développée en mission freelance pour digitaliser le recensement des habitants d’Androy — React.js en façade, PHP/Laravel en coulisses, connectés via une API REST.',
    src: '/giprod.jpg',
    // Chemin local mal orthographié (pas une URL externe) : aucun lien à
    // afficher.
    ctaUrl: '/giprod.jp',
  },
  {
    title: 'E-Kaly',
    description:
      'Ce qui devait être un simple outil de gestion des commandes pour un restaurant a pris de l’ampleur : E-Kaly gère aujourd’hui aussi les livreurs (disponibilité, affectation) et met en relation directe restaurants et livreurs depuis le web. Symfony 5 derrière, Next.js devant — et une version mobile dans les cartons.',
    src: '/works/agora.webp',
    ctaUrl: 'https://dev.agora-school.com',
    objectPosition: 'right 20%',
  },
  {
    title: 'GESCOM',
    // Corrigé pour coller au CV : le stage était chez Manao Logiciels (pas
    // "SIDINA (Groupe MANAO)"), pour une application de gestion des factures
    // périodiques — pas une appli "GESCOM" générique. Diplôme visé non
    // précisé par le CV ("stage de fin d'études" seul) : pas de détail
    // inventé sur ce point.
    description:
      'Mon tout premier vrai projet, pendant mon stage de fin d’études chez Manao Logiciels : une application de gestion des factures périodiques, pensée et codée de A à Z avec CodeIgniter 4 et jQuery.',
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4QmHWzGjMU4y_gXyntQfWQQD93cQPklwA1w&s',
    // Même cas que Becquet! : ctaUrl identique à l'image de couverture.
    ctaUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4QmHWzGjMU4y_gXyntQfWQQD93cQPklwA1w&s',
  },
  {
    title: 'Assisteo Agny',
    description:
      'Et si ton téléphone pouvait te dire ce qu’il y a sur une photo ? C’est l’idée derrière Assisteo Agny, mon assistant IA de poche : une seule base de code pour le web et Android (Next.js, Capacitor) qui scanne, classe, suit tes colis, tes dépenses et tes bénéfices, et transforme même un document en todo list. Supabase, Redis et PostgreSQL en coulisses.',
    src: '/works/assisteo-agny.webp',
    ctaUrl: 'https://assisteo-agny.vercel.app',
  },
  {
    title: 'Tikou',
    description:
      'Conçu, développé et mis en ligne en solo : Tikou est la boutique en ligne d’une marque malgache d’artisanat en raphia et cuir. Next.js, TypeScript, Tailwind CSS — catalogue, panier, contact, bilingue FR/EN, et du vrai SEO. Pas une maquette : il tourne, avec de vrais visiteurs et de vraies commandes.',
    src: '/works/tikou.webp',
    ctaUrl: 'https://www.tikou-mdg.com',
  },
]
