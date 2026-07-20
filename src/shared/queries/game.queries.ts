import { queryOptions } from '@tanstack/react-query'
import { getGameContextFn } from '#/server-fn/game.functions'

export const gameContextQueryOptions = queryOptions({
  queryKey: ['game-context'],
  queryFn: async () => {
    const { user: _, ...result } = await getGameContextFn()
    return result
  },
  staleTime: 60_000,
})
