import type { DecreeCategory } from '#/features/decree/constants/decree.constants.ts'

export interface DecreeListItem {
  uid: string
  threadId: string
  title: string
  category: DecreeCategory
  publishedAt: string | null
}

/** A media item (image) referenced by a Discord components v2 payload. */
export interface DecreeMedia {
  url: string
  description: string | null
  /** Intrinsic dimensions, when Discord provides them. */
  width: number | null
  height: number | null
}

/**
 * Blocks extracted from a Discord components v2 payload, normalized for the web app.
 * Containers are flattened: their children are exposed as sibling blocks.
 */
export type DecreeBlock =
  | { kind: 'text'; content: string }
  | { kind: 'separator'; divider: boolean; spacing: 'small' | 'large' }
  | { kind: 'media'; items: DecreeMedia[] }
  | { kind: 'section'; content: string; accessory: DecreeMedia | null }

export interface Decree {
  threadId: string
  uid: string
  title: string
  slug: string
  publishedAt: string | null
  /** Ordered content of the decree. */
  blocks: DecreeBlock[]
  /** Plain-text summary of the decree, used for SEO metadata. */
  description: string
  /** First image of the decree, used as social preview. */
  image: string | null
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
