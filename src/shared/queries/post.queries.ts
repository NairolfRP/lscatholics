import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type { DashboardSearch } from '../schemas/dashboard/search.schema.ts'
import { getLatestPostsFn } from '#/server-fn/latest-posts.functions.ts'
import { getDashboardPostsFn, getPostFn, getPostsFn } from '#/server-fn/post.functions.ts'

export const latestPostsQueryOptions = queryOptions({
  queryKey: ['posts', 'latest'],
  queryFn: () => getLatestPostsFn(),
})

export const postQueryOptions = (slug: string) => {
  return queryOptions({
    queryKey: ['post', slug],
    queryFn: () => getPostFn({ data: slug }),
  })
}

export const postsQueryOptions = (page: number) => {
  return queryOptions({
    queryKey: ['posts', page],
    queryFn: () => getPostsFn({ data: { page } }),
    staleTime: 60_000, // 1min
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
    retry: 2,
  })
}

export const postsDashboardQueryOptions = (deps: DashboardSearch) => {
  return queryOptions({
    queryKey: ['posts', 'dashboard', deps],
    queryFn: () => getDashboardPostsFn({ data: deps }),
    staleTime: 5 * 60_000, // 5 minutes,
  })
}
