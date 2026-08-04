import type { CHURCH_SERVICE } from '#shared/constants/service.ts'

export type ChurchServiceId = (typeof CHURCH_SERVICE)[keyof typeof CHURCH_SERVICE]

export type ChurchServiceCategory = 'sacrements' | 'sacramentaux' | 'accompagnement'

export type ChurchServiceContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'blockquote'; text: string }
  | { type: 'note'; text: string }
  | { type: 'info'; text: string }
  | { type: 'ooc'; text: string }

export type ChurchService = {
  id: ChurchServiceId
  slug: string
  title: string
  description: string
  category: ChurchServiceCategory
  content: ChurchServiceContentBlock[]
}
