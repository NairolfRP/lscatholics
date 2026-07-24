import { createSlug } from '#/utils/string.ts'

export function resolveSlug(slug: string | undefined, title: string): string {
  if (slug) return slug
  return createSlug(title)
}
