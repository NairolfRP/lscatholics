import { Link } from '@adonisjs/inertia/react'
import { hasRoute, isCurrentRoute, urlFor } from '@/client'
import { useCallback, useMemo } from 'react'
import { usePage } from '@inertiajs/react'
import { BriefcaseBusiness, Calendar, FileText, LayoutDashboard, Users } from 'lucide-react'
import type { Data } from '@generated/data'

const ALL_MENU_ITEMS = [
  {
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    route: 'dashboard.index' as const,
    permission: 'dashboardAccess',
  },
  {
    label: 'Articles',
    icon: FileText,
    route: 'dashboard.dashboard_posts.index*' as const,
    permission: 'viewArticles',
  },
  {
    label: 'Événements',
    icon: Calendar,
    route: 'dashboard.dashboard_events.index*' as const,
    permission: 'manageEvents',
  },
  {
    label: "Offres d'emplois",
    icon: BriefcaseBusiness,
    route: 'dashboard.dashboard_jobs.index*' as const,
    permission: 'viewArticles',
  },
  {
    label: 'Utilisateurs',
    icon: Users,
    route: 'dashboard.dashboard_users.index*' as const,
    permission: 'manageUsers',
  },
]

const navLinkClasses = (route: string, activeExtra?: string) =>
  [
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isCurrentRoute(route as any)
      ? `bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white ${activeExtra ?? ''}`
      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50',
  ].join(' ')

export default function DashboardNavLinks() {
  const page = usePage<Data.SharedProps>()

  const hasPermission = useCallback(
    (permission: string) => (page.props.permissions as string[]).some((p) => p === permission),
    [page.props.permissions]
  )

  const menuItems = useMemo(
    () => ALL_MENU_ITEMS.filter((item) => !item.permission || hasPermission(item.permission)),
    [hasPermission]
  )

  return (
    <>
      {menuItems.map((item) => (
        <Link
          key={item.route}
          href={
            hasRoute(item.route.replace('*', '')) ? urlFor(item.route.replace('*', '') as any) : '#'
          }
          className={navLinkClasses(item.route)}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </>
  )
}
