import { Link } from '@tanstack/react-router'
import { BanIcon, CircleOffIcon, Edit, Trash2 } from 'lucide-react'
import { Button, buttonVariants } from '#/shared/components/ui/button'
import { ButtonGroup } from '#/shared/components/ui/button-group'
import type { User } from '#/shared/lib/types/auth'
import type { ActionReturnType } from '#/shared/types/action.types'
import { confirmAction } from '#/shared/utils/confirm-action'
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
  onUnban: (id: string) => ActionReturnType
  onBanSuccess: UsersTableMeta['onBanSuccess']
  onDelete: (id: string) => ActionReturnType
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
          <Button
            variant="ghost"
            size="icon"
            title={`Débannir ${target.name}`}
            aria-label={`Débannir ${target.name}`}
            onClick={() =>
              void confirmAction(
                {
                  title: 'Débannir ?',
                  description: (
                    <>
                      Êtes-vous sûr de vouloir lever le bannissement de{' '}
                      <strong>{target.name}</strong> ?
                      {/* oxlint-disable-next-line typescript/no-unnecessary-condition */}
                      {target.banExpires ? (
                        <>
                          {' '}
                          Il est temporairement banni jusqu'au {formatDateTime(target.banExpires)}
                        </>
                      ) : null}
                    </>
                  ),
                },
                () => onUnban(target.id)
              )
            }
          >
            <CircleOffIcon />
          </Button>
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
          <Button
            variant="ghost"
            size="icon"
            title={`Supprimer l'utilisateur « ${target.name} »`}
            aria-label={`Supprimer l'utilisateur « ${target.name} »`}
            onClick={() =>
              void confirmAction(
                {
                  title: `Supprimer l'utilisateur « ${target.name} » ?`,
                  description:
                    "Attention. La suppression est définitive, immédiate et sensible. Assurez-vous d'avoir de bonnes raisons.",
                },
                () => onDelete(target.id)
              )
            }
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        ) : null}
      </ButtonGroup>
    </div>
  )
}
