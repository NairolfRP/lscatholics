import {
  BriefcaseBusinessIcon,
  CalendarIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from 'lucide-react'
import type { DashboardMenuItem } from '../types/dashboard.types'

export const dashboardMenuItems: Array<DashboardMenuItem> = [
  {
    label: 'Tableau de bord',
    icon: LayoutDashboardIcon,
    to: '/dashboard',
    permission: 'dashboardAccess',
  },
  {
    label: 'Articles',
    icon: FileTextIcon,
    to: '/dashboard/posts/',
    permission: 'viewArticles',
  },
  {
    label: 'Événements',
    icon: CalendarIcon,
    to: '/dashboard/events/',
    permission: 'manageEvents',
  },
  {
    label: "Offres d'emplois",
    icon: BriefcaseBusinessIcon,
    to: '/dashboard/job-openings/',
    permission: 'viewArticles',
  },
  {
    label: 'Utilisateurs',
    icon: UsersIcon,
    to: '/dashboard/users/',
    permission: 'manageUsers',
  },
]
