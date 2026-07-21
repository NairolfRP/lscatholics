import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronsUpDownIcon, LogOutIcon, SettingsIcon } from 'lucide-react'
import SwitchCharacterDialog from '#shared/components/character-switch/dialog.tsx'
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
        <SidebarHeader className="mb-5 items-center">
          <Link to="/">
            <Logo width={80} height={80} loading="eager" />
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
  // TODO
  /* const hasPermission = useCallback(
    (permission: string) => (permissions as string[]).some((p) => p === permission),
    []
  )

  const menuItems = useMemo(
    () => dashboardMenuItems.filter((item) => hasPermission(item.permission)),
    [hasPermission]
  ) */

  return (
    <SidebarGroup>
      <SidebarMenu>
        {dashboardMenuItems.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton render={<Link to={item.to as any} preload={false} />}>
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
  const [isSwitchCharacterOpen, setSwitchCharacterOpen] = useState<boolean>(false)

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
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="text-left text-sm leading-tight">
                  <span className="truncate font-medium">{username}</span>
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
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSwitchCharacterOpen(true)}>
                    Changer de personnage
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link to="/account/settings" />}>
                    <SettingsIcon />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await authClient.signOut({
                        query: { callbackURL: '/' },
                      })
                    }}
                    className="text-destructive"
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
