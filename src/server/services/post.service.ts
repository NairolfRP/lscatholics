import { notFound } from '@tanstack/react-router'
import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import { createPostSchema, editPostSchema } from '#/features/post/schemas/post.schema'
import {
  deletePostNotification,
  editPostNotification,
  sendPostNotification,
} from '#/features/post/server/post-notification.service'
import { canEditPost, resolveExcerpt, resolvePublishedAt } from '#/features/post/utils/post.utils'
import { getFieldErrors } from '#/utils/form'
import { resolveSlug } from '#/utils/slug'
import { NotFoundException, UnauthorizedException } from '#server/exceptions/http-exception'
import { logger } from '#server/integrations/logger'
import { postRepository } from '#server/repositories/post.repository'
import { DASHBOARD_PAGINATION_LIMIT } from '#shared/constants/dashboard'
import { POST_STATUS } from '#shared/constants/post-status'
import type { User } from '#shared/lib/types/auth'

export async function getPost({ slug }: { slug: string }) {
  const post = await postRepository.getPost({
    slug,
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
}

export async function getDashboardPost({ id, user }: { id: string; user: User }) {
  const post = await postRepository.getPostWithAuthor({
    id,
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
      discordMessageId: true,
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
    user,
    authorId: post.author?.id ?? null,
  })

  if (!isAuthorized) {
    throw UnauthorizedException()
  }

  return post
}

export async function getPosts({ data }: { data: { page: number } }) {
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
}

export async function getDashboardPosts({
  data,
}: {
  data: { page: number; sortBy: string; search?: string }
}) {
  return postRepository.getPosts({
    columns: {
      id: true,
      slug: true,
      title: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      authorId: true,
      discordMessageId: true,
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
}

export async function deletePost({ postId, user }: { postId: string; user: User }) {
  const post = await postRepository.getPost({
    id: postId,
    status: null,
    columns: { id: true, authorId: true },
  })

  if (!post) {
    setResponseStatus(404)
    throw NotFoundException('Post not found')
  }

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
}

export async function sendExistingPostNotification({
  postId,
  user,
}: {
  postId: string
  user: User
}) {
  const post = await postRepository.getPost({
    id: postId,
    status: null,
    columns: {
      id: true,
      authorId: true,
      title: true,
      slug: true,
      publishedAt: true,
      status: true,
      discordMessageId: true,
    },
  })

  if (!post) {
    setResponseStatus(404)
    throw NotFoundException('Post not found')
  }

  if (!canEditPost({ user, authorId: post.authorId })) {
    setResponseStatus(401)
    throw UnauthorizedException('Not authorized to send notification for this post')
  }

  if (post.status !== POST_STATUS.PUBLISHED) {
    return { success: false, error: 'Seuls les articles publiés peuvent être notifiés' }
  }

  try {
    if (post.discordMessageId) {
      await deletePostNotification({ messageId: post.discordMessageId })
    }

    const discordMessageId = await sendPostNotification({
      title: post.title,
      slug: post.slug,
      publishedAt: post.publishedAt,
    })

    if (discordMessageId) {
      await postRepository.update({ id: postId }, { discordMessageId })
    }

    return { success: true }
  } catch (err) {
    logger.error({ err, postId, userId: user.id }, 'Failed to send post notification')
    setResponseStatus(500)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

export async function updatePost({ data, user }: { data: unknown; user: User }) {
  const idSchema = z
    .object({
      postId: z.uuidv4({
        error: (iss) => (iss.input === undefined ? 'Missing post ID' : 'Bad ID format'),
      }),
    })
    .catchall(z.unknown())
    .refine((obj) => Object.keys(obj).length > 1, {
      error: 'Invalid body',
    })

  const { postId, ...values } = idSchema.parse(data)

  const post = await postRepository.getPost({
    id: postId,
    columns: { authorId: true, status: true, discordMessageId: true },
  })

  if (!post) {
    throw NotFoundException('Post not found')
  }

  const isAuthorized = canEditPost({ user, authorId: post.authorId })

  if (!isAuthorized) {
    setResponseStatus(401)
    throw UnauthorizedException('Not authorized to edit this post')
  }

  try {
    const validatedData = await editPostSchema.parseAsync(values)

    const { sendDiscordNotification: _, ...postValues } = validatedData

    const slug = resolveSlug(postValues.slug, postValues.title)
    const excerpt = resolveExcerpt(postValues.excerpt, postValues.content)
    const publishedAt = resolvePublishedAt(postValues.publishedAt, postValues.status)

    await postRepository.update({ id: postId }, { ...postValues, slug, excerpt, publishedAt })

    if (post.discordMessageId && validatedData.status === POST_STATUS.PUBLISHED) {
      await editPostNotification({
        messageId: post.discordMessageId,
        title: validatedData.title,
        slug,
        publishedAt,
      })
    }

    return { success: true }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationErrors = getFieldErrors(err)
      setResponseStatus(400)
      return { success: false, error: null, validationErrors }
    }

    logger.error({ err, postId, userId: user.id }, 'Failed to update post')
    setResponseStatus(500)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

export async function createPost({
  data,
  user,
  currentCharacter,
}: {
  data: unknown
  user: User
  currentCharacter: { firstname?: string; lastname?: string } | null
}) {
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

    const currentCharacterFullName = [currentCharacter?.firstname, currentCharacter?.lastname]
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
        authorId: user.id,
      },
      { returning: ['id'] }
    )

    const postId = createdPost[0].id

    if (validatedData.sendDiscordNotification && validatedData.status === POST_STATUS.PUBLISHED) {
      const discordMessageId = await sendPostNotification({
        title: validatedData.title,
        slug,
        publishedAt,
      })

      if (discordMessageId) {
        await postRepository.update({ id: postId }, { discordMessageId })
      }
    }

    return { success: true, postId }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationErrors = getFieldErrors(err)
      setResponseStatus(400)
      return { success: false, validationErrors }
    }

    logger.error({ err, data, userId: user.id }, 'Failed to create post')
    setResponseStatus(500)
    return { success: false, error: 'Une erreur est survenue' }
  }
}
