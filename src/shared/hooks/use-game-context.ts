import { useQuery } from '@tanstack/react-query'
import { authClient } from '../integrations/auth/auth-client'
import { gameContextQueryOptions } from '../queries/game.queries'

export function useGameContext() {
  const { data: authSession, isPending: isAuthPending } = authClient.useSession()

  const query = useQuery({
    ...gameContextQueryOptions,
    enabled: !!authSession,
  })

  return {
    isAuthenticated: !!authSession,
    isLoading: isAuthPending || (!!authSession && query.isLoading),
    characters: query.data?.characters,
    currentCharacter: query.data?.currentCharacter,
    canAccessDashboard: query.data?.canAccessDashboard ?? false,
    permissions: query.data?.permissions ?? {},
  }
}
