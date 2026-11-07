import Head from 'next/head'

// URL canonique : celle listée sur le CV de l'utilisateur
// (mahery-rakotonindrina.vercel.app) — nécessaire en absolu pour og:image/
// og:url (les réseaux sociaux ne résolvent pas un chemin relatif).
const SITE_URL = 'https://mahery-rakotonindrina.vercel.app'
const SITE_TITLE = 'Mahery Rakotonindrina — Développeur Frontend'
const SITE_DESCRIPTION =
  "Développeur Frontend (React, Next.js, TypeScript) : conception d'interfaces modernes et performantes, architecture front-end, intégration d'API. Découvrez mon parcours et mes projets."

// Photo réelle de l'utilisateur, déjà utilisée comme avatar (Avatar/index.tsx)
// — remplace l'ancien og:image qui pointait vers un visuel de stock tiers
// (CreativeFabrica, un logo générique sans rapport, repéré lors de la revue
// de contenu demandée par le PO) : n'importe quel partage du lien (Slack,
// LinkedIn, Messenger...) affichait l'image de quelqu'un/quelque chose
// d'autre à la place du site.
const OG_IMAGE = `${SITE_URL}/Profil_MaheryRakotonindrina.png`

const OpenGraphHead = () => (
  <Head>
    <title>{SITE_TITLE}</title>
    <meta name="description" content={SITE_DESCRIPTION} />
    <meta name="author" content="Mahery Rakotonindrina" />
    <link rel="canonical" href={SITE_URL} />

    <meta property="og:title" content={SITE_TITLE} />
    <meta property="og:description" content={SITE_DESCRIPTION} />
    <meta property="og:site_name" content="Mahery Rakotonindrina" />
    <meta property="og:type" content="profile" />
    <meta property="og:url" content={SITE_URL} />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:image" content={OG_IMAGE} />
    <meta property="og:image:alt" content="Mahery Rakotonindrina" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={SITE_TITLE} />
    <meta name="twitter:description" content={SITE_DESCRIPTION} />
    <meta name="twitter:image" content={OG_IMAGE} />
  </Head>
)
export default OpenGraphHead
