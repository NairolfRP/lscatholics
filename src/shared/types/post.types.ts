import type { InferSelectModel } from 'drizzle-orm'
import type { POST_STATUS } from '../constants/post-status'
import type { posts } from '#server/db/schema'

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS]

export type Post = InferSelectModel<typeof posts>
