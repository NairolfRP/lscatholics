import { queryOptions } from '@tanstack/react-query'
import { getBankBalanceFn } from '#/features/banking/server-fn/banking.functions.ts'

export const bankAccountBalanceQueryOptions = queryOptions({
  queryKey: ['banking', 'balance'],
  queryFn: async () => getBankBalanceFn(),
  staleTime: 5 * 60_000, // 5 minutes
})
