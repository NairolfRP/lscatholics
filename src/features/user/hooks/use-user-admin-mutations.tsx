import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { toast } from '#/shared/components/ui/toast'
import type { ActionButtonReturnType } from '#/shared/components/action-button'
import { authClient } from '#/shared/integrations/auth/auth-client'
import type { User } from '#/shared/lib/types/auth'
import { formatDateTime } from '#/utils/date'
import type { DashboardSearch } from '#shared/schemas/dashboard/search.schema.ts'
import { usersListQueryOptions } from '../queries'

export function useUserAdminMutations(deps?: DashboardSearch) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const invalidateUsersList = () =>
    queryClient.invalidateQueries({
      queryKey: deps ? usersListQueryOptions(deps).queryKey : ['admin', 'list-users'],
    })

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string): ActionButtonReturnType => {
      const { error } = await authClient.admin.removeUser({ userId })

      if (error) {
        return { error: true, message: error.message }
      }

      toast.success(`L'utilisateur a été supprimé`)
      void invalidateUsersList()
      return { error: false }
    },
    onError: () => {
      return { error: true, message: 'Une erreur est survenue' }
    },
  })

  const unbanUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data: unbannedUser, error: unbanUserError } = await authClient.admin.unbanUser({
        userId,
      })

      if (unbanUserError) {
        return { error: true, message: unbanUserError.message }
      }

      toast.success(
        <>
          <strong>{unbannedUser.user.name}</strong> a été débanni
        </>
      )
      void invalidateUsersList()
      void router.invalidate()
      return { error: false }
    },
    onError: () => {
      return { error: true, message: 'Une erreur est survenue' }
    },
  })

  const handleBanSuccess = ({
    bannedUser,
    closeDialog,
  }: {
    bannedUser: User
    closeDialog: () => void
  }) => {
    // oxlint-disable-next-line typescript/no-unnecessary-condition
    const banExpirationDateStr = bannedUser.banExpires
      ? ` jusqu'au ${formatDateTime(bannedUser.banExpires)}`
      : ''
    toast.success(
      <>
        <strong>{bannedUser.name}</strong> a été banni
        {/* oxlint-disable-next-line typescript/no-unnecessary-condition */}
        {banExpirationDateStr}. Raison : <strong>{bannedUser.banReason ?? 'N/A'}</strong>.
      </>
    )
    void invalidateUsersList()
    void router.invalidate()
    closeDialog()
  }

  return {
    deleteUserMutation,
    unbanUserMutation,
    handleBanSuccess,
  }
}
