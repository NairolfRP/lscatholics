/**
 * @param {string} text - String to slugify
 * @returns {string} Generated slug
 */
export function createSlug(text: string) {
  if (!text || typeof text !== 'string') return ''

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * @param content Source content (Markdown or plain text)
 * @param maxLength Maximum number of characters allowed (including “...” suffix)
 * @returns {string} Generated excerpt
 */
export function generateExcerpt(content: string, maxLength: number): string {
  if (maxLength <= 0) {
    return ''
  }

  const cleaned = stripMarkdown(content).replace(/\s+/g, ' ').trim()

  if (cleaned.length <= maxLength) {
    return cleaned
  }

  if (maxLength <= 3) {
    return cleaned.slice(0, maxLength)
  }

  const suffix = '...'
  const availableLength = maxLength - suffix.length

  let excerpt = cleaned.slice(0, availableLength)

  const lastSpace = excerpt.lastIndexOf(' ')

  if (lastSpace > 0) {
    excerpt = excerpt.slice(0, lastSpace)
  }

  return `${excerpt.trim()}${suffix}`
}

export function parseCsvString<T extends string[]>(str: string): T {
  return str.split(/\s*,+\s*/).filter(Boolean) as T
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_|~~)(.*?)\1/g, '$2')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/`([^`]+)`/g, '$1')
}
