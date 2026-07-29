import { createServerFn } from '@tanstack/react-start'
import * as latestPostsService from '#server/services/latest-posts.service'

export const getLatestPostsFn = createServerFn({ method: 'GET' }).handler(async () => {
  return latestPostsService.getLatestPosts()
})
