import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import {
  basePostInteractionSchema,
  createPostSchema,
  editPostSchema,
  postsSearchSchema,
} from '#/features/post/schemas/post.schema.ts'
import {
  canEditPost,
  resolveExcerpt,
  resolvePublishedAt,
} from '#/features/post/utils/post.utils.ts'
import { requireDashboardAccess } from '#/middleware/permission.middleware.ts'
import { getFieldErrors } from '#/utils/form.ts'
import { resolveSlug } from '#/utils/slug.ts'
import { NotFoundException, UnauthorizedException } from '#server/exceptions/http-exception.ts'
import { logger } from '#server/integrations/logger.ts'
import { postRepository } from '#server/repositories/post.repository.ts'
import { DASHBOARD_PAGINATION_LIMIT } from '#shared/constants/dashboard.ts'
import { looseObjectSchema } from '#shared/schemas/common.schema.ts'
import { dashboardSearchSchema } from '#shared/schemas/dashboard/search.schema.ts'

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
  .middleware([requireDashboardAccess])
  .validator((id: string) => id)
  .handler(async ({ data, context }) => {
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
        authorDisplayName: true,
        createdAt: true,
        updatedAt: true,
      },
      authorColumns: {
        id: true,
        name: true,
      },
      status: null,
    })

    if (!post) {
      throw notFound()
    }

    const isAuthorized = canEditPost({
      user: context.session.user,
      authorId: post.author?.id ?? null,
    })

    if (!isAuthorized) {
      throw UnauthorizedException()
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
      throw NotFoundException('Post not found')
    }

    const user = context.session.user

    if (!canEditPost({ user, authorId: post.authorId })) {
      setResponseStatus(401)
      throw UnauthorizedException('Not authorized to delete this post')
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
    const schema = z
      .object({
        postId: z.cuid2({
          error: (iss) => (iss.input === undefined ? 'Missing post ID' : 'Bad ID format'),
        }),
      })
      .catchall(z.unknown())
      .refine((obj) => Object.keys(obj).length > 1, {
        error: 'Invalid body',
      })
    const { postId, ...values } = schema.parse(data)

    const post = await postRepository.getPost({
      id: postId,
      columns: { authorId: true, status: true },
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
      setResponseStatus(401)
      throw UnauthorizedException('Not authorized to edit this post')
    }

    try {
      const validatedData = await editPostSchema.parseAsync(values)

      const slug = resolveSlug(validatedData.slug, validatedData.title)
      const excerpt = resolveExcerpt(validatedData.excerpt, validatedData.content)
      const publishedAt = resolvePublishedAt(validatedData.publishedAt, validatedData.status)

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

export const createPostFn = createServerFn({ method: 'POST' })
  .middleware([requireDashboardAccess])
  .validator(looseObjectSchema)
  .handler(async ({ data, context }) => {
    try {
      const validatedData = await createPostSchema.parseAsync(data)

      let slug = resolveSlug(validatedData.slug, validatedData.title)

      if (await postRepository.existsBySlug(slug)) {
        let counter = 1
        const baseSlug = slug
        while (await postRepository.existsBySlug(slug)) {
          slug = `${baseSlug}-${counter}`
          counter++
        }
      }

      const excerpt = resolveExcerpt(validatedData.excerpt, validatedData.content)
      const publishedAt = resolvePublishedAt(validatedData.publishedAt, validatedData.status)

      const currentCharacterFullName = [
        context.currentCharacter?.firstname,
        context.currentCharacter?.lastname,
      ]
        .filter(Boolean)
        .join(' ')

      const createdPost = await postRepository.create(
        {
          title: validatedData.title,
          slug,
          excerpt,
          content: validatedData.content,
          coverImageUrl: validatedData.coverImageUrl,
          status: validatedData.status,
          publishedAt,
          authorDisplayName: currentCharacterFullName.trim() || 'John Doe',
          authorId: context.session.user.id,
        },
        { returning: ['id'] }
      )

      return { success: true, postId: createdPost[0].id }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors = getFieldErrors(err)
        setResponseStatus(400)
        return { success: false, validationErrors }
      }

      logger.error({ err, data, userId: context.session.user.id }, 'Failed to create post')
      setResponseStatus(500)
      return { success: false, error: 'Une erreur est survenue' }
    }
  })
