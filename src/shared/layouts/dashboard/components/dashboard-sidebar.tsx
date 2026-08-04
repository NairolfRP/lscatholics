import { useMemo, useState } from 'react'
import { Link, useRouteContext } from '@tanstack/react-router'
import {
  ArrowBigLeftIcon,
  ArrowRightLeftIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react'
import { dashboardMenuItems } from '#/features/dashboard/constants/dashboard-menu-items'
import { Logo } from '#/shared/components/logo'
import { Avatar, AvatarFallback, AvatarImage } from '#/shared/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/shared/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '#/shared/components/ui/sidebar'
import { authClient } from '#/shared/integrations/auth/auth-client'
import SwitchCharacterDialog from '#shared/components/character-switch/dialog.tsx'

export function DashboardSidebar() {
  const { data: session, isPending } = authClient.useSession()
  const { isMobile, open } = useSidebar()

  const user = session?.user

  const userInitials = useMemo(() => {
    if (!user) {
      return ''
    }
    const names = user.name.split(' ')
    return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0]
  }, [user])

  if (isPending) {
    return null
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      {open && (
        <SidebarHeader className="mb-5">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Logo width={56} height={56} loading="eager" className="size-14 shrink-0" />
            <div className="grid flex-1 gap-0.5 overflow-hidden">
              <span className="truncate text-base leading-tight font-semibold">LS Catholics</span>
              <span className="truncate text-xs text-muted-foreground">Tableau de bord</span>
            </div>
          </Link>
        </SidebarHeader>
      )}
      <SidebarContent>
        <DashboardSidebarItems />
      </SidebarContent>
      <DashboardSidebarFooter
        userInitials={userInitials}
        username={user!.name}
        isMobile={isMobile}
      />
      <SidebarRail />
    </Sidebar>
  )
}

function DashboardSidebarItems() {
  const context = useRouteContext({ from: '/dashboard' })
  const resolved = context.gameContext.permissions

  const menuItems = useMemo(
    () =>
      dashboardMenuItems.filter((item) =>
        Object.entries(item.permissions).every(([resource, actions]) =>
          actions.every((action) => resolved[resource]?.includes(action))
        )
      ),
    [resolved]
  )

  return (
    <SidebarGroup>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton render={<Link to={item.to} preload={false} />}>
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function DashboardSidebarFooter({
  userInitials,
  username,
  isMobile,
}: {
  userInitials: string
  username: string
  isMobile: boolean
}) {
  const context = useRouteContext({ from: '/dashboard' })
  const [isSwitchCharacterOpen, setSwitchCharacterOpen] = useState<boolean>(false)

  const characterFullName = context.gameContext.currentCharacter ? (
    `${context.gameContext.currentCharacter.firstname} ${context.gameContext.currentCharacter.lastname}`
  ) : (
    <em>Personnage inconnu</em>
  )

  return (
    <>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="aria-expanded:bg-sidebar-accent aria-expanded:text-sidebar-accent-foreground"
                  />
                }
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt="Avatar" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <UserIcon />
                  </AvatarFallback>
                </Avatar>
                <div className="text-left text-sm leading-tight">
                  <span className="truncate font-medium">{characterFullName}</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage alt="Avatar" />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="text-left text-sm leading-tight">
                        <span className="truncate font-medium">{username}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    render={<Link to="/" preload={false} />}
                  >
                    <ArrowBigLeftIcon /> Retour sur l'application
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setSwitchCharacterOpen(true)}
                  >
                    <ArrowRightLeftIcon /> Changer de personnage
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    render={<Link to="/account/settings" />}
                  >
                    <SettingsIcon />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={async () => {
                      await authClient.signOut({
                        query: { callbackURL: '/' },
                      })
                    }}
                    variant="destructive"
                  >
                    <LogOutIcon />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SwitchCharacterDialog open={isSwitchCharacterOpen} onOpenChange={setSwitchCharacterOpen} />
    </>
  )
}
