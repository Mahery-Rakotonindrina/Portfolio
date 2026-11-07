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
  // Optionnel : étude de cas affichée dans la modale de détail
  // (ProjectDetailModal), en plus de `description` (toujours utilisée telle
  // quelle sur la carte — volontairement courte). Seulement rempli quand le
  // PO a confirmé des faits allant au-delà de `description` (demande
  // explicite du PO, "la modale répète exactement le même texte que la
  // carte") — pas de contexte/défi/résultat inventé pour les projets où on
  // n'a que la description courte.
  caseStudy?: {
    context: string
    challenge: string
    result: string
  }
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
    // Correction (PO) : contrairement à une première hypothèse, Becquet
    // tourne sur SON PROPRE code — pas la même base que CoreWeb (entrée
    // séparée ci-dessous). Description revenue à un projet autonome, mission
    // via Domoti/Vivetic conservée (confirmée séparément par le PO).
    description:
      'Le plus gros chantier technique de mon parcours jusqu’ici, réalisé en mission via Domoti/Vivetic. Sur ce site e-commerce, j’ai dû faire tenir ensemble un Next.js en façade et tout un monde .NET/C# en coulisses — WCF, GraphQL, et des procédures stockées qu’il a fallu apprivoiser pour que l’ensemble tienne la route.',
    src: '/works/becquet.webp',
    ctaUrl: 'https://www.becquet.fr',
    // Étude de cas ajoutée (PO, faits confirmés directement) : le défi réel
    // ne se limitait pas à WCF/GraphQL/procédures stockées, il incluait aussi
    // des montées en version de Next.js en cours de route. Pas de chiffre
    // (trafic, durée...) fourni par le PO au-delà de "toujours en prod
    // aujourd'hui" — rien d'autre inventé.
    caseStudy: {
      context:
        'Becquet est un site e-commerce français bien réel (becquet.fr), sur lequel je suis intervenu en mission via Domoti/Vivetic : un front Next.js branché sur un système existant en .NET/C#.',
      challenge:
        'Le vrai casse-tête : faire dialoguer ce front moderne avec la logique métier .NET déjà en place — WCF, GraphQL, et des procédures stockées à apprivoiser — tout en migrant Next.js vers des versions plus récentes en cours de route, sans casser ce qui tournait déjà en production.',
      result:
        'Le site tourne toujours en production aujourd’hui sur becquet.fr.',
    },
  },
  {
    title: 'CoreWeb',
    // Entrée ajoutée (PO) : à distinguer de Becquet! ci-dessus (code séparé,
    // cf. correction PO). CoreWeb est le socle multi-marques de Domoti —
    // chaque domaine listé vérifié réellement en ligne (tempsl.fr,
    // ideeshomme.fr, chienchatetcompagnie.fr confirmés par navigation directe
    // avant d'écrire cette description ; les 3 autres pris sur la parole du
    // PO, schéma cohérent avec les précédents). Image : capture réelle de
    // tempsl.fr (catégorie "Cuisson et accessoires", hors bandeau promo).
    description:
      'CoreWeb est un autre chantier chez Domoti, cette fois multi-marques : une base de code à part entière qui fait tourner plusieurs enseignes e-commerce bien distinctes — TempsL, Idées Homme, Chien Chat et Compagnie, Confort et Vie, Marianne Mélodie, L’Atelier de Lucie. Même stack que Becquet (Next.js, .NET/C#, WCF, GraphQL, procédures stockées), mais un code qui lui est propre.',
    src: '/works/coreweb.webp',
    ctaUrl: 'https://www.tempsl.fr',
    // Étude de cas ajoutée (PO, faits confirmés directement) : le mécanisme
    // multi-marques (thème/config par enseigne) et le compte de 6 enseignes
    // sur une même base de code — rien au-delà de ce que le PO a confirmé
    // (pas de détail d'implémentation inventé : build par marque ?
    // multi-tenant runtime ? non précisé, donc non affirmé).
    caseStudy: {
      context:
        'CoreWeb est la plateforme multi-marques de Domoti, sur une base de code à part entière (même stack que Becquet, projet séparé).',
      challenge:
        'Un seul code sert 6 enseignes bien distinctes — TempsL, Idées Homme, Chien Chat et Compagnie, Confort et Vie, Marianne Mélodie, L’Atelier de Lucie — grâce à un système de thème/configuration par marque : couleurs, logo et contenu changent selon le domaine, sur le même socle technique.',
      result: 'Les 6 sites tournent toujours en production aujourd’hui.',
    },
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
    // Étude de cas ajoutée (PO, faits confirmés directement) : deux défis en
    // parallèle (cross-platform + fiabilité de l'IA elle-même), confirmés par
    // le PO ("tout"). Statut confirmé "utilisable/testé dès maintenant" —
    // pas de prétendre que c'est fini (le CV dit "En cours").
    caseStudy: {
      context:
        'Assisteo Agny est mon projet personnel en cours : un assistant IA de poche, pensé pour le web et Android depuis une seule base de code (Next.js, Capacitor).',
      challenge:
        'Deux défis en parallèle : faire tourner cette base de code nativement sur le web et sur Android (caméra, stockage, comportement propre à chaque plateforme), et faire fonctionner l’IA elle-même — scanner une photo et la classer correctement (aliment, document, véhicule, objet...) de façon fiable.',
      result:
        'Déjà utilisable et testé aujourd’hui, même si le développement continue — scan, suivi des colis, des dépenses et des bénéfices, todo lists générées depuis un document.',
    },
  },
  {
    title: 'Tikou',
    description:
      'Conçu, développé et mis en ligne en solo : Tikou est la boutique en ligne d’une marque malgache d’artisanat en raphia et cuir. Next.js, TypeScript, Tailwind CSS — catalogue, panier, contact, bilingue FR/EN, et du vrai SEO. Pas une maquette : il tourne, avec de vrais visiteurs et de vraies commandes.',
    src: '/works/tikou.webp',
    ctaUrl: 'https://www.tikou-mdg.com',
    // Étude de cas ajoutée (PO, confirmé directement) : le défi EST le solo
    // de bout en bout pour un vrai client — pas d'autre angle technique à
    // inventer, le PO l'a confirmé explicitement.
    caseStudy: {
      context:
        'Tikou est la boutique en ligne d’une marque malgache d’artisanat en raphia et cuir — un vrai client, avec un vrai catalogue à mettre en ligne.',
      challenge:
        'Tout faire seul, de bout en bout : design, développement (Next.js, TypeScript, Tailwind CSS), déploiement, contenu bilingue FR/EN, et SEO — aucune étape déléguée à quelqu’un d’autre.',
      result:
        'Le site est en ligne sur tikou-mdg.com, avec de vrais visiteurs et de vraies commandes.',
    },
  },
]
