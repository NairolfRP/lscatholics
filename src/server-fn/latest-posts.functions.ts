import { createServerFn } from '@tanstack/react-start'
import { setPublicCache } from '#server/lib/http-cache'
import * as latestPostsService from '#server/services/latest-posts.service'

export const getLatestPostsFn = createServerFn({ method: 'GET' }).handler(async () => {
  setPublicCache({ maxAge: 60, sMaxAge: 300, staleWhileRevalidate: 3600 })
  return latestPostsService.getLatestPosts()
})
