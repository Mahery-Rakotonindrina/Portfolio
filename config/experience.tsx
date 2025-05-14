import { Link } from '@chakra-ui/react'
import { JSXElementConstructor } from 'react'

export type Company = 'Domoti' | 'Vivetic' | 'Pushtech'

export type CompanyDetail = {
  name: string
  longName: string
  duration: string
  logo: {
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
      light: 'https://media.licdn.com/dms/image/v2/D4E0BAQFzHPHTpI3bCw/company-logo_200_200/company-logo_200_200/0/1720176478939/domoti_s_a_s_logo?e=2147483647&v=beta&t=blpNV3pUQ2DRXO19y098h0cPoJl359f0zIHfh57HVy0',
      dark: 'https://media.licdn.com/dms/image/v2/D4E0BAQFzHPHTpI3bCw/company-logo_200_200/company-logo_200_200/0/1720176478939/domoti_s_a_s_logo?e=2147483647&v=beta&t=blpNV3pUQ2DRXO19y098h0cPoJl359f0zIHfh57HVy0',
    },
    roles: [
      <>Développeur en Régie chez DOMOTI SA</>,
      <>
        En novembre 2024, j’ai rejoint Domoti en tant que développeur en régie.
        Ma première mission a été de concevoir un module dédié au suivi de commande
        sur leur plateforme, un projet concret qui m’a permis de m’immerger rapidement
        dans leur environnement technique et métier.
      </>
    ],
  },
  Vivetic: {
    name: 'VIVETIC',
    longName: 'VIVETIC GROUP',
    duration: 'Sep 2021 - Présent',
    logo: {
      light: 'https://www.vivetic-group.com/wp-content/uploads/2020/09/format-page_vignette.png',
      dark: 'https://www.vivetic-group.com/wp-content/uploads/2020/09/format-page_vignette.png',
    },
    roles: [
      <>Igénieur en Développement Web au sein du service informatique</>,
      <>
        Jusqu’en novembre 2024, j’étais développeur web au sein du service informatique de Vivetic Group.
        J’ai travaillé sur plusieurs projets internes, notamment la gestion des congés, de la cantine,
        du transport, ainsi que l’outil Viapost, utilisé quotidiennement par les équipes.
        Ces outils visaient à optimiser les processus internes de l’entreprise.
      </>,
      <>
        J’ai également contribué à des projets externes liés à la GED (Gestion Électronique des Documents).
        Nous développions des solutions pour des entreprises partenaires, leur permettant de gérer efficacement
        des documents sensibles comme les bons d’achat, les chèques, ou d'autres types de pièces justificatives.
      </>,
      <>J’ai ensuite rejoint le pôle Service Numérique en tant que développeur en régie pour Domoti Group</>
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
    roles:[
      <>Développeur Backend à temps partiel</>,
      <>
        En janvier 2019, j’ai commencé à travailler comme développeur Symfony à temps partiel,
        tout en finalisant mon Master 2 en Informatique. Cette période m’a permis de mettre en pratique
        mes compétences tout en poursuivant mon parcours académique.
      </>
    ]
  },
}

export const ExperiencesList = [
  Experiences.Domoti,
  Experiences.Vivetic,
  Experiences.Pushtech,
]
