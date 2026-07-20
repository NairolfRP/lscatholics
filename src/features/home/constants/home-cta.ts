import { Briefcase, Calendar, ChessBishop } from 'lucide-react'
import { socials } from '#/shared/constants/socials'
import type { CTA } from '../types/home.types'

export const homeCTA: Array<CTA> = [
  {
    icon: ChessBishop,
    title: 'Cardinal Ronan Callahan',
    to: '/archbishop',
    description: "Découvrez l'Archevêque de Los Santos : sa biographie, son blason, sa devise.",
  },
  {
    icon: Briefcase,
    title: "Offres d'emploi",
    to: '/careers',
    description:
      "Explorez les opportunités d'emploi dans les paroisses, les départements et les entités de l'Archidiocèse",
  },
  {
    icon: Calendar,
    title: 'Prochains événements',
    to: '/events',
    description:
      'Informez-vous sur les messes, les célébrations et tous les autres événements à venir.',
  },
  {
    icon: socials.discord.icon,
    title: '(( Rejoins notre serveur Discord ))',
    description:
      "Suivre l'actualité de la faction et consulter des ressources sur le roleplay catholique",
    href: socials.discord.href,
  },
]
