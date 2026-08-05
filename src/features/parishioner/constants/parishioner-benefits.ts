import type { LucideIcon } from 'lucide-react'
import { ChurchIcon, HeartHandshakeIcon, MegaphoneIcon } from 'lucide-react'

export const PARISHIONER_BENEFITS: {
  icon: LucideIcon
  title: string
  description: string
}[] = [
  {
    icon: HeartHandshakeIcon,
    title: 'Rejoindre nos communautés',
    description: "Rencontrez d'autres paroissiens et grandissez ensemble dans la foi.",
  },
  {
    icon: ChurchIcon,
    title: 'Développement spirituel',
    description:
      'Accédez aux sacrements, aux activités pastorales et aux programmes à la foi religieuse.',
  },
  {
    icon: MegaphoneIcon,
    title: 'Restez informés',
    description:
      'Recevez des informations sur les horaires des messes, les événements et les actualités des paroisses.',
  },
]
