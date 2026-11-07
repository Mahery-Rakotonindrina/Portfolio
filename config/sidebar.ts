import { IconType } from 'react-icons'
import {
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaDev,
  FaFacebook,
} from 'react-icons/fa'

export type SocialMedia = {
  label: string
  href: string
  icon: IconType
}

export const SocialMedias: SocialMedia[] = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/maheryrakotonindrina/',
    icon: FaInstagram,
  },
  {
    label: 'LinkedIn',
    // Corrigé pour coller au CV (source de vérité) : l'URL sans suffixe
    // numérique menait à un profil/page différent de celui listé sur le CV.
    href: 'https://www.linkedin.com/in/mahery-rakotonindrina-2b6888154/',
    icon: FaLinkedin,
  },
  {
    label: 'Github',
    href: 'https://github.com/Mahery-Rakotonindrina',
    icon: FaGithub,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/maery.rakotonindrina',
    icon: FaFacebook,
  },
]
