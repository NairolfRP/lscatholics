import { Link } from '@adonisjs/inertia/react'
import { urlFor } from '@/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { LogOut, Menu, Settings } from 'lucide-react'
import { useMemo } from 'react'
import { useUser } from '@/shared/hooks/use_user'
import DashboardNavLinks from '@/shared/components/layout/dashboard/nav-links'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet'

export default function DashboardSidebar() {
  const user = useUser()

  const userInitials = useMemo(() => {
    const names = user!.name!.split(' ')
    return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0]
  }, [user])

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 h-dvh w-64 border-r bg-white dark:bg-gray-800 hidden lg:block pl-safe">
        <div className="flex h-full flex-col">
          <div
            className="flex h-16 items-center border-b px-6 pt-safe"
            style={{ height: 'calc(4rem + env(safe-area-inset-top))' }}
          >
            <Link href={urlFor('home')} className="flex items-center gap-2">
              <span className="text-xl font-bold">LS Catholics</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            <DashboardNavLinks />
          </nav>

          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{user!.name}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={urlFor('account.settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={urlFor('logout')} method="post" className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4 text-inherit" />
                    Déconnexion
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      <header
        className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 lg:hidden dark:bg-gray-800 pt-safe pl-[calc(1rem+env(safe-area-inset-left))] pr-safe"
        style={{ height: 'calc(4rem + env(safe-area-inset-top))' }}
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Ouvrir le menu de navigation"
              title="Ouvrir le menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center border-b px-6">
                <Link href={urlFor('home')} className="flex items-center gap-2">
                  <span className="text-xl font-bold">LS Catholics</span>
                </Link>
              </div>
              <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Menu principal">
                <DashboardNavLinks />
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        <span className="text-lg font-semibold">Dashboard</span>
      </header>
    </>
  )
}
