import { CalendarIcon, FileTextIcon, UsersIcon } from 'lucide-react'

export const dashboardStatsAttributes = [
  {
    label: 'Articles',
    value: 'posts' as const,
    icon: FileTextIcon,
    color: 'text-blue-600',
  },
  {
    label: 'Événements',
    value: 'events' as const,
    icon: CalendarIcon,
    color: 'text-green-600',
  },
  {
    label: 'Utilisateurs',
    value: 'users' as const,
    icon: UsersIcon,
    color: 'text-purple-600',
  },
]
