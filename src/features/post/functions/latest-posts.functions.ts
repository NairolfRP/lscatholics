import { createServerFn } from '@tanstack/react-start'
import { postRepository } from '#/server/repositories/post.repository'

const HOMEPAGE_POSTS_LIMIT = 4

export const getLatestPostsFn = createServerFn({ method: 'GET' }).handler(async () => {
  return postRepository.findLatest(HOMEPAGE_POSTS_LIMIT, {
    id: true,
    slug: true,
    title: true,
    coverImageUrl: true,
    publishedAt: true,
    category: true,
  })
})
