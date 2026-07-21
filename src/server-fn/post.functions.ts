import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import { requireDashboardAccess } from '#/middleware/permission.middleware.ts'
import { logger } from '#server/integrations/logger.ts'
import { postRepository } from '#server/repositories/post.repository.ts'
import { getFieldErrors } from '#/utils/form.ts'
import { createSlug, generateExcerpt } from '#/utils/string.ts'
import { NotFoundException, UnauthorizedException } from '#server/exceptions/http-exception.ts'
import { DASHBOARD_PAGINATION_LIMIT } from '#shared/constants/dashboard.ts'
import { POST_STATUS } from '#shared/constants/post-status.ts'
import { dashboardSearchSchema } from '#shared/schemas/dashboard/search.schema.ts'
import {
  basePostInteractionSchema,
  editPostSchema,
  postsSearchSchema,
} from '../features/post/schemas/post.schema.ts'
import { canEditPost } from '../features/post/utils/post.utils.ts'

export const getPostFn = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data }) => {
    const post = await postRepository.getPost({
      slug: data,
      columns: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        coverImageUrl: true,
        publishedAt: true,
        updatedAt: true,
      },
    })

    if (!post) {
      throw notFound()
    }

    return post
  })

export const getDashboardPostFn = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const post = await postRepository.getPostWithAuthor({
      id: data,
      columns: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImageUrl: true,
        publishedAt: true,
        status: true,
        authorId: true,
      },
      authorColumns: {
        id: true,
        name: true,
      },
    })

    if (!post) {
      throw notFound()
    }

    return post
  })

export const getPostsFn = createServerFn({ method: 'GET' })
  .validator(postsSearchSchema)
  .handler(async ({ data }) => {
    return postRepository.getPosts({
      columns: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        coverImageUrl: true,
        publishedAt: true,
      },
      page: data.page,
    })
  })

export const getDashboardPostsFn = createServerFn({ method: 'GET' })
  .middleware([requireDashboardAccess])
  .validator(dashboardSearchSchema)
  .handler(async ({ data }) => {
    return postRepository.getPosts({
      columns: {
        id: true,
        slug: true,
        title: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        authorId: true,
      },
      page: data.page,
      pageSize: DASHBOARD_PAGINATION_LIMIT,
      orderBy: [data.sortBy],
      status: null,
      searchText: data.search
        ? [
            { column: 'title', text: `%${data.search}%` },
            { column: 'excerpt', text: `%${data.search}%` },
            { column: 'content', text: `%${data.search}%` },
          ]
        : undefined,
    })
  })

export const deletePostFn = createServerFn({ method: 'POST' })
  .middleware([requireDashboardAccess])
  .validator(basePostInteractionSchema)
  .handler(async ({ data, context }) => {
    const post = await postRepository.getPost({
      id: data.postId,
      status: null,
      columns: { id: true, authorId: true },
    })

    if (!post) {
      setResponseStatus(404)
      throw new Error('Post not found')
    }

    const user = context.session.user

    if (!canEditPost({ user, authorId: post.authorId })) {
      setResponseStatus(401)
      throw new Error('Unauthorized')
    }

    try {
      await postRepository.deletePost({ id: post.id })

      return { success: true }
    } catch (err) {
      logger.error(
        {
          err,
          user: { id: user.id, name: user.name, roles: JSON.stringify(user.role.split(',')) },
        },
        "Failed to delete post (id: '%s')",
        post.id
      )

      setResponseStatus(500)
      throw new Error('Internal error')
    }
  })

export const updatePostFn = createServerFn({ method: 'POST' })
  .middleware([requireDashboardAccess])
  .validator(async (data: unknown) => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data')
    }

    if (!('postId' in data)) {
      throw new Error('Missing post ID')
    }

    const { postId, ...values } = data

    if (typeof postId !== 'string') {
      throw new Error('Invalid post ID')
    }

    const post = await postRepository.getPost({
      id: postId,
      columns: {
        authorId: true,
        status: true,
      },
    })

    if (!post) {
      throw NotFoundException('Post not found')
    }

    return { postId, post, values }
  })
  .handler(async ({ data: rawData, context }) => {
    const { postId, post, values } = rawData
    const isAuthorized = canEditPost({ user: context.session.user, authorId: post.authorId })

    if (!isAuthorized) {
      throw UnauthorizedException()
    }

    try {
      const validatedData = await editPostSchema.parseAsync(values)

      let slug = validatedData.slug
      if (!slug) {
        slug = createSlug(validatedData.title)
      }

      let excerpt = validatedData.excerpt
      if (!excerpt) {
        excerpt = generateExcerpt(validatedData.content, 150)
      }

      let publishedAt = validatedData.publishedAt
      if (validatedData.status === POST_STATUS.PUBLISHED && !publishedAt) {
        publishedAt = new Date()
      }

      await postRepository.update({ id: postId }, { ...validatedData, slug, excerpt, publishedAt })

      return { success: true }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors = getFieldErrors(err)
        setResponseStatus(400)
        return { success: false, error: null, validationErrors }
      }

      logger.error({ err, postId, userId: context.session.user.id }, 'Failed to update post')
      setResponseStatus(500)
      return { success: false, error: 'Une erreur est survenue' }
    }
  })
