import { Link } from '@tanstack/react-router'
import { BanIcon, CircleOffIcon, Edit, Trash2 } from 'lucide-react'
import type { ActionButtonReturnType } from '#/shared/components/action-button'
import { ActionButton } from '#/shared/components/action-button'
import { Button, buttonVariants } from '#/shared/components/ui/button'
import { ButtonGroup } from '#/shared/components/ui/button-group'
import type { User } from '#/shared/lib/types/auth'
import { formatDateTime } from '#/utils/date'
import type { UsersTableMeta } from '../../types/user.types'
import { BanUserDialog } from './ban-user-dialog'

export function UserActionsCell({
  target,
  currentUserId,
  canDeleteUsers,
  onUnban,
  onBanSuccess,
  onDelete,
}: {
  target: User
  currentUserId: string
  canDeleteUsers: boolean
  onUnban: (id: string) => ActionButtonReturnType
  onBanSuccess: UsersTableMeta['onBanSuccess']
  onDelete: (id: string) => ActionButtonReturnType
}) {
  const isSelf = currentUserId === target.id

  return (
    <div className="flex justify-end">
      <ButtonGroup>
        <Link
          type="button"
          to="/dashboard/users/edit/$id"
          aria-label="Gérer l'utilisateur"
          params={{ id: target.id }}
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
        >
          <Edit className="h-4 w-4" />
        </Link>

        {target.banned ? (
          <ActionButton
            variant="ghost"
            size="icon"
            areYouSureTitle="Débannir ?"
            title={`Débannir ${target.name}`}
            areYouSureDescription={
              <>
                Êtes-vous sûr de vouloir lever le bannissement de <strong>{target.name}</strong> ?
                {/* oxlint-disable-next-line typescript/no-unnecessary-condition */}
                {target.banExpires ? (
                  <> Il est temporairement banni jusqu'au {formatDateTime(target.banExpires)}</>
                ) : null}
              </>
            }
            aria-label={`Débannir ${target.name}`}
            action={() => onUnban(target.id)}
            requireAreYouSure
          >
            <CircleOffIcon />
          </ActionButton>
        ) : !isSelf ? (
          <BanUserDialog user={target} onSuccess={onBanSuccess}>
            <Button
              variant="ghost"
              size="icon"
              title={`Bannir ${target.name}`}
              aria-label={`Bannir ${target.name}`}
            >
              <BanIcon />
            </Button>
          </BanUserDialog>
        ) : null}

        {!isSelf && canDeleteUsers ? (
          <ActionButton
            variant="ghost"
            size="icon"
            areYouSureTitle={`Supprimer l'utilisateur « ${target.name} » ?`}
            areYouSureDescription="Attention. La suppression est définitive, immédiate et sensible. Assurez-vous d'avoir de bonnes raisons."
            action={() => onDelete(target.id)}
            requireAreYouSure
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </ActionButton>
        ) : null}
      </ButtonGroup>
    </div>
  )
}
