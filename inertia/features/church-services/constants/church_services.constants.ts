import {
  CHURCH_SERVICES_META,
  type ChurchServiceMeta,
} from '#shared/constants/church_services.constants'
import {
  Cake,
  Calendar,
  Church,
  Cross,
  Ear,
  Hand,
  Handshake,
  Heart,
  type LucideIcon,
  Mic,
  Shield,
  Skull,
} from 'lucide-react'

type ChurchServiceIconAndClasses = Partial<
  Record<
    (typeof CHURCH_SERVICES_META)[number]['id'],
    { icon: LucideIcon; iconClasses: string } | { icon?: undefined; iconClasses?: never }
  >
>

export type ChurchService = ChurchServiceMeta &
  ({ icon: LucideIcon; iconClasses: string } | { icon?: undefined; iconClasses?: never })

const ICONS_AND_CLASSES: ChurchServiceIconAndClasses = {
  christianInitiation: {
    icon: Church,
    iconClasses: 'bg-indigo-600',
  },
  requestMass: {
    icon: Calendar,
    iconClasses: 'bg-yellow-600',
  },
  confession: {
    icon: Ear,
    iconClasses: 'bg-purple-500',
  },
  sicks: {
    icon: Cross,
    iconClasses: 'bg-rose-700',
  },
  marriage: {
    icon: Heart,
    iconClasses: 'bg-pink-500',
  },
  funerals: {
    icon: Skull,
    iconClasses: 'bg-gray-700',
  },
  exorcism: {
    icon: Shield,
    iconClasses: 'bg-indigo-800',
  },
  benediction: {
    icon: Hand,
    iconClasses: 'bg-green-600',
  },
  conference: {
    icon: Mic,
    iconClasses: 'bg-cyan-500',
  },
  mediation: {
    icon: Handshake,
    iconClasses: 'bg-indigo-500',
  },
  quinceanera: {
    icon: Cake,
    iconClasses: 'bg-pink-400',
  },
}

export const CHURCH_SERVICES: ChurchService[] = CHURCH_SERVICES_META.map((s) => ({
  ...s,
  ...ICONS_AND_CLASSES[s.id],
}))
