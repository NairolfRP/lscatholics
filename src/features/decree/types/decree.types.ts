import type { DecreeCategory } from '#/features/decree/constants/decree.constants.ts'

export interface DecreeListItem {
  uid: string
  threadId: string
  title: string
  category: DecreeCategory
  publishedAt: string | null
}

export interface DecreeField {
  name: string
  value: string
}

export interface Decree {
  threadId: string
  uid: string
  title: string
  slug: string
  description: string
  publishedAt: string | null
  image: string | null
  fields: DecreeField[]
  category: DecreeCategory
  isEnacted: boolean
  isInEffect: boolean
}

export interface DecreesIndex {
  categories: Record<DecreeCategory, DecreeListItem[]>
  total: number
}

/** Single-decree payload. `canonicalUid` is used to detect (and redirect) stale slugs. */
export interface DecreeDetail {
  decree: Decree
  canonicalUid: string
}
