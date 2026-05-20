import { useState } from 'react'
import { ArrowRightLeft, Lock, LogOut, Settings, User } from 'lucide-react'
import { router, usePage } from '@inertiajs/react'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { urlFor } from '@/lib/client'
import SwitchCharacterDialog from '@/shared/components/characters/switch-character-dialog'
import type { Data } from '@generated/data'

export default function UserMenu() {
  const page = usePage<Data.SharedProps>()
  const { canAccessDashboard, user } = page.props
  const [isSwitchCharacterOpen, setIsSwitchCharacterOpen] = useState(false)

  const characterName = (() => {
    const currentCharacter = user?.currentCharacter
    const fullName = `${currentCharacter?.firstname} ${currentCharacter?.lastname}`
    return fullName.length > 15 ? fullName.slice(0, 15) + '...' : fullName
  })()

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'dashboard':
        router.visit(urlFor('dashboard.index'))
        break
      case 'settings':
        router.visit(urlFor('account.settings'))
        break
      case 'logout':
        router.post(
          urlFor('logout'),
          { intended: page.url },
          {
            preserveScroll: true,
          }
        )
        break
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" aria-label={characterName} className="cursor-pointer">
            <User className="size-lg laptop:size-sm" />
            <span className="block lg:hidden laptop:block">{characterName}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 mr-10 z-99">
          <DropdownMenuLabel>Mon compte - {user!.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {canAccessDashboard && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleMenuAction('dashboard')}>
                  <Lock />
                  <span>Tableau de bord</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsSwitchCharacterOpen(true)}>
              <ArrowRightLeft />
              <span>Changer de personnage</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('settings')}>
              <Settings />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleMenuAction('logout')}
              className="text-destructive font-medium"
            >
              <LogOut />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <SwitchCharacterDialog open={isSwitchCharacterOpen} onOpenChange={setIsSwitchCharacterOpen} />
    </>
  )
}
