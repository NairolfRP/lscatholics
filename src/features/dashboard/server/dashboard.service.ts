import { churchEventRepository } from '#/server/repositories/church-event.repository'
import { postRepository } from '#/server/repositories/post.repository'
import { userRepository } from '#/server/repositories/user.repository'

export async function getDashboardStats() {
  const [userCount, postCount, eventCount] = await Promise.all([
    userRepository.getCount(),
    postRepository.getCount(),
    churchEventRepository.getCount(),
  ])

  return {
    posts: postCount,
    events: eventCount,
    users: userCount,
  }
}
