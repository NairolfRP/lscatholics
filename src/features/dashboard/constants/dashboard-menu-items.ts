import {
  BriefcaseBusinessIcon,
  FileTextIcon,
  LandmarkIcon,
  LayoutDashboardIcon,
  UsersIcon,
} from 'lucide-react'
import type { DashboardMenuItem } from '../types/dashboard.types'

export const dashboardMenuCategories = {
  content: { id: 'content', label: 'Contenu', icon: FileTextIcon },
  employment: { id: 'employment', label: 'Ressources humaines', icon: BriefcaseBusinessIcon },
  finances: { id: 'finances', label: 'Finances & Immobiliers', icon: LandmarkIcon },
  admin: { id: 'admin', label: '(( Admin ))', icon: UsersIcon },
} as const

export const dashboardMenuItems: DashboardMenuItem[] = [
  {
    label: 'Tableau de bord',
    icon: LayoutDashboardIcon,
    to: '/dashboard',
    permissions: { dashboard: ['access'] },
  },
  {
    label: 'Articles',
    to: '/dashboard/posts',
    permissions: { post: ['read'] },
    category: dashboardMenuCategories.content,
  },
  {
    label: 'Événements',
    to: '/dashboard/events',
    permissions: { event: ['read'] },
    category: dashboardMenuCategories.content,
  },
  {
    label: "Offres d'emplois",
    to: '/dashboard/job-openings',
    permissions: { job: ['read'] },
    category: dashboardMenuCategories.employment,
  },
  {
    label: 'Finances',
    to: '/dashboard/finances',
    permissions: { finances: ['read'] },
    category: dashboardMenuCategories.finances,
  },
  {
    label: 'Utilisateurs',
    to: '/dashboard/users',
    permissions: { user: ['list'] },
    category: dashboardMenuCategories.admin,
  },
]
