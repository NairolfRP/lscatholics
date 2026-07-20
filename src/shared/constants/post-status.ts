import { createEnum } from '#/utils/create-enum'

export const [POST_STATUS, POST_STATUS_VALUES] = createEnum({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
})
