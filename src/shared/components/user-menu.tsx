import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { User } from 'lucide-react'
import { toast } from 'sonner'
import SwitchCharacterDialog from '#/features/character-switch/components/switch-character-dialog'
import { Button } from '#/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/shared/components/ui/dropdown-menu'
import { useGameContext } from '#shared/hooks/use-game-context.ts'
import { authClient } from '../integrations/auth/auth-client'

type UserMenuProps = {
  username: string
}

// oxlint-disable-next-line oxc/only-used-in-recursion
export default function UserMenu({ username }: UserMenuProps) {
  const { currentCharacter, canAccessDashboard } = useGameContext()
  const [isSwitchOpen, setIsSwitchOpen] = useState(false)

  const characterFullName = currentCharacter
    ? `${currentCharacter.firstname} ${currentCharacter.lastname}`
    : ''
  return (
    <>
      <DropdownMenu>
        <UserMenu.Trigger characterName={characterFullName} />
        <UserMenu.Content
          username={username}
          canAccessDashboard={canAccessDashboard}
          onOpenSwitch={() => setIsSwitchOpen(true)}
        />
      </DropdownMenu>

      <SwitchCharacterDialog open={isSwitchOpen} onOpenChange={setIsSwitchOpen} />
    </>
  )
}

type UserMenuTriggerProps = {
  characterName: string
}

UserMenu.Trigger = function Trigger({ characterName }: UserMenuTriggerProps) {
  return (
    <DropdownMenuTrigger
      render={
        <Button variant="ghost" aria-label={characterName}>
          <User className="size-lg" />
          <span className="ml-2 hidden max-w-35 truncate min-[28.063rem]:inline min-[65.875rem]:hidden min-[76.063rem]:inline">
            {characterName}
          </span>
        </Button>
      }
    />
  )
}

type UserMenuContentProps = {
  username: string
  canAccessDashboard: boolean
  onOpenSwitch: () => void
}

UserMenu.Content = function Content({
  username,
  canAccessDashboard,
  onOpenSwitch,
}: UserMenuContentProps) {
  const router = useRouter()

  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuGroup>
        <DropdownMenuLabel>Mon compte - {username}</DropdownMenuLabel>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      {canAccessDashboard && (
        <>
          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link to="/dashboard" preload={false} />}>
              Tableau de bord
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </>
      )}

      <DropdownMenuGroup>
        <DropdownMenuItem onClick={onOpenSwitch}>Changer de personnage</DropdownMenuItem>
        <DropdownMenuItem render={<Link to="/account/settings" />}>Paramètres</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={async () =>
            await authClient.signOut({
              fetchOptions: {
                onSuccess: async () => {
                  await router.invalidate()
                  toast.success('Vous vous êtes déconnecté. A bientôt !')
                },
              },
            })
          }
        >
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}
