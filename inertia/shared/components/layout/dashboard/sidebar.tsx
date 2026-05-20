import { Link } from '@adonisjs/inertia/react'
import { client, urlFor } from '@/lib/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import {
  BriefcaseBusiness,
  Calendar,
  ChevronsUpDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { useUser } from '@/shared/hooks/use_user'
import { Logo } from '@/shared/components/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components/ui/sidebar'
import { usePage } from '@inertiajs/react'
import type { Data } from '@generated/data'
import type { RouteName } from '@/shared/types/routes'

type DashboardMenuItem = {
  label: string
  icon: typeof LayoutDashboard
  route: RouteName
  permission: string
}

const MENU_ITEMS: DashboardMenuItem[] = [
  {
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    route: 'dashboard.index' as const,
    permission: 'dashboardAccess',
  },
  {
    label: 'Articles',
    icon: FileText,
    route: 'dashboard.dashboard_posts.index',
    permission: 'viewArticles',
  },
  {
    label: 'Événements',
    icon: Calendar,
    route: 'dashboard.dashboard_events.index',
    permission: 'manageEvents',
  },
  {
    label: "Offres d'emplois",
    icon: BriefcaseBusiness,
    route: 'dashboard.dashboard_jobs.index',
    permission: 'viewArticles',
  },
  {
    label: 'Utilisateurs',
    icon: Users,
    route: 'dashboard.dashboard_users.index',
    permission: 'manageUsers',
  },
]

export default function DashboardSidebar() {
  const user = useUser()
  const { isMobile, open } = useSidebar()

  const userInitials = useMemo(() => {
    const names = user!.name!.split(' ')
    return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0]
  }, [user])

  return (
    <Sidebar collapsible="icon" variant="inset">
      {open && (
        <SidebarHeader className="items-center mb-5">
          <Link route="home">
            <Logo className="h-20" />
          </Link>
        </SidebarHeader>
      )}
      <SidebarContent>
        <DashboardSidebarItems />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage alt="Avatar" />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user!.name}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage alt="Avatar" />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user!.name}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href={urlFor('account.settings')}>
                      <Settings />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={urlFor('logout')} method="post" className="text-destructive">
                      <LogOut />
                      Déconnexion
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function DashboardSidebarItems() {
  const page = usePage<Data.SharedProps>()

  const hasPermission = useCallback(
    (permission: string) => (page.props.permissions as string[]).some((p) => p === permission),
    [page.props.permissions]
  )

  const menuItems = useMemo(
    () => MENU_ITEMS.filter((item) => !item.permission || hasPermission(item.permission)),
    [hasPermission]
  )

  return (
    <>
      {menuItems.map((item) => (
        <SidebarGroup key={item.route}>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                key={item.route}
                route={item.route.replace(/\*/g, '') as RouteName}
                aria-current={
                  client.current(item.route) ||
                  page.url.startsWith(urlFor(item.route.replace(/\*/g, '') as RouteName))
                }
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      ))}
    </>
  )
}
