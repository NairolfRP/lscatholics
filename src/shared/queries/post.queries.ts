import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getLatestPostsFn } from '#/server-fn/latest-posts.functions.ts'
import { getDashboardPostsFn, getPostFn, getPostsFn } from '#/server-fn/post.functions.ts'
import type { DashboardSearch } from '../schemas/dashboard/search.schema.ts'

export const latestPostsQueryOptions = queryOptions({
  queryKey: ['posts', 'latest'],
  queryFn: () => getLatestPostsFn(),
  staleTime: 5 * 60 * 1000,
})

export const postQueryOptions = (slug: string) => {
  return queryOptions({
    queryKey: ['post', slug],
    queryFn: () => getPostFn({ data: slug }),
    staleTime: 5 * 60 * 1000,
  })
}

export const postsQueryOptions = (page: number) => {
  return queryOptions({
    queryKey: ['posts', page],
    queryFn: () => getPostsFn({ data: { page } }),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
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
