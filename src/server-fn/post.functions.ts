import { createServerFn } from '@tanstack/react-start'
import { basePostInteractionSchema, postsSearchSchema } from '#/features/post/schemas/post.schema'
import { requirePermission } from '#/middleware/permission.middleware'
import * as postService from '#server/services/post.service'
import { looseObjectSchema } from '#shared/schemas/common.schema'
import { dashboardSearchSchema } from '#shared/schemas/dashboard/search.schema'

export const getPostFn = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data }) => postService.getPost({ slug: data }))

export const getDashboardPostFn = createServerFn({ method: 'GET' })
  .middleware([requirePermission('post', 'read')])
  .validator((id: string) => id)
  .handler(async ({ data, context }) =>
    postService.getDashboardPost({ id: data, user: context.session.user })
  )

export const getPostsFn = createServerFn({ method: 'GET' })
  .validator(postsSearchSchema)
  .handler(async ({ data }) => postService.getPosts({ data }))

export const getDashboardPostsFn = createServerFn({ method: 'GET' })
  .middleware([requirePermission('post', 'read')])
  .validator(dashboardSearchSchema)
  .handler(async ({ data }) => postService.getDashboardPosts({ data }))

export const deletePostFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('post', 'delete')])
  .validator(basePostInteractionSchema)
  .handler(async ({ data, context }) =>
    postService.deletePost({ postId: data.postId, user: context.session.user })
  )

export const updatePostFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('post', 'update')])
  .validator(looseObjectSchema)
  .handler(async ({ data, context }) =>
    postService.updatePost({ data, user: context.session.user })
  )

export const createPostFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('post', 'create')])
  .validator(looseObjectSchema)
  .handler(async ({ data, context }) =>
    postService.createPost({
      data,
      user: context.session.user,
      currentCharacter: context.currentCharacter,
    })
  )
