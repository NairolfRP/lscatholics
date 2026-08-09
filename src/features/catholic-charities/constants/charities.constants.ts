import { HandHeart, HeartHandshake, LifeBuoy } from 'lucide-react'
import type { HelpCard } from '#/features/catholic-charities/types/charities.types'

export const helpCards: HelpCard[] = [
  {
    icon: HandHeart,
    title: 'Faire un don',
    body: 'Chaque offrande, petite ou grande, se transforme en nourriture, en abri, en espérance.',
    cta: 'Donner maintenant',
    to: '/donate',
    accent: 'bg-catholic-blue',
  },
  {
    icon: HeartHandshake,
    title: 'Devenir bénévole',
    body: 'Offrez votre temps et vos talents au service de vos frères et sœurs dans le besoin.',
    cta: "S'engager",
    to: '/volunteers',
    accent: 'bg-catholic-purple',
  },
  {
    icon: LifeBuoy,
    title: "Demander de l'aide",
    body: 'Vous traversez une période difficile ? Nos équipes sont là, sans jugement, avec discrétion.',
    cta: 'Nous contacter',
    to: '.',
    hash: 'contact',
    accent: 'bg-catholic-red',
  },
]
