import { beforeEach, describe, expect, it, vi } from 'vitest'
import { canEditPost } from '#/features/post/utils/post.utils'
import { postRepository } from '#server/repositories/post.repository'
import * as postService from '#server/services/post.service'
import { POST_STATUS } from '#shared/constants/post-status.ts'
import type { User } from '#shared/lib/types/auth.ts'
import type { Post } from '#shared/types/post.types.ts'

vi.mock('#server/repositories/post.repository', () => ({
  postRepository: {
    getPost: vi.fn(),
    getPostWithAuthor: vi.fn(),
    getPosts: vi.fn(),
    deletePost: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    existsBySlug: vi.fn(),
  },
}))

vi.mock('#/features/post/utils/post.utils', () => ({
  canEditPost: vi.fn(),
  resolveExcerpt: vi.fn((e: string | undefined, c: string) => e ?? c.slice(0, 150)),
  resolvePublishedAt: vi.fn((d: Date | null | undefined) => d ?? null),
}))

vi.mock('#/utils/slug', () => ({
  resolveSlug: vi.fn(
    (s: string | undefined, t: string) => s ?? t.toLowerCase().replace(/\s+/g, '-')
  ),
}))

const notificationMocks = vi.hoisted(() => ({
  sendPostNotification: vi.fn(),
  editPostNotification: vi.fn(),
  deletePostNotification: vi.fn(),
}))

vi.mock('#/features/post/server/post-notification.service.ts', () => ({
  sendPostNotification: notificationMocks.sendPostNotification,
  editPostNotification: notificationMocks.editPostNotification,
  deletePostNotification: notificationMocks.deletePostNotification,
}))

const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'user-1@fake-email.placeholder',
  emailVerified: false,
  role: 'admin',
  banned: false,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}
const mockPost: Post = {
  id: 'post-1',
  title: 'My Post',
  slug: 'my-post',
  excerpt: 'My excerpt',
  category: null,
  content: 'Post content here',
  coverImageUrl: 'https://example.com/image.jpg',
  status: POST_STATUS.DRAFT,
  publishedAt: new Date('2025-01-01'),
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  authorDisplayName: 'John Doe',
  authorId: null,
  discordMessageId: null,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getPost', () => {
  it('returns a post when it exists', async () => {
    vi.mocked(postRepository.getPost).mockResolvedValue(mockPost)

    const result = await postService.getPost({ slug: 'my-post' })

    expect(result).toEqual(mockPost)
  })

  it('throws notFound when the post does not exist', async () => {
    vi.mocked(postRepository.getPost).mockResolvedValue(
      null as unknown as Awaited<ReturnType<typeof postRepository.getPost>>
    )

    await expect(postService.getPost({ slug: 'missing' })).rejects.toThrow('NOT_FOUND')
  })
})

describe('deletePost', () => {
  it('deletes and returns success when authorized', async () => {
    vi.mocked(postRepository.getPost).mockResolvedValue({
      ...mockPost,
      id: 'post-1',
      authorId: 'user-1',
    })
    vi.mocked(canEditPost).mockReturnValue(true)

    const result = await postService.deletePost({ postId: 'post-1', user: mockUser })

    expect(result).toEqual({ success: true })
    expect(postRepository.deletePost).toHaveBeenCalledWith({ id: 'post-1' })
  })

  it('throws NotFoundException when the post does not exist', async () => {
    vi.mocked(postRepository.getPost).mockResolvedValue(
      null as unknown as Awaited<ReturnType<typeof postRepository.getPost>>
    )

    await expect(postService.deletePost({ postId: 'missing', user: mockUser })).rejects.toThrow(
      'Post not found'
    )
  })

  it('throws UnauthorizedException when user cannot edit', async () => {
    vi.mocked(postRepository.getPost).mockResolvedValue({
      ...mockPost,
      id: 'post-1',
      authorId: 'other-user',
    })
    vi.mocked(canEditPost).mockReturnValue(false)

    await expect(postService.deletePost({ postId: 'post-1', user: mockUser })).rejects.toThrow(
      'Not authorized to delete this post'
    )
  })
})

