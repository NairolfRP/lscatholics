import { createEnum } from '#shared/lib/enum.ts'

export const [POST_STATUS, POST_STATUS_VALUES] = createEnum({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
})
