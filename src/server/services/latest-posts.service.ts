import { postRepository } from '#server/repositories/post.repository'

const HOMEPAGE_POSTS_LIMIT = 4

export async function getLatestPosts() {
  return postRepository.findLatest(HOMEPAGE_POSTS_LIMIT, {
    id: true,
    slug: true,
    title: true,
    coverImageUrl: true,
    publishedAt: true,
    category: true,
  })
}
