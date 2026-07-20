import type { POST_STATUS } from '../constants/post-status'

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS]
