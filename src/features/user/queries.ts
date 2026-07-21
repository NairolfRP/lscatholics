import { queryOptions } from '@tanstack/react-query'
import type { DashboardSearch } from '#shared/schemas/dashboard/search.schema.ts'
import { getDiscordAccountFn, getUsersListFn } from '#/features/user/server-fn/user.functions'

const DISCORD_CONNECTION_QUERY_KEY = 'discord-connection'

export const discordConnectionQueryOptions = (sessionId?: string) =>
  queryOptions({
    queryKey: [DISCORD_CONNECTION_QUERY_KEY, sessionId],
    queryFn: () => getDiscordAccountFn(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

export const discordConnectionQueryKey = (sessionId?: string) =>
  queryOptions({
    queryKey: [DISCORD_CONNECTION_QUERY_KEY, sessionId],
  })

export const usersListQueryOptions = (deps: DashboardSearch) =>
  queryOptions({
    queryKey: ['users', 'dashboard', deps],
    queryFn: () => getUsersListFn({ data: deps }),
  })
