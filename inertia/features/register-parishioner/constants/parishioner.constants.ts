import { Church, Heart, Users } from 'lucide-react'

export const PARISHIONER_BENEFITS = [
  {
    icon: Users,
    iconClass: 'w-10 h-10 text-blue-600 mb-3',
    title: 'Rejoindre nos communautés',
    description: "Rencontrez d'autres paroissiens et grandissez ensemble dans la foi.",
  },
  {
    icon: Heart,
    iconClass: 'w-10 h-10 text-purple-600 mb-3',
    title: 'Développement spirituel',
    description:
      'Accéder aux sacrements, aux activités pastorales et aux programmes à la foi religieuse',
  },
  {
    icon: Church,
    iconClass: 'w-10 h-10 text-indigo-600 mb-3',
    title: 'Restez informés',
    description:
      'Recevez des informations sur les horaires des messes, les événements et les actualités des paroisses.',
  },
]
