import { createServerFn } from '@tanstack/react-start'
import { requirePermission } from '#/middleware/permission.middleware.ts'
import { churchEventRepository } from '#/server/repositories/church-event.repository'
import { postRepository } from '#/server/repositories/post.repository'
import { userRepository } from '#/server/repositories/user.repository'

export const getDashboardStatsFn = createServerFn({ method: 'GET' })
  .middleware([requirePermission('dashboard', 'access')])
  .handler(async () => {
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
  })
