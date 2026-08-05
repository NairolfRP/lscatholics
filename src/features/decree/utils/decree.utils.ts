import type { Snowflake } from 'discord-api-types/v10'
import {
  DECREE_CATEGORIES,
  DECREE_CATEGORY_BY_TAG_ID,
  DECREE_ENACTED_TAG,
  DECREE_IGNORED_TAGS,
  DECREE_IN_EFFECT_TAG,
} from '#/features/decree/constants/decree.constants.ts'
import type { DecreeCategory } from '#/features/decree/constants/decree.constants.ts'
import { createSlug } from '#/utils/string.ts'

/** Snowflakes are 17–20 digit decimal strings. */
const SNOWFLAKE_PATTERN = /^\d{17,20}$/

export function getThreadCategory(tags: readonly Snowflake[]): DecreeCategory | null {
  for (const tag of tags) {
    const category = DECREE_CATEGORY_BY_TAG_ID[tag]
    if (category) return category
  }
  return null
}

export function isThreadIgnored(tags: readonly Snowflake[]): boolean {
  return tags.some((tag) => DECREE_IGNORED_TAGS.has(tag))
}

export function isDecreeEnacted(tags: readonly Snowflake[]): boolean {
  return tags.includes(DECREE_ENACTED_TAG)
}

export function isDecreeInEffect(tags: readonly Snowflake[]): boolean {
  return tags.includes(DECREE_IN_EFFECT_TAG)
}

/**
 * A thread is publishable when it is not ignored and, for the enforceable categories,
 * has been enacted or is already in effect.
 */
export function isThreadPublishable(tags: readonly Snowflake[]): boolean {
  if (isThreadIgnored(tags)) return false

  const category = getThreadCategory(tags)
  if (category === null) return true
  if (!DECREE_CATEGORIES[category].requiresEnactment) return true

  return isDecreeEnacted(tags) || isDecreeInEffect(tags)
}

export function slugifyTitle(title: string): string {
  return createSlug(title)
}

/** `{threadId}-{slug}` — the public identifier used in `/decrees/:uid` URLs. */
export function buildDecreeUid(threadId: string, title: string): string {
  return `${threadId}-${slugifyTitle(title)}`
}

export function parseDecreeUid(uid: string): { threadId: string; slug: string } | null {
  const separatorIndex = uid.indexOf('-')
  if (separatorIndex <= 0) return null

  const threadId = uid.slice(0, separatorIndex)
  const slug = uid.slice(separatorIndex + 1)

  if (!SNOWFLAKE_PATTERN.test(threadId) || slug.length === 0) return null

  return { threadId, slug }
}

/** Descending chronological sort; threads without a timestamp go last. ISO strings compare lexically. */
export function compareByDateDesc(a: string | null, b: string | null): number {
  if (a === b) return 0
  if (a === null) return 1
  if (b === null) return -1
  return a < b ? 1 : -1
}
