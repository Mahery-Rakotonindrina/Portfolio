export type Company = 'Domoti' | 'Freelance' | 'Vivetic' | 'Manao' | 'Pushtech'

export type CompanyDetail = {
  name: string
  longName: string
  duration: string
  // Optionnel : "Freelance" (CV, aucun client nommé) et "Manao" n'ont pas de
  // logo externe vérifiable à afficher — voir TimelineItem.tsx pour le
  // repli visuel (icône générique) plutôt qu'une image inventée/mal
  // attribuée.
  logo?: {
    light: string
    dark?: string
  }
  roles?: JSX.Element[]
}

export const Experiences: {
  [key in Company]: CompanyDetail
} = {
  Domoti: {
    name: 'DOMOTI',
    longName: 'Groupe DOMOTI',
    duration: 'Nov 2024 - Présent',
    logo: {
      light:
        'https://media.licdn.com/dms/image/v2/D4E0BAQFzHPHTpI3bCw/company-logo_200_200/company-logo_200_200/0/1720176478939/domoti_s_a_s_logo?e=2147483647&v=beta&t=blpNV3pUQ2DRXO19y098h0cPoJl359f0zIHfh57HVy0',
      dark: 'https://media.licdn.com/dms/image/v2/D4E0BAQFzHPHTpI3bCw/company-logo_200_200/company-logo_200_200/0/1720176478939/domoti_s_a_s_logo?e=2147483647&v=beta&t=blpNV3pUQ2DRXO19y098h0cPoJl359f0zIHfh57HVy0',
    },
    roles: [
      <>Développeur en Régie chez DOMOTI SA</>,
      <>
        En novembre 2024, j’ai rejoint Domoti en tant que développeur en régie.
        Ma première mission a été de concevoir un module dédié au suivi de
        commande sur leur plateforme, un projet concret qui m’a permis de
        m’immerger rapidement dans leur environnement technique et métier.
      </>,
    ],
  },
  // Ajouté (CV) : manquait entièrement de la timeline — seul le projet
  // GIPROD Androy en résultant apparaît dans la galerie "best-of". Mission
  // freelance menée EN PARALLÈLE du poste Vivetic (CV : "Freelance, temps
  // partiel, en parallèle du poste principal"), pas un poste séquentiel —
  // d'où la précision dans le texte plutôt qu'une simple liste chronologique
  // muette sur ce chevauchement.
  Freelance: {
    name: 'Freelance',
    longName: 'Développeur Fullstack — Freelance',
    duration: 'Sep 2022 - Mai 2023',
    roles: [
      <>
        Développeur Fullstack indépendant, en parallèle de mon poste chez
        Vivetic
      </>,
      <>
        Entre septembre 2022 et mai 2023, j’ai mené cette mission freelance en
        parallèle de mon poste chez Vivetic : GIPROD Androy, une application de
        recensement des habitants d’Androy. Front-end en React.js, back-end en
        PHP/Laravel, le tout connecté à une base de données relationnelle via
        une API REST.
      </>,
    ],
  },
  Vivetic: {
    name: 'VIVETIC',
    longName: 'VIVETIC GROUP',
    duration: 'Sep 2021 - Présent',
    logo: {
      light:
        'https://www.vivetic-group.com/wp-content/uploads/2020/09/format-page_vignette.png',
      dark: 'https://www.vivetic-group.com/wp-content/uploads/2020/09/format-page_vignette.png',
    },
    roles: [
      <>Ingénieur en Développement Web au sein du service informatique</>,
      <>
        Jusqu’en novembre 2024, j’étais développeur web au sein du service
        informatique de Vivetic Group. J’ai travaillé sur plusieurs projets
        internes, notamment la gestion des congés, de la cantine, du transport,
        ainsi que l’outil Viapost, utilisé quotidiennement par les équipes. Ces
        outils visaient à optimiser les processus internes de l’entreprise.
      </>,
      <>
        J’ai également contribué à des projets externes liés à la GED (Gestion
        Électronique des Documents). Nous développions des solutions pour des
        entreprises partenaires, leur permettant de gérer efficacement des
        documents sensibles comme les bons d’achat, les chèques, ou
        d&apos;autres types de pièces justificatives.
      </>,
      <>
        J’ai ensuite rejoint le pôle Service Numérique en tant que développeur
        en régie pour le compte de Domoti Groupe
      </>,
    ],
  },
  // Ajouté (CV) : stage de fin d'études chez Manao Logiciels, absent de la
  // timeline — seul le projet qui en est issu (GESCOM, galerie "best-of")
  // était visible, sans que l'expérience elle-même n'apparaisse ici.
  Manao: {
    name: 'Manao Logiciels',
    longName: 'Manao Logiciels',
    duration: 'Mar 2021 - Sep 2021',
    roles: [
      <>Stagiaire en développement Web — stage de fin d’études</>,
      <>
        Mon tout premier projet d’envergure : la conception et la réalisation
        d’une application de gestion des factures périodiques, avec CodeIgniter
        4, jQuery et MySQL/MariaDB.
      </>,
    ],
  },
  Pushtech: {
    name: 'PUSHTECH',
    longName: 'PUSHTECH CONSULTING',
    duration: 'Jan 2019 - Fev 2020',
    logo: {
      light: 'https://assets.codeur.com/hrxmubu5wivkaazr1njowpb2tvry',
      dark: 'https://assets.codeur.com/hrxmubu5wivkaazr1njowpb2tvry',
    },
    roles: [
      <>Développeur Backend à temps partiel</>,
      <>
        {/* Corrigé (CV) : la Licence professionnelle se terminait en 2019,
            l'Ingénierie informatique/Master courait 2019-2021 — en janvier
            2019, je débutais tout juste ce cursus, je ne le "finalisais" pas
            (l'ancien texte le disait, à tort). */}
        En janvier 2019, j’ai commencé à travailler comme développeur Symfony à
        temps partiel, tout en poursuivant mes études en ingénierie
        informatique. Cette période m’a permis de mettre en pratique mes
        compétences tout en poursuivant mon parcours académique.
      </>,
    ],
  },
}

export const ExperiencesList = [
  Experiences.Domoti,
  Experiences.Freelance,
  Experiences.Vivetic,
  Experiences.Manao,
  Experiences.Pushtech,
]
