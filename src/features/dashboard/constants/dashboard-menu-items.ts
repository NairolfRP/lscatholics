import {
  BriefcaseBusinessIcon,
  CalendarIcon,
  FileTextIcon,
  LandmarkIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from 'lucide-react'
import type { DashboardMenuItem } from '../types/dashboard.types'

export const dashboardMenuItems: DashboardMenuItem[] = [
  {
    label: 'Tableau de bord',
    icon: LayoutDashboardIcon,
    to: '/dashboard',
    permissions: { dashboard: ['access'] },
  },
  {
    label: 'Articles',
    icon: FileTextIcon,
    to: '/dashboard/posts',
    permissions: { post: ['read'] },
  },
  {
    label: 'Événements',
    icon: CalendarIcon,
    to: '/dashboard/events',
    permissions: { event: ['read'] },
  },
  {
    label: "Offres d'emplois",
    icon: BriefcaseBusinessIcon,
    to: '/dashboard/job-openings',
    permissions: { job: ['read'] },
  },
  {
    label: 'Finances',
    icon: LandmarkIcon,
    to: '/dashboard/finances',
    permissions: { finances: ['read'] },
  },
  {
    label: 'Utilisateurs',
    icon: UsersIcon,
    to: '/dashboard/users',
    permissions: { user: ['list'] },
  },
]
