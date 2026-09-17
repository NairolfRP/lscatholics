import { handleServiceError } from '#server/exceptions/service-error'
import { postRepository } from '#server/repositories/post.repository'

const HOMEPAGE_POSTS_LIMIT = 4

export async function getLatestPosts() {
  try {
    return await postRepository.findLatest(HOMEPAGE_POSTS_LIMIT, {
      id: true,
      slug: true,
      title: true,
      coverImageUrl: true,
      publishedAt: true,
      category: true,
    })
  } catch (err) {
    handleServiceError(err, { limit: HOMEPAGE_POSTS_LIMIT }, 'Failed to get latest posts')
  }
}
