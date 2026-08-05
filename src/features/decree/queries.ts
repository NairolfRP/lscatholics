import { queryOptions } from '@tanstack/react-query'
import { getDecreeFn, getDecreesFn } from '#/features/decree/server-fn/decree.functions.ts'

/** Decrees change rarely (promulgation only), so a 5-minute cache is safe. */
const STALE_TIME = 5 * 60_000

export const decreesQueryOptions = queryOptions({
  queryKey: ['decrees'],
  queryFn: () => getDecreesFn(),
  staleTime: STALE_TIME,
  retry: 1,
  refetchOnWindowFocus: false,
})

export const decreeQueryOptions = (uid: string) =>
  queryOptions({
    queryKey: ['decree', uid],
    queryFn: () => getDecreeFn({ data: uid }),
    staleTime: STALE_TIME,
    retry: 1,
    refetchOnWindowFocus: false,
  })
