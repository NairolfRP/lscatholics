import type { HelpCard } from '@/features/charities/types/charities.types'

export const HELP_CARDS: HelpCard[] = [
  {
    title: 'Faire un don',
    body: 'Chaque offrande, petite ou grande, se transforme en nourriture, en abri, en espérance.',
    cta: 'Donner maintenant',
    route: 'donate.index',
    accent: 'bg-catholic-blue',
  },
  {
    title: 'Devenir bénévole',
    body: 'Offrez votre temps et vos talents au service de vos frères et sœurs dans le besoin.',
    cta: "S'engager",
    route: 'volunteers.index',
    accent: 'bg-secondary',
  },
  {
    title: "Demander de l'aide",
    body: 'Vous traversez une période difficile ? Nos équipes sont là, sans jugement, avec discrétion.',
    cta: 'Nous contacter',
    href: '#contact',
    accent: 'bg-catholic-purple',
  },
]