describe('createPost', () => {
  it('returns success with postId on valid input', async () => {
    const validData = {
      title: 'New Post',
      content: 'Content here...',
      coverImageUrl: 'https://example.com/image.jpg',
      status: 'draft',
      publishedAt: null,
    }
    vi.mocked(postRepository.existsBySlug).mockResolvedValue(false)
    vi.mocked(postRepository.create).mockResolvedValue([{ ...mockPost, id: 'new-post-1' }])

    const result = await postService.createPost({
      data: validData,
      user: mockUser,
      currentCharacter: null,
    })

    expect(result).toEqual({ success: true, postId: 'new-post-1' })
  })

  it('returns validation errors on invalid input', async () => {
    const invalidData = { title: '', content: '' }

    const result = await postService.createPost({
      data: invalidData,
      user: mockUser,
      currentCharacter: null,
    })

    expect(result.success).toBe(false)
    expect(result).toHaveProperty('validationErrors')
  })

  it('sends notification when checkbox is checked and post is published', async () => {
    notificationMocks.sendPostNotification.mockResolvedValue('msg-1')
    vi.mocked(postRepository.existsBySlug).mockResolvedValue(false)
    vi.mocked(postRepository.create).mockResolvedValue([{ ...mockPost, id: 'new-post-1' }])

    await postService.createPost({
      data: {
        title: 'New Post',
        content: 'Content here...',
        coverImageUrl: 'https://example.com/image.jpg',
        status: 'published',
        publishedAt: new Date('2025-01-01'),
        sendDiscordNotification: true,
      },
      user: mockUser,
      currentCharacter: null,
    })

    expect(notificationMocks.sendPostNotification).toHaveBeenCalledWith({
      title: 'New Post',
      slug: 'new-post',
      publishedAt: new Date('2025-01-01'),
    })
    expect(postRepository.update).toHaveBeenCalledWith(
      { id: 'new-post-1' },
      { discordMessageId: 'msg-1' }
    )
  })

  it('does not send notification when checkbox is unchecked', async () => {
    vi.mocked(postRepository.existsBySlug).mockResolvedValue(false)
    vi.mocked(postRepository.create).mockResolvedValue([{ ...mockPost, id: 'new-post-1' }])

    await postService.createPost({
      data: {
        title: 'New Post',
        content: 'Content here...',
        coverImageUrl: 'https://example.com/image.jpg',
        status: 'published',
        publishedAt: new Date('2025-01-01'),
        sendDiscordNotification: false,
      },
      user: mockUser,
      currentCharacter: null,
    })

    expect(notificationMocks.sendPostNotification).not.toHaveBeenCalled()
  })

  it('does not send notification when post is a draft', async () => {
    vi.mocked(postRepository.existsBySlug).mockResolvedValue(false)
    vi.mocked(postRepository.create).mockResolvedValue([{ ...mockPost, id: 'new-post-1' }])

    await postService.createPost({
      data: {
        title: 'New Post',
        content: 'Content here...',
        coverImageUrl: 'https://example.com/image.jpg',
        status: 'draft',
        publishedAt: null,
        sendDiscordNotification: true,
      },
      user: mockUser,
      currentCharacter: null,
    })

    expect(notificationMocks.sendPostNotification).not.toHaveBeenCalled()
  })
})

describe('sendExistingPostNotification', () => {
  it('sends notification for a published post', async () => {
    vi.mocked(postRepository.getPost).mockResolvedValue({
      ...mockPost,
      status: POST_STATUS.PUBLISHED,
    })
    vi.mocked(canEditPost).mockReturnValue(true)
    notificationMocks.sendPostNotification.mockResolvedValue('msg-2')

    const result = await postService.sendExistingPostNotification({
      postId: 'post-1',
      user: mockUser,
    })

    expect(result).toEqual({ success: true })
    expect(notificationMocks.sendPostNotification).toHaveBeenCalledWith({
      title: 'My Post',
      slug: 'my-post',
      publishedAt: mockPost.publishedAt,
    })
  })

  it('returns error when post is not found', async () => {
    vi.mocked(postRepository.getPost).mockResolvedValue(
      null as unknown as Awaited<ReturnType<typeof postRepository.getPost>>
    )

    await expect(
      postService.sendExistingPostNotification({ postId: 'missing', user: mockUser })
    ).rejects.toThrow('Post not found')
  })

  it('returns error when post is not published', async () => {
    vi.mocked(postRepository.getPost).mockResolvedValue({
      ...mockPost,
      status: POST_STATUS.DRAFT,
    })

    const result = await postService.sendExistingPostNotification({
      postId: 'post-1',
      user: mockUser,
    })

    expect(result).toEqual({
      success: false,
      error: 'Seuls les articles publiés peuvent être notifiés',
    })
  })

  it('returns error when unauthorized', async () => {
    vi.mocked(postRepository.getPost).mockResolvedValue({
      ...mockPost,
      authorId: 'other-user',
    })
    vi.mocked(canEditPost).mockReturnValue(false)

    await expect(
      postService.sendExistingPostNotification({ postId: 'post-1', user: mockUser })
    ).rejects.toThrow('Not authorized to send notification for this post')
  })

  it('deletes old notification before sending a new one when discordMessageId exists', async () => {
    vi.mocked(postRepository.getPost).mockResolvedValue({
      ...mockPost,
      status: POST_STATUS.PUBLISHED,
      discordMessageId: 'old-msg-1',
    })
    vi.mocked(canEditPost).mockReturnValue(true)
    notificationMocks.sendPostNotification.mockResolvedValue('new-msg-1')

    await postService.sendExistingPostNotification({ postId: 'post-1', user: mockUser })

    expect(notificationMocks.deletePostNotification).toHaveBeenCalledWith({
      messageId: 'old-msg-1',
    })
    expect(notificationMocks.sendPostNotification).toHaveBeenCalledOnce()
  })
})
