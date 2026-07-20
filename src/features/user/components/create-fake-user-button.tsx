import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { DashboardSearch } from '#/features/dashboard/schemas/dashboard-search.schema'
import { Button } from '#/shared/components/ui/button'
import { authClient } from '#/shared/integrations/auth/auth-client'
import { usersListQueryOptions } from '../queries'

export function CreateFakeUserButton({ deps }: { deps: DashboardSearch }) {
  const queryClient = useQueryClient()

  const createFakeUser = useMutation({
    mutationFn: async () => {
      const { faker } = await import('@faker-js/faker')
      const fakeUsername = faker.internet.username()
      return authClient.admin.createUser({
        name: fakeUsername,
        email: `${fakeUsername}@gtaw.placeholder.local`,
        data: { banned: false },
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: usersListQueryOptions(deps).queryKey,
      })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue')
    },
  })

  return (
    <Button
      variant="secondary"
      onClick={() => createFakeUser.mutate()}
      disabled={createFakeUser.isPending}
    >
      <PlusIcon /> (DEV) Créer un utilisateur
    </Button>
  )
}
